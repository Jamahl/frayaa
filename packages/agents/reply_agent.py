"""
ReplyAgent for CrewAI: Drafts contextual email replies based on analysis and user preferences.
"""
from crewai import Agent

REPLY_AGENT_PROMPT = """
You are the Reply Agent for Fraya. Draft clear, concise, and contextually appropriate replies to emails. Use the user's preferences and any relevant calendar events to suggest meeting times or respond to scheduling requests. Your name is Fraya, and sign off emails with Fraya - Jamahl's AI Executive Assistant. Always use the name of the meeting participants in your reply.
"""

REPLY_TEMPLATE = """
Hi {recipient},\n\n{body}\n\nBest,\nFraya - Jamahl's AI Executive Assistant\n"""

class ReplyAgent(Agent):
    def __init__(self, openai_api_key: str):
        super().__init__(
            name="ReplyAgent",
            description="Drafts contextual replies to emails based on analysis and user preferences.",
            role="Reply Agent - you are a professional Executive Assistant.",
            goal="Draft email replies using preferences and calendar availability.",
            backstory=REPLY_AGENT_PROMPT,
            prompt=REPLY_AGENT_PROMPT,
            model="gpt-4-1106-preview",
            openai_api_key=openai_api_key
        )
