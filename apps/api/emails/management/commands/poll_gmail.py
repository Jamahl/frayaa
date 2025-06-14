import os
import time
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google.auth.exceptions import RefreshError
from django.conf import settings
from supabase import create_client, Client as SupabaseClient
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Polls Gmail for new emails and stores them in Supabase'

    def handle(self, *args, **options):
        self.supabase: SupabaseClient = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        
        self.stdout.write('Starting Gmail poller...')
        
        while True:
            try:
                self.poll_emails()
                # Sleep for 30 seconds between polls
                time.sleep(30)
            except Exception as e:
                logger.error(f"Error in Gmail poller: {str(e)}")
                time.sleep(30)  # Wait before retrying on error

    def get_user_tokens(self):
        """Fetch all users with Google refresh tokens"""
        try:
            response = self.supabase.table('users').select('*').not_.is_('google_refresh_token', 'null').execute()
            return response.data if hasattr(response, 'data') else []
        except Exception as e:
            logger.error(f"Error fetching user tokens: {str(e)}")
            return []

    def get_gmail_service(self, refresh_token):
        """Create Gmail API service with the given refresh token"""
        try:
            creds = Credentials(
                token=None,
                refresh_token=refresh_token,
                token_uri='https://oauth2.googleapis.com/token',
                client_id=settings.GOOGLE_CLIENT_ID,
                client_secret=settings.GOOGLE_CLIENT_SECRET
            )

            # Refresh the token
            creds.refresh(Request())
            
            # Update the refresh token in the database if it changed
            if creds.refresh_token and creds.refresh_token != refresh_token:
                self.supabase.table('users').update(
                    {'google_refresh_token': creds.refresh_token}
                ).eq('google_refresh_token', refresh_token).execute()
            
            return build('gmail', 'v1', credentials=creds, static_discovery=False)
        except RefreshError as e:
            logger.error(f"Error refreshing Google token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error creating Gmail service: {str(e)}")
            return None

    def poll_emails(self):
        """Poll Gmail for new emails for all users"""
        users = self.get_user_tokens()
        
        if not users:
            self.stdout.write("No users with Google refresh tokens found.")
            return
            
        self.stdout.write(f"Found {len(users)} users with Google tokens")
        
        for user in users:
            try:
                user_id = user['id']
                user_email = user.get('email', 'Unknown')
                self.stdout.write(f"Processing emails for user: {user_email} ({user_id})")
                
                gmail = self.get_gmail_service(user['google_refresh_token'])
                
                if not gmail:
                    self.stdout.write(f"Failed to create Gmail service for user: {user_email}")
                    continue
                
                # Fetch only the latest emails from the inbox
                results = gmail.users().messages().list(
                    userId='me',
                    q='in:inbox',
                    maxResults=10
                ).execute()
                
                messages = results.get('messages', [])
                self.stdout.write(f"Found {len(messages)} latest messages for {user_email}")
                
                for msg in messages:
                    try:
                        self.process_message(gmail, msg['id'], user_id)
                    except Exception as e:
                        logger.error(f"Error processing message {msg['id']}: {str(e)}")
                

            except Exception as e:
                logger.error(f"Error processing user {user.get('email', 'Unknown')}: {str(e)}")

    def process_message(self, gmail, msg_id, user_id):
        """Process a single email message"""
        try:
            msg = gmail.users().messages().get(userId='me', id=msg_id, format='full').execute()
            
            # Extract headers
            headers = {}
            for header in msg.get('payload', {}).get('headers', []):
                headers[header['name'].lower()] = header['value']

            # Extract body
            def extract_body(payload):
                if 'parts' in payload:
                    for part in payload['parts']:
                        if part['mimeType'] == 'text/plain':
                            return self.decode_body(part.get('body', {}))
                        elif part['mimeType'] == 'text/html':
                            html = self.decode_body(part.get('body', {}))
                            if html:
                                return html
                        elif 'parts' in part:
                            # Recursively search nested parts
                            body = extract_body(part)
                            if body:
                                return body
                return self.decode_body(payload.get('body', {}))

            body = extract_body(msg.get('payload', {}))

            import json
            # Prepare email data for CrewAI agent consumption
            email_for_agent = {
                'user_id': user_id,
                'thread_id': msg.get('threadId'),
                'message_id': msg_id,
                'from_email': headers.get('from', ''),
                'to_email': headers.get('to', ''),
                'received_at': self.parse_email_date(headers.get('date')),
                'subject': headers.get('subject', '(No Subject)'),
                'body': body,
                'snippet': msg.get('snippet', ''),
                'is_read': 'UNREAD' not in msg.get('labelIds', []),
                'labels': msg.get('labelIds', []),
                'raw_headers': headers
            }
            print("\n[AGENT EMAIL JSON]\n" + json.dumps(email_for_agent, indent=2, ensure_ascii=False) + "\n")
            # Do not store this in DB, just output for agent workflow

        except Exception as e:
            logger.error(f"Error processing message {msg_id}: {str(e)}")

    def decode_body(self, body_dict):
        import base64
        data = body_dict.get('data')
        if not data:
            return ''
        try:
            return base64.urlsafe_b64decode(data.encode('ASCII')).decode('utf-8', errors='replace')
        except Exception:
            return ''

    def get_last_processed_timestamp(self, user_id):
        """Get the timestamp of the last processed email for a user"""
        try:
            response = self.supabase.table('email_sync_status') \
                .select('last_processed_at') \
                .eq('user_id', user_id) \
                .single().execute()
                
            if hasattr(response, 'data') and response.data:
                return datetime.fromisoformat(response.data['last_processed_at'].replace('Z', '+00:00'))
            return None
        except Exception as e:
            logger.debug(f"No previous sync found for user {user_id}: {str(e)}")
            return None

    def update_last_processed(self, user_id):
        """Update the last processed timestamp for a user"""
        now = datetime.utcnow().isoformat()
        try:
            self.supabase.table('email_sync_status').upsert(
                {
                    'user_id': user_id,
                    'last_processed_at': now,
                    'updated_at': 'now()'
                },
                on_conflict='user_id'
            ).execute()
        except Exception as e:
            logger.error(f"Error updating last processed timestamp: {str(e)}")

    def parse_email_date(self, date_str):
        from email.utils import parsedate_to_datetime
        try:
            if date_str:
                dt = parsedate_to_datetime(date_str)
                # If naive datetime, assume UTC
                if dt.tzinfo is None:
                    from datetime import timezone
                    dt = dt.replace(tzinfo=timezone.utc)
                return dt.isoformat()
        except Exception as e:
            logger.warning(f"Failed to parse email date '{date_str}': {e}")
        from datetime import datetime, timezone
        return datetime.now(timezone.utc).isoformat()

    def store_email(self, email_data):
        """Store email in Supabase"""
        try:
            self.supabase.table('emails').upsert(
                email_data,
                on_conflict='gmail_message_id,user_id'
            ).execute()
            logger.info(f"Stored email: {email_data.get('subject')}")
        except Exception as e:
            logger.error(f"Error storing email: {str(e)}")
