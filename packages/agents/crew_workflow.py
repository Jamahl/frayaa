"""
crew_workflow.py

Entry point for Fraya AI CrewAI workflow integration.
This module receives new emails and routes them to the CrewAI crew for contextual analysis and action (e.g., booking meetings, drafting/sending replies).

Backstory, crew structure, and agent roles are aligned with architecture.md and tasks.md.

This file exposes process_email(email_json) as the main entry point for polling scripts.
"""

from crewai import Agent, Task, Crew
from .agent_prompts import EMAIL_ANALYZER_PROMPT, REPLY_AGENT_PROMPT, REPLY_TEMPLATE
from .send_email_tool import SendEmailTool
import logging

VERBOSE = True  # Toggle verbose debug output here

def process_email(email_json, creds=None):
    """
    Process a single email JSON object through the CrewAI pipeline.
    creds: Gmail API credentials for sending replies (required)
    """
    preferences = {
        "name": email_json.get("to", ""),
        "preferred_days": ["Tuesday", "Wednesday"],
        "preferred_times": "09:00-11:00",
        "tone": "professional",
        "style": "concise",
        "user_id": email_json.get("user_id", "")
    }
    # Define CrewAI tools
    send_email_tool = SendEmailTool(creds)
    tools = [send_email_tool]

    # Define CrewAI agents
    analyzer_agent = Agent(
        role="Email Analyzer - you are a professional Executive Assistant and Email Analyser, your job is to understand the intent of the email you are receiving.",
        goal="Analyze emails, extract intent and pass along your findings.",
        backstory=EMAIL_ANALYZER_PROMPT,
        tools=[],
        verbose=True,
    )
    reply_agent = Agent(
        role="Reply Agent - you are a professional Executive Assistant.",
        goal="For meeting-related intents (schedule, reschedule, cancel), send the reply email using the Gmail API via the send_email tool. Do not just draft.",
        backstory=REPLY_AGENT_PROMPT,
        tools=tools,
        verbose=True,
    )
    # Define tasks
    analyze_task = Task(
        description="Analyze the incoming email and extract scheduling intent.",
        expected_output="Intent, entities, and calendar events as JSON with an 'intent' field (e.g., 'schedule', 'reschedule', 'cancel', 'ignore').",
        agent=analyzer_agent
    )
    reply_task = Task(
        description="If the intent is meeting-related (schedule, reschedule, cancel), send the reply email using the send_email tool.",
        expected_output="Reply email sent confirmation. Always end with Fraya - Jamahl's AI Executive Assistant. Always refer to the participants by their names, do not make them up or guess.",
        agent=reply_agent
    )
    # Create the crew
    crew = Crew(
        agents=[analyzer_agent, reply_agent],
        tasks=[analyze_task, reply_task],
        verbose=True,
        step_callback=print
    )
    # Run the crew (analyze first)
    result = crew.kickoff(email_json)
    print("[CrewAI] FINAL OUTPUT:", result)
    logging.info(f"[CrewAI] Final output: {result}")
    return result
