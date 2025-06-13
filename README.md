# Fraya - AI Executive Assistant

Fraya is an AI executive assistant that autonomously manages Gmail and Google Calendar on your behalf. It can read, understand, and respond to emails; book, reschedule, and cancel meetings; and adapts its tone and behavior based on your preferences.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Django (Python), Celery (optional for async)
- **AI Engine**: OpenAI + CrewAI framework
- **Database**: Supabase (Postgres)
- **Auth**: Google OAuth via Supabase & Google SDK
- **Email/Calendar**: Gmail API, Google Calendar API
- **Local Dev**: ngrok (for testing webhooks/Google Auth)
- **Deployment**: Windsurf (Django) + Vercel (Next.js)

## Project Structure

```
fraya/
├── apps/
│   ├── web/                        # Next.js frontend
│   ├── api/                        # Django backend
├── packages/
│   ├── agents/                     # CrewAI agents: email, calendar, reply
│   ├── prompts/                   # Prompt templates (tone, behavior, task goals)
│   ├── services/                  # Gmail + Calendar integrations
│   ├── utils/                     # Shared helpers: formatting, auth, time logic
├── supabase/
│   ├── migrations/
│   ├── seed/
├── infra/
│   ├── scripts/
│   ├── ngrok.sh
│   └── vercel.json
├── .env.local
└── README.md
```

## Getting Started

1. Clone the repository
2. Set up environment variables
3. Install dependencies
4. Run the development servers

More detailed setup instructions will be added as the project develops.

## Development

This project follows a modular architecture with clear separation between frontend, backend, and AI agent components.
