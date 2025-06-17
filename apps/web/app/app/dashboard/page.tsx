'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Fraya</h1>
              <span className="ml-2 text-sm text-gray-500">AI Executive Assistant</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Welcome Card */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Welcome to Fraya! 🎉</CardTitle>
                <CardDescription>
                  Your AI executive assistant is ready to help manage your Gmail and Google Calendar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Authentication Complete!</strong> You&apos;ve successfully connected your Google account. 
                    The next steps will include setting up Gmail monitoring and calendar management.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Email Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>📧 Email Monitoring</CardTitle>
                <CardDescription>Gmail integration status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gmail Connected</span>
                    <span className="text-sm font-medium text-green-600">✓ Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Monitoring</span>
                    <span className="text-sm font-medium text-yellow-600">⏳ Coming Soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>📅 Calendar Management</CardTitle>
                <CardDescription>Google Calendar integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Calendar Connected</span>
                    <span className="text-sm font-medium text-green-600">✓ Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Smart Scheduling</span>
                    <span className="text-sm font-medium text-yellow-600">⏳ Coming Soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Agent Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>🤖 AI Agents</CardTitle>
                <CardDescription>CrewAI agent status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Analyzer</span>
                    <span className="text-sm font-medium text-gray-400">⏳ Not Setup</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Calendar Agent</span>
                    <span className="text-sm font-medium text-gray-400">⏳ Not Setup</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reply Agent</span>
                    <span className="text-sm font-medium text-gray-400">⏳ Not Setup</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}
