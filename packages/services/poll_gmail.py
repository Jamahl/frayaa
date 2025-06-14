import os
import sys
import time
from gmail import list_unread_emails
from googleapiclient.discovery import build
from api.google_tokens import get_google_tokens_for_user
from google.oauth2.credentials import Credentials

# For production: Store processed message IDs in Supabase to prevent duplicates.
# This script is for development/demo only.

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')


def get_recent_emails(user_id, max_results=10):
    """
    Fetch the most recent emails for a user, sorted by date descending.
    Returns a list of message metadata dicts.
    """
    tokens = get_google_tokens_for_user(user_id)
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
        q='',  # Empty query gets all, sorted by date desc
    ).execute()
    messages = results.get('messages', [])
    detailed = []
    for msg in messages:
        msg_detail = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
        detailed.append(msg_detail)
    return detailed


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
    Polls for the most recent emails every 30 seconds and prints them in a readable format.
    Usage: python poll_gmail.py <user_id>
    """
    if len(sys.argv) != 2:
        print("Usage: python poll_gmail.py <user_id>")
        sys.exit(1)
    user_id = sys.argv[1]
    print(f"Polling Gmail inbox for user: {user_id}")
    seen_ids = set()  # In production, persist this in Supabase
    while True:
        try:
            messages = get_recent_emails(user_id, max_results=10)
            for msg in messages:
                meta = extract_metadata(msg)
                if meta['id'] not in seen_ids:
                    print_message(meta)
                    seen_ids.add(meta['id'])
            print("--- Waiting 30 seconds before next poll ---\n")
        except Exception as e:
            print(f"Error polling Gmail: {e}")
        time.sleep(30)

if __name__ == "__main__":
    main()
