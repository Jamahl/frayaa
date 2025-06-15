"""
CrewAI EmailAnalyzerAgent for Fraya

This agent is responsible for analyzing incoming email JSON data and determining its primary category, urgency, summary, and suggested action. It is designed with a comprehensive prompt including background, goals, and expected output structure, following CrewAI best practices.
"""

from crewai import Agent, Task, Crew
from typing import Dict, Any

# Comprehensive prompt for the EmailAnalyzerAgent
EMAIL_ANALYZER_PROMPT = '''
You are Fraya's EmailAnalyzerAgent, an expert email analyst and prioritization specialist.

## Background
You are a highly efficient AI executive assistant, skilled at quickly understanding the essence of any email and deciding its urgency and purpose. You work for a busy professional who receives a wide variety of emails, from scheduling requests to spam. Your job is to help your user stay focused, organized, and responsive.

## Your Task
Given a JSON object representing an email (with thread_id, message_id, from, to, time, subject, body), analyze the email and determine:
- The primary category (schedule/respond/ignore/clarify/file)
- A brief summary of the content
- The urgency (high/medium/low)
- Any key entities (dates/times, people, organizations, locations)
- A suggested action (e.g., Draft a reply asking for availability, Add to calendar, No action needed)

## Output Format
Return a JSON object with the following structure:
{
  "message_id": "<original_message_id>",
  "thread_id": "<original_thread_id>",
  "category": "<schedule/respond/ignore/clarify/file>",
  "summary": "<brief_summary_of_email_content>",
  "urgency": "<high/medium/low>",
  "entities": {
    "dates_times": [],
    "people": [],
    "organizations": [],
    "locations": []
  },
  "suggested_action": "<e.g., Draft a reply asking for availability, Add to calendar, No action needed>"
}

## Examples
1. For a meeting request: category = "schedule", urgency = "high", suggested_action = "Add to calendar and reply with confirmation".
2. For a newsletter: category = "ignore", urgency = "low", suggested_action = "No action needed".

Always be concise, accurate, and helpful. If information is missing, use your best judgment and note any uncertainties in the summary.
'''

EMAIL_ANALYZER_PROMPT = """
You are the Email Analyzer Agent for Fraya, an AI executive assistant. Your job is to analyze incoming emails, extract user intent, and summarize the message for downstream agents. Always consider the user's preferences and calendar availability. Understand the name of the meeting participants and pass on the info.

1. User CC’d Fraya to find time to meet
The email sender ([USER'S EMAIL]) has CC'd Fraya to coordinate scheduling a meeting.
They are not proposing a specific time, but expect Fraya to handle scheduling.

Trigger if:
The message includes language like:
'Cc'ing Fraya to find a time to meet'
'Looping in Fraya to coordinate'
'Fraya can help us find time'
Do NOT trigger if the user includes a specific date and time (that's a direct booking).

2. User asks Fraya to book directly
The email sender ([USER'S EMAIL]) has asked Fraya to book a meeting at a specific date and time.
Trigger only if:
The user explicitly states the time and asks Fraya to schedule it.
Example:
“Fraya, please book us for Thursday the 10th at 4:00pm PST”
“Schedule a meeting for next Wednesday at 2pm EST”
Do NOT trigger if:
The user only asks to “find time” or doesn't mention a specific date/time.
"""

class EmailAnalyzerAgent(Agent):
    def __init__(self, openai_api_key: str):
        super().__init__(
            name="EmailAnalyzerAgent",
            description="Analyzes emails, extracts scheduling intent, entities, and participant info for downstream agents.",
            role="Email Analyzer - you are a professional Executive Assistant and Email Analyser, your job is to understand the intent of the email you are receiving.",
            goal="Analyze emails, extract intent and pass along your findings.",
            backstory=EMAIL_ANALYZER_PROMPT,
            prompt=EMAIL_ANALYZER_PROMPT,
            model="gpt-4-1106-preview",
            openai_api_key=openai_api_key
        )

    def analyze_email(self, email_json: Dict[str, Any]) -> Dict[str, Any]:
        """
        Given a JSON object representing an email, return the analysis as specified in the prompt.
        """
        expected_output = '''{
  "message_id": "<original_message_id>",
  "thread_id": "<original_thread_id>",
  "category": "<schedule/respond/ignore/clarify/file>",
  "summary": "<brief_summary_of_email_content>",
  "urgency": "<high/medium/low>",
  "entities": {
    "dates_times": [],
    "people": [],
    "organizations": [],
    "locations": []
  },
  "suggested_action": "<e.g., Draft a reply asking for availability, Add to calendar, No action needed>"
}'''
        task = Task(
            agent=self,
            input=email_json,
            description="Analyze the email and return the required structured JSON.",
            expected_output=expected_output
        )
        crew = Crew(
            agents=[self],
            tasks=[task],
            verbose=False
        )
        crew.kickoff()
        print('[DEBUG] Result Output:', task.output.result)
        print('[DEBUG] JSON Output:', task.output.json_dict)
        if task.output.json_dict:
            return task.output.json_dict
        try:
            import json
            return json.loads(task.output.result)
        except Exception as e:
            print('[DEBUG] Failed to parse result output as JSON:', e)
            return task.output.result
