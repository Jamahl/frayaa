"""
Test script for EmailAnalyzerAgent
"""
import os
import json
from email_analyzer_agent import EmailAnalyzerAgent
from dotenv import load_dotenv

# Load .env from apps/api if not already set
if "OPENAI_API_KEY" not in os.environ:
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../apps/api/.env'))

# Example email JSON (matches poller output)
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

if __name__ == "__main__":
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable not set.")
    agent = EmailAnalyzerAgent(openai_api_key=openai_api_key)
    result = agent.analyze_email(example_email)
    print("\n[EmailAnalyzerAgent Output]\n", result)
