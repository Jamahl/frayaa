"""
calendar_tools.py

CrewAI tools for Google Calendar integration: search, create, update, cancel events.
"""

from crewai import Tool
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import datetime
import logging

class SearchCalendarEventsTool(Tool):
    name = "search_calendar_events"
    description = "Search for upcoming events in the user's Google Calendar."

    def __init__(self, creds):
        super().__init__()
        self.creds = creds

    def run(self, query=None, time_min=None, time_max=None, max_results=10):
        try:
            service = build('calendar', 'v3', credentials=self.creds)
            now = datetime.datetime.utcnow().isoformat() + 'Z'
            events_result = service.events().list(
                calendarId='primary',
                timeMin=time_min or now,
                timeMax=time_max,
                maxResults=max_results,
                singleEvents=True,
                orderBy='startTime',
                q=query or None
            ).execute()
            events = events_result.get('items', [])
            return {"status": "ok", "events": events}
        except Exception as e:
            logging.error(f"Failed to search calendar events: {e}")
            return {"status": "error", "error": str(e)}

class CreateCalendarEventTool(Tool):
    name = "create_calendar_event"
    description = "Create a new event in the user's Google Calendar."

    def __init__(self, creds):
        super().__init__()
        self.creds = creds

    def run(self, summary, start_time, end_time, attendees=None, description=None, location=None):
        try:
            service = build('calendar', 'v3', credentials=self.creds)
            event = {
                'summary': summary,
                'start': {'dateTime': start_time, 'timeZone': 'UTC'},
                'end': {'dateTime': end_time, 'timeZone': 'UTC'},
            }
            if attendees:
                event['attendees'] = [{'email': email} for email in attendees]
            if description:
                event['description'] = description
            if location:
                event['location'] = location
            created_event = service.events().insert(calendarId='primary', body=event).execute()
            return {"status": "created", "event": created_event}
        except Exception as e:
            logging.error(f"Failed to create calendar event: {e}")
            return {"status": "error", "error": str(e)}

class UpdateCalendarEventTool(Tool):
    name = "update_calendar_event"
    description = "Update an existing event in the user's Google Calendar."

    def __init__(self, creds):
        super().__init__()
        self.creds = creds

    def run(self, event_id, updates):
        try:
            service = build('calendar', 'v3', credentials=self.creds)
            event = service.events().get(calendarId='primary', eventId=event_id).execute()
            event.update(updates)
            updated_event = service.events().update(calendarId='primary', eventId=event_id, body=event).execute()
            return {"status": "updated", "event": updated_event}
        except Exception as e:
            logging.error(f"Failed to update calendar event: {e}")
            return {"status": "error", "error": str(e)}

class CancelCalendarEventTool(Tool):
    name = "cancel_calendar_event"
    description = "Cancel (delete) an event in the user's Google Calendar."

    def __init__(self, creds):
        super().__init__()
        self.creds = creds

    def run(self, event_id):
        try:
            service = build('calendar', 'v3', credentials=self.creds)
            service.events().delete(calendarId='primary', eventId=event_id).execute()
            return {"status": "cancelled", "event_id": event_id}
        except Exception as e:
            logging.error(f"Failed to cancel calendar event: {e}")
            return {"status": "error", "error": str(e)}
