import os
import sys
import time
from dotenv import load_dotenv
# Always load the .env from apps/api/.env so GOOGLE_CLIENT_ID, etc. are present
load_dotenv(dotenv_path=os.path.abspath(os.path.join(os.path.dirname(__file__), '../../apps/api/.env')))
from gmail import list_unread_emails
from googleapiclient.discovery import build
import requests
from google.oauth2.credentials import Credentials

# For production: Store processed message IDs in Supabase to prevent duplicates.
# This script is for development/demo only.

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')


def get_unread_emails(user_id, max_results=10):
    """
    Fetch unread emails for a user (INBOX, is:unread).
    Returns a list of message metadata dicts.
    Robust error handling for missing/invalid tokens and expiry.
    """
    import datetime
    resp = requests.get(f"http://localhost:8001/api/google-tokens/{user_id}/")
    resp.raise_for_status()
    tokens = resp.json()

    # Check for required fields
    required_fields = [
        ('google_access_token', tokens.get('google_access_token')),
        ('google_refresh_token', tokens.get('google_refresh_token')),
        ('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID),
        ('GOOGLE_CLIENT_SECRET', GOOGLE_CLIENT_SECRET),
    ]
    for name, val in required_fields:
        if not val:
            print(f"[ERROR] Required credential '{name}' is missing or empty for user {user_id}.")
            return [], None

    # Log expiry
    expiry = tokens.get('google_token_expiry')
    now = datetime.datetime.utcnow().isoformat()
    print(f"[DEBUG] Token expiry: {expiry} | Current time (UTC): {now}")

    try:
        creds = Credentials(
            tokens['google_access_token'],
            refresh_token=tokens['google_refresh_token'],
            token_uri='https://oauth2.googleapis.com/token',
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            scopes=[
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/calendar',
            ],
        )
        service = build('gmail', 'v1', credentials=creds)
        results = service.users().messages().list(
            userId='me',
            labelIds=['INBOX'],
            maxResults=max_results,
            q='is:unread',  # Only unread emails
        ).execute()
        messages = results.get('messages', [])
        detailed = []
        for msg in messages:
            msg_detail = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
            detailed.append(msg_detail)
        return detailed, service
    except Exception as e:
        err_str = str(e)
        print(f"[ERROR] Google API error: {err_str}")
        if 'invalid_grant' in err_str or 'revoked' in err_str or 'invalid_request' in err_str:
            print("[ACTION REQUIRED] Google refresh token is invalid or revoked. User must re-authenticate via OAuth flow.")
        return [], None


def extract_metadata(message):
    """
    Extract and return key metadata from a Gmail message resource.
    """
    headers = {h['name'].lower(): h['value'] for h in message.get('payload', {}).get('headers', [])}
    body = ''
    parts = message.get('payload', {}).get('parts', [])
    if 'data' in message.get('payload', {}).get('body', {}):
        import base64
        body = base64.urlsafe_b64decode(message['payload']['body']['data']).decode('utf-8', errors='ignore')
    elif parts:
        for part in parts:
            if part.get('mimeType') == 'text/plain' and 'data' in part.get('body', {}):
                import base64
                body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8', errors='ignore')
                break
    return {
        'id': message.get('id'),
        'thread_id': message.get('threadId'),
        'from': headers.get('from', ''),
        'to': headers.get('to', ''),
        'date': headers.get('date', ''),
        'subject': headers.get('subject', ''),
        'snippet': message.get('snippet', ''),
        'body': body,
        'label_ids': message.get('labelIds', []),
        'size_estimate': message.get('sizeEstimate', None),
    }


def print_message(msg):
    print("\n================ EMAIL ================")
    print(f"ID:         {msg['id']}")
    print(f"Thread ID:  {msg['thread_id']}")
    print(f"From:       {msg['from']}")
    print(f"To:         {msg['to']}")
    print(f"Date:       {msg['date']}")
    print(f"Subject:    {msg['subject']}")
    print(f"Snippet:    {msg['snippet']}")
    print(f"Body:       {msg['body'][:500]}")  # Print first 500 chars
    print(f"Labels:     {msg['label_ids']}")
    print(f"Size:       {msg['size_estimate']}")
    print("======================================\n")


def main():
    """
    Polls for new/unread emails every 30 seconds, processes each with CrewAI, and marks them as read.
    Usage: python poll_gmail.py <user_id>
    """
    import importlib
    import os
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../agents')))
    test_email_workflow = importlib.import_module('agents.test_email_workflow')
    if len(sys.argv) != 2:
        print("Usage: python poll_gmail.py <user_id>")
        sys.exit(1)
    user_id = sys.argv[1]
    print(f"Polling Gmail inbox for user: {user_id}")
    while True:
        try:
            messages, service = get_unread_emails(user_id, max_results=10)
            for msg in messages:
                meta = extract_metadata(msg)
                print_message(meta)
                # Call CrewAI pipeline with this email (simulate by passing as example_email)
                print("[CrewAI] Processing email with agents...")
                try:
                    # Use the workflow pipeline, passing meta as the input email
                    test_email_workflow.main(example_email=meta)
                except Exception as agent_err:
                    print(f"Error running CrewAI workflow: {agent_err}")

            print("--- Waiting 30 seconds before next poll ---\n")
        except Exception as e:
            print(f"Error polling Gmail: {e}")
        time.sleep(30)

if __name__ == "__main__":
    main()
