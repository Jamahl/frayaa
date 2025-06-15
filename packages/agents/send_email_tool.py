"""
send_email_tool.py

CrewAI tool for sending emails using the Gmail API.
"""

from crewai import Tool
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import base64
from email.mime.text import MIMEText
import logging

class SendEmailTool(Tool):
    name = "send_email"
    description = "Send an email using the Gmail API."

    def __init__(self, creds):
        super().__init__()
        self.creds = creds

    def run(self, to, subject, body, from_email=None):
        """
        Send an email using the Gmail API.
        Args:
            to: recipient email address
            subject: email subject
            body: email body
            from_email: sender email address (optional)
        """
        try:
            service = build('gmail', 'v1', credentials=self.creds)
            message = MIMEText(body)
            message['to'] = to
            message['subject'] = subject
            if from_email:
                message['from'] = from_email
            raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
            send_result = service.users().messages().send(
                userId='me', body={'raw': raw}
            ).execute()
            logging.info(f"Email sent to {to}, message id: {send_result.get('id')}")
            return {"status": "sent", "message_id": send_result.get('id')}
        except Exception as e:
            logging.error(f"Failed to send email: {e}")
            return {"status": "error", "error": str(e)}
