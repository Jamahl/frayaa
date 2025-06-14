import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from api.google_tokens import get_google_tokens_for_user

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')


def list_unread_emails(user_id):
    """
    List unread emails for the given user using their Google OAuth tokens.
    Only to be called from backend/internal services. Never expose tokens or results to client directly.
    Returns a list of unread message metadata (IDs, etc.).
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
    results = service.users().messages().list(userId='me', labelIds=['INBOX'], q='is:unread').execute()
    return results.get('messages', [])
