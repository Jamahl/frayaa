'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import './dashboard.css';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
  <div className="dashboard-logo">
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Fraya Logo">
      <ellipse cx="60" cy="20" rx="50" ry="16" fill="#a78bfa" />
      <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" dy=".3em">Fraya</text>
    </svg>
  </div>
  <span className="dashboard-subtitle">AI Executive Assistant</span>
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <span style={{ display: 'none' }}>{user?.email}</span>
    <Link href="/dashboard/preferences" aria-label="Preferences">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20} style={{ marginRight: 4 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.142-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.774-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Preferences
    </Link>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</header>

      {/* Main Content */}
      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <h2>Welcome, {user?.email?.split('@')[0] || 'User'}! 👋</h2>
          <p>Your AI assistant is ready to make your workday effortless. Here’s what’s next:</p>
          <ul>
            <li>✅ Google authentication complete</li>
            <li>⏳ Gmail monitoring setup (coming soon)</li>
            <li>⏳ Smart calendar management (coming soon)</li>
            <li>⏳ AI agent automations (coming soon)</li>
          </ul>
        </section>

      {/* Status Cards Section */}
      <section className="dashboard-cards-grid">
        <div className="dashboard-card">
          <div>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M2 4.5A2.5 2.5 0 014.5 2h15A2.5 2.5 0 0122 4.5v15A2.5 2.5 0 0119.5 22h-15A2.5 2.5 0 012 19.5v-15z" fill="#2563eb"/><path d="M3.5 6.5l8.5 7 8.5-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div className="dashboard-card-title">Gmail</div>
            <div className="dashboard-card-desc">Connected</div>
          </div>
          <div>
            <span>✓ Active</span>
            <div>Gmail account is connected. Email monitoring coming soon.</div>
          </div>
        </div>
        <div className="dashboard-card">
          <div>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="4" fill="#22c55e"/><path d="M7 2v4M17 2v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="10" width="2" height="2" rx="1" fill="#fff"/><rect x="11" y="10" width="2" height="2" rx="1" fill="#fff"/><rect x="15" y="10" width="2" height="2" rx="1" fill="#fff"/></svg>
          </div>
          <div>
            <div className="dashboard-card-title">Calendar</div>
            <div className="dashboard-card-desc">Connected</div>
          </div>
          <div>
            <span>✓ Active</span>
            <div>Google Calendar is connected. Smart scheduling coming soon.</div>
          </div>
        </div>
        <div className="dashboard-card">
          <div>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#a78bfa"/><path d="M9 10h6M9 14h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <div className="dashboard-card-title">AI Agents</div>
            <div className="dashboard-card-desc">CrewAI</div>
          </div>
          <div>
            <span>⏳ Coming Soon</span>
            <div>AI automations and delegated tasks will appear here.</div>
          </div>
        </div>
      </section>
    </main>
  </div>
);
}
