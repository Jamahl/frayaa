'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import './login.css'

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const error = searchParams.get('error')

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Failed to sign in:', error)
      setIsSigningIn(false)
    }
  }

  if (loading) {
    return (
      <div className="login-root">
        <div className="login-spinner" />
      </div>
    )
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-header">
          <div className="login-title">Fraya</div>
          <div className="login-desc">Your AI Executive Assistant</div>
        </div>
        <div className="login-title" style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '1.3rem', marginBottom: 0 }}>Welcome to Fraya</div>
        <div className="login-desc" style={{ marginBottom: '1.2rem' }}>Sign in with Google to connect your Gmail and Calendar</div>
        {error && (
          <div className="login-error">
            {error === 'auth_failed'
              ? 'Authentication failed. Please try again.'
              : error === 'unexpected'
              ? 'Unexpected error during authentication.'
              : 'An unknown error occurred.'}
          </div>
        )}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className="login-btn"
          aria-label="Sign in with Google"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ verticalAlign: 'middle' }}>
            <g>
              <path fill="#4285F4" d="M21.805 10.023h-9.18v3.956h5.627c-.244 1.3-1.547 3.825-5.627 3.825-3.386 0-6.15-2.805-6.15-6.25s2.764-6.25 6.15-6.25c1.93 0 3.23.82 3.97 1.53l2.71-2.62C17.16 2.69 14.77 1.5 12 1.5 6.75 1.5 2.25 6.02 2.25 12s4.5 10.5 9.75 10.5c5.64 0 9.36-3.97 9.36-9.56 0-.64-.07-1.13-.16-1.61z"/>
              <path fill="#34A853" d="M3.545 7.68l3.29 2.41C7.46 8.32 9.54 6.75 12 6.75c1.44 0 2.74.5 3.76 1.46l2.82-2.75C16.46 3.96 14.44 3 12 3c-3.94 0-7.24 3.13-8.45 7.68z"/>
              <path fill="#FBBC05" d="M12 21c2.44 0 4.46-.8 5.95-2.19l-2.74-2.24c-.77.53-1.76.84-3.21.84-2.5 0-4.61-1.68-5.37-3.95l-3.25 2.5C4.75 19.05 8.06 21 12 21z"/>
              <path fill="#EA4335" d="M21.805 10.023h-9.18v3.956h5.627c-.244 1.3-1.547 3.825-5.627 3.825-3.386 0-6.15-2.805-6.15-6.25s2.764-6.25 6.15-6.25c1.93 0 3.23.82 3.97 1.53l2.71-2.62C17.16 2.69 14.77 1.5 12 1.5 6.75 1.5 2.25 6.02 2.25 12s4.5 10.5 9.75 10.5c5.64 0 9.36-3.97 9.36-9.56 0-.64-.07-1.13-.16-1.61z"/>
            </g>
          </svg>
          {isSigningIn ? 'Signing in...' : 'Continue with Google'}
        </button>
        <div className="login-agreement">
          By signing in, you agree to connect your Gmail and Google Calendar to Fraya for intelligent email and calendar management.
        </div>
      </div>
    </div>
  )
}
