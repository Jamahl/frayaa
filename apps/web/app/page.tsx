'use client'

import Link from 'next/link';
import Image from 'next/image';
import './homepage.css';

export default function Home() {
  return (
    <div className="home-root">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo">
            fraya
            <span className="home-logo-icon" aria-label="brand status" />
          </div>
          <Link href="/dashboard" aria-label="Go to Dashboard">
            <button className="home-header-btn">Go to Dashboard</button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="home-hero">
          <h1 className="home-hero-title">
            Work. Life. <span className="accent">Handled.</span>
          </h1>
          <p className="home-hero-desc">
            Meet <span style={{ fontWeight: 600 }}>Fraya</span> — the executive assistant that manages your calendar, email, and all the details of your work-life so you never have to sweat the small stuff again.
          </p>
          <Link href="/login" aria-label="Login with Google">
            <button className="home-cta-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ verticalAlign: 'middle' }}><g fill="none" fillRule="evenodd"><path d="M23.04 12.26c0-.84-.08-1.66-.23-2.44H12v4.62h6.24c-.27 1.44-1.09 2.66-2.32 3.48v2.88h3.76c2.2-2.03 3.36-5.03 3.36-8.54z" fill="#4285F4"/><path d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.76-2.88c-1.04.7-2.37 1.12-4.19 1.12-3.22 0-5.95-2.18-6.92-5.12H1.18v3.02C3.16 21.98 7.24 24 12 24z" fill="#34A853"/><path d="M5.08 14.21A7.23 7.23 0 0 1 4.5 12c0-.77.13-1.52.36-2.21V6.77H1.18A12.02 12.02 0 0 0 0 12c0 1.89.45 3.68 1.18 5.23l3.9-3.02z" fill="#FBBC05"/><path d="M12 4.75c1.77 0 3.36.61 4.62 1.81l3.46-3.46C17.94 1.07 15.22 0 12 0 7.24 0 3.16 2.02 1.18 6.77l3.9 3.02C6.05 6.93 8.78 4.75 12 4.75z" fill="#EA4335"/><path d="M0 0h24v24H0z"/></g></svg>
              Login with Google
            </button>
          </Link>
          <Image
            src="/illustration.jpg"
            alt="Person working at a computer"
            className="home-hero-img"
            width={800} height={320}
          />
        </section>

        {/* Feature Cards Section */}
        <section className="home-cards">
          <div className="home-card">
            <div className="home-card-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M2 4.5A2.5 2.5 0 014.5 2h15A2.5 2.5 0 0122 4.5v15A2.5 2.5 0 0119.5 22h-15A2.5 2.5 0 012 19.5v-15z" fill="#2563eb"/><path d="M3.5 6.5l8.5 7 8.5-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="home-card-title">Inbox Zero, Effortlessly</div>
            <div className="home-card-desc">AI-powered email triage and smart replies.</div>
            <div className="home-card-desc">Fraya keeps your inbox organized and helps you respond faster.</div>
            <div className="home-card-icon" style={{ background: '#bbf7d0' }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="4" fill="#22c55e"/><path d="M7 2v4M17 2v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="10" width="2" height="2" rx="1" fill="#fff"/><rect x="11" y="10" width="2" height="2" rx="1" fill="#fff"/><rect x="15" y="10" width="2" height="2" rx="1" fill="#fff"/></svg>
            </div>
            <div className="home-card-title">Effortless Scheduling</div>
            <div className="home-card-desc">Smart calendar management and meeting booking.</div>
            <div className="home-card-desc">Fraya finds the best times, books meetings, and keeps your calendar organized.</div>
          </div>
          <div className="home-card">
            <div className="home-card-icon" style={{ background: '#ede9fe' }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#a78bfa"/><path d="M9 10h6M9 14h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="home-card-title">AI That Works for You</div>
            <div className="home-card-desc">CrewAI agents handle repetitive tasks and reminders.</div>
            <div className="home-card-desc">Focus on what matters—Fraya’s agents handle the rest, 24/7.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
