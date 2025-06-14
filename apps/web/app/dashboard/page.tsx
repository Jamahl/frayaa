'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
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
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold tracking-tight text-blue-900">Fraya</span>
              <span className="hidden sm:inline text-base text-gray-400 font-medium">AI Executive Assistant</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-base text-gray-700">{user.email}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border border-gray-200 shadow-sm">
                    <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto py-10 px-4 sm:px-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="rounded-3xl bg-gradient-to-r from-blue-100 to-white shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Welcome, {user.email?.split('@')[0] || 'User'}! 👋</h2>
              <p className="text-lg text-gray-600 mb-4">Your AI assistant is ready to make your workday effortless. Here’s what’s next:</p>
              <ul className="list-disc list-inside text-gray-500 space-y-1">
                <li>✅ Google authentication complete</li>
                <li>⏳ Gmail monitoring setup (coming soon)</li>
                <li>⏳ Smart calendar management (coming soon)</li>
                <li>⏳ AI agent automations (coming soon)</li>
              </ul>
            </div>
            <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center shadow-inner">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="12" fill="#fff" />
                <path d="M17 8.5C17 9.88071 15.8807 11 14.5 11C13.1193 11 12 9.88071 12 8.5C12 7.11929 13.1193 6 14.5 6C15.8807 6 17 7.11929 17 8.5Z" fill="#2563eb"/>
                <rect x="6.5" y="13" width="11" height="4" rx="2" fill="#2563eb"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Status Cards Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gmail Status */}
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="bg-blue-100 rounded-xl p-2">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M2 4.5A2.5 2.5 0 014.5 2h15A2.5 2.5 0 0122 4.5v15A2.5 2.5 0 0119.5 22h-15A2.5 2.5 0 012 19.5v-15z" fill="#2563eb"/><path d="M3.5 6.5l8.5 7 8.5-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Gmail</CardTitle>
                  <CardDescription className="text-sm">Connected</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-green-600 font-semibold text-base">
                  <span>✓ Active</span>
                </div>
                <div className="mt-2 text-gray-500 text-sm">Gmail account is connected. Email monitoring coming soon.</div>
              </CardContent>
            </Card>

            {/* Calendar Status */}
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="bg-green-100 rounded-xl p-2">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="4" fill="#22c55e"/><path d="M7 2v4M17 2v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="10" width="2" height="2" rx="1" fill="#fff"/><rect x="11" y="10" width="2" height="2" rx="1" fill="#fff"/><rect x="15" y="10" width="2" height="2" rx="1" fill="#fff"/></svg>
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
                  <CardDescription className="text-sm">Connected</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-green-600 font-semibold text-base">
                  <span>✓ Active</span>
                </div>
                <div className="mt-2 text-gray-500 text-sm">Google Calendar is connected. Smart scheduling coming soon.</div>
              </CardContent>
            </Card>

            {/* AI Agent Status */}
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="bg-purple-100 rounded-xl p-2">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#a78bfa"/><path d="M9 10h6M9 14h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">AI Agents</CardTitle>
                  <CardDescription className="text-sm">CrewAI</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-yellow-600 font-semibold text-base">
                  <span>⏳ Coming Soon</span>
                </div>
                <div className="mt-2 text-gray-500 text-sm">AI automations and delegated tasks will appear here.</div>
              </CardContent>
            </Card>

          </div>
        </section>
      </main>
    </div>
  );
}
