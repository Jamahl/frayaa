'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-20">
          <span className="text-3xl font-black tracking-tight text-blue-900 select-none">Fraya</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 py-20 px-6">
        {/* Left: Tagline and CTA */}
        <section className="flex-1 flex flex-col items-start justify-center">
          <h1 className="text-5xl md:text-6xl font-black leading-tight text-blue-950 mb-6 tracking-tight">
            AI Executive<br className="hidden md:block" /> Assistant, <span className="text-blue-600">Reimagined</span>
          </h1>
          <p className="text-2xl text-gray-700 mb-10 max-w-xl font-light">
            Automate your inbox. Master your schedule. <br className="hidden md:block" />Let Fraya handle the busywork so you can focus on what matters.
          </p>
          <Link href="/login">
            <Button size="lg" className="px-10 py-5 text-2xl font-bold shadow-xl rounded-full bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-4 focus-visible:ring-blue-300 focus:outline-none transition" aria-label="Sign in to Fraya">
              Get Started
            </Button>
          </Link>
        </section>
        {/* Right: Hero Illustration */}
        <section className="flex-1 flex items-center justify-center w-full">
          <div className="w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-[3rem] bg-gradient-to-br from-blue-200 to-blue-400 shadow-2xl flex items-center justify-center">
            {/* Soft, modern SVG illustration */}
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
              <ellipse cx="110" cy="140" rx="90" ry="60" fill="#dbeafe" />
              <circle cx="110" cy="100" r="70" fill="#fff" />
              <rect x="70" y="80" width="80" height="40" rx="20" fill="#2563eb" />
              <ellipse cx="110" cy="100" rx="14" ry="14" fill="#fff" />
              <rect x="100" y="120" width="20" height="8" rx="4" fill="#fff" />
              <ellipse cx="110" cy="70" rx="30" ry="10" fill="#93c5fd" opacity="0.3" />
            </svg>
          </div>
        </section>
      </main>

      {/* Feature Cards Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-center pb-24 px-6">
        <Card className="flex-1 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow bg-white/90 border-0">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-blue-100 rounded-2xl p-3">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M2 4.5A2.5 2.5 0 014.5 2h15A2.5 2.5 0 0122 4.5v15A2.5 2.5 0 0119.5 22h-15A2.5 2.5 0 012 19.5v-15z" fill="#2563eb"/><path d="M3.5 6.5l8.5 7 8.5-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-blue-900">Inbox Automation</CardTitle>
              <CardDescription className="text-base text-gray-500">Fraya triages, sorts, and responds to emails for you.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-base mt-3">Save hours every week as Fraya handles the busywork in your Gmail inbox.</div>
          </CardContent>
        </Card>
        <Card className="flex-1 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow bg-white/90 border-0">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-green-100 rounded-2xl p-3">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="4" fill="#22c55e"/><path d="M7 2v4M17 2v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="10" width="2" height="2" rx="1" fill="#fff"/><rect x="11" y="10" width="2" height="2" rx="1" fill="#fff"/><rect x="15" y="10" width="2" height="2" rx="1" fill="#fff"/></svg>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-blue-900">Effortless Scheduling</CardTitle>
              <CardDescription className="text-base text-gray-500">Smart calendar management and meeting booking.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-base mt-3">Fraya finds the best times, books meetings, and keeps your calendar organized.</div>
          </CardContent>
        </Card>
        <Card className="flex-1 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow bg-white/90 border-0">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-purple-100 rounded-2xl p-3">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#a78bfa"/><path d="M9 10h6M9 14h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-blue-900">AI That Works for You</CardTitle>
              <CardDescription className="text-base text-gray-500">CrewAI agents handle repetitive tasks and reminders.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-base mt-3">Focus on what matters—Fraya’s agents handle the rest, 24/7.</div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
