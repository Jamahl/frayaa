"""
Test script for multi-agent CrewAI workflow: EmailAnalyzerAgent + ReplyAgent.
"""
import os
from email_analyzer_agent import EmailAnalyzerAgent
from calendar_agent import CalendarAgent
from reply_agent import ReplyAgent
from crewai import Task, Crew
from dotenv import load_dotenv

# Load .env from apps/api if not already set
if "OPENAI_API_KEY" not in os.environ:
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../apps/api/.env'))

# Example real email JSON
example_email = {
    "user_id": "6a9bda06-7325-4421-9b7f-532defcc2928",
    "thread_id": "1976ccafe512c906",
    "message_id": "18e1f8b5e4c2c9e2",
    "from_email": "ZEKKEI <mkt@fiweex.com>",
    "to_email": "jamahl.mcmurran@gmail.com",
    "received_at": "2025-06-14T04:36:22+00:00",
    "subject": "Celebra el Dia del Padre en Zekkei",
    "body": "¡Celebra el Día del Padre con nosotros! Descubre nuestras ofertas exclusivas para papás.",
    "snippet": "¡Celebra el Día del Padre con nosotros!",
    "is_read": False,
    "labels": ["INBOX", "CATEGORY_PROMOTIONS", "UNREAD"],
    "raw_headers": {
        "from": "ZEKKEI <mkt@fiweex.com>",
        "to": "jamahl.mcmurran@gmail.com",
        "date": "Sat, 14 Jun 2025 04:36:22 +0000",
        "subject": "Celebra el Dia del Padre en Zekkei"
    }
}

def main(example_email=None):
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable not set.")
    # Instantiate agents
    analyzer = EmailAnalyzerAgent(openai_api_key=openai_api_key)
    calendar = CalendarAgent(openai_api_key=openai_api_key)
    replier = ReplyAgent(openai_api_key=openai_api_key)

    # Use provided email if given (from poll_gmail), else default
    email_input = example_email if example_email is not None else {
        "user_id": "6a9bda06-7325-4421-9b7f-532defcc2928",
        "thread_id": "1976ccafe512c906",
        "message_id": "18e1f8b5e4c2c9e2",
        "from_email": "ZEKKEI <mkt@fiweex.com>",
        "to_email": "jamahl.mcmurran@gmail.com",
        "received_at": "2025-06-14T04:36:22+00:00",
        "subject": "Celebra el Dia del Padre en Zekkei",
        "body": "¡Celebra el Día del Padre con nosotros! Descubre nuestras ofertas exclusivas para papás.",
        "snippet": "¡Celebra el Día del Padre con nosotros!",
        "is_read": False,
        "labels": ["INBOX", "CATEGORY_PROMOTIONS", "UNREAD"],
        "raw_headers": {
            "from": "ZEKKEI <mkt@fiweex.com>",
            "to": "jamahl.mcmurran@gmail.com",
            "date": "Sat, 14 Jun 2025 04:36:22 +0000",
            "subject": "Celebra el Dia del Padre en Zekkei"
        }
    }

    # Task 1: Analyze Email
    analysis_task = Task(
        agent=analyzer,
        input=email_input,
        description="Analyze the incoming email and extract scheduling intent, participants, and entities.",
        expected_output="Intent, entities, and calendar events."
    )

    # Task 2: Calendar action (context = analysis_task)
    calendar_task = Task(
        agent=calendar,
        description="Handle scheduling, rescheduling, or cancelling meetings based on analysis.",
        expected_output="Calendar action result, available times, or confirmation.",
        context=[analysis_task]
    )

    # Task 3: Draft Reply (context = analysis_task + calendar_task)
    reply_task = Task(
        agent=replier,
        description="Draft a reply if the intent is scheduling, rescheduling, or cancelling a meeting. Always end with Fraya - Jamahl's AI Executive Assistant. Always refer to the participants by their names, do not make them up or guess.",
        expected_output="Drafted reply. Always end with Fraya - Jamahl's AI Executive Assistant.",
        context=[analysis_task, calendar_task]
    )

    # Multi-agent crew
    crew = Crew(
        agents=[analyzer, calendar, replier],
        tasks=[analysis_task, calendar_task, reply_task],
        verbose=True
    )
    crew.kickoff()

    print("\n[EmailAnalyzerAgent Output]\n", analysis_task.output.result)
    print("\n[CalendarAgent Output]\n", calendar_task.output.result)
    print("\n[ReplyAgent Output]\n", reply_task.output.result)

if __name__ == "__main__":
    main()
