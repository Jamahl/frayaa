"""
CalendarAgent for CrewAI: Handles scheduling, rescheduling, or cancelling meetings based on analysis and user preferences.
"""
from crewai import Agent

CALENDAR_AGENT_PROMPT = """
You are the Calendar Agent for Fraya, an AI executive assistant. Your job is to handle all calendar-related actions based on the analysis from the Email Analyzer Agent. Use the user's preferences and current calendar availability to:
- Propose available meeting times if a meeting is requested
- Confirm, reschedule, or cancel meetings as required
- Always refer to participants by their real names (never guess or make up names)
- If you need to propose times, use the user's preferred days/times and avoid conflicts
- If a meeting is booked, confirm the details in your output
Return all actions and decisions as structured JSON.
"""

class CalendarAgent(Agent):
    def __init__(self, openai_api_key: str):
        super().__init__(
            name="CalendarAgent",
            description="Handles scheduling, rescheduling, or cancelling meetings using analysis and preferences.",
            role="Expert Calendar Scheduling Specialist",
            goal="Manage meetings and propose/confirm times using user preferences and analysis context.",
            backstory=CALENDAR_AGENT_PROMPT,
            prompt=CALENDAR_AGENT_PROMPT,
            model="gpt-4-1106-preview",
            openai_api_key=openai_api_key
        )
