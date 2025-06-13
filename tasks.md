# MVP Build Plan: Fraya

Each task below is atomic, testable, and focused on one clear concern. Follow each step sequentially for smooth testing and integration.

---

## 1. Project Setup

### 1.1 Initialize Repositories

* Create GitHub repo
* Clone repo locally
* Set up commit linting, Prettier, ESLint

### 1.2 Setup Next.js Frontend

* Create Next.js app using `create-next-app`
* Add Tailwind CSS and ShadCN UI
* Deploy Hello World to Vercel

### 1.3 Setup Django Backend

* Scaffold Django project
* Add Django REST Framework
* Enable CORS + connect to frontend locally

### 1.4 Connect Supabase

* Set up project + get keys
* Connect Supabase to Django
* Create `users` and `preferences` tables

---

## 2. Authentication + Google Integration

### 2.1 Implement Auth Flow

* Set up Supabase Auth (email/password + Google OAuth)
* Test login + signup flow on frontend

### 2.2 Google OAuth + Token Storage

* Configure Google Cloud App
* Use Next.js API routes to handle OAuth token exchange
* Save refresh + access tokens securely
* we are using google auth via supabase, so think how we should handle this

---

## 3. Gmail Listener + Display

### 3.1 Setup Gmail Watcher (Local Testing)

* Use ngrok to tunnel local backend
* Setup Gmail Pub/Sub + Webhook for incoming emails

### 3.2 Print Email to Terminal

* Log: sender, subject, body, to, cc, time
* Format nicely for readability

### 3.3 Convert to JSON for Agent

* Extract email fields
* Return clean JSON object

---

## 4. Agent Framework (CrewAI)

### 4.1 Scaffold CrewAI Agent

* Define Fraya's backstory, goals, personality
* Define initial agent: EmailAnalyzer

### 4.2 Email Analyzer

* Load JSON email into CrewAI
* Return: category (schedule, respond, ignore)

### 4.3 Add CalendarManager + EmailResponder

* Create CalendarManager agent
* Create EmailResponder agent

### 4.4 Task Delegation

* CrewAI routes task from analyzer to proper agent

---

## 5. Calendar Management

### 5.1 Google Calendar SDK Integration

* Connect to user's calendar via saved credentials
* Fetch upcoming events

### 5.2 Add Event

* Create meeting with summary, time, guests
* Confirm in Google Calendar UI

### 5.3 Delete Event

* Agent deletes meeting
* Confirm it's removed from calendar

---

## 6. Sending Email

### 6.1 Gmail API Email Sending

* Use user token to send email from `jamahl@sociimoney.com`
* Confirm email sent via Gmail UI

### 6.2 Use AI for Response Composition

* EmailResponder crafts reply using OpenAI
* Sends using Gmail API

---

## 7. Frontend UI

### 7.1 Homepage + Auth

* Landing page with login/signup
* Login redirects to dashboard

### 7.2 Dashboard Stats View

* Meetings booked (count)
* Next meeting info

### 7.3 Preferences Settings Page

* Preferred days
* Meeting length
* Buffers
* Email tone + writing style
* Save to Supabase `preferences`

---

## 8. Production Deployment

### 8.1 Setup Vercel Production Frontend

* Connect GitHub repo
* Deploy + test frontend

### 8.2 Deploy Django on Windsurf

* Add production env vars
* Deploy + confirm API connectivity

---

##  Final Tests

* Email receipt → agent flow
* Calendar integration end-to-end
* Email sending from Fraya
* User preferences influence agent behavior

---

## 9. Post-MVP Maintenance (Optional)

### 9.1 Logging and Monitoring

* Add logging to backend services (Django, agents)
* Integrate Sentry or equivalent for error tracking

### 9.2 Background Task Scheduling

* Setup cron jobs (Celery or Django-Q) for polling, reminders, cleanups

### 9.3 Admin Tools

* Build simple admin panel to view recent emails/actions
* Add impersonation/view-as feature for support
