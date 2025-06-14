'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // If user signs in, create/update user record in our database
        if (event === 'SIGNED_IN' && session?.user) {
          await createOrUpdateUser(session.user)
          
          // If we have a refresh token, store it in Supabase users table
          if (session.provider_refresh_token) {
            try {
              const { error } = await supabase
                .from('users')
                .update({
                  google_refresh_token: session.provider_refresh_token,
                  google_token_expiry: session.provider_token ? new Date(Date.now() + 3600 * 1000).toISOString() : null
                })
                .eq('id', session.user.id)

              if (error) {
                console.error('Failed to store Google refresh token:', error)
              } else {
                console.log('Successfully stored Google refresh token in Supabase')
              }
            } catch (error) {
              console.error('Error storing Google refresh token:', error)
            }
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const createOrUpdateUser = async (user: User) => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })

      if (error) {
        console.error('Error creating/updating user:', error)
      } else {
        console.log('Successfully created/updated user')
      }
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Error signing in with Google:', error)
        throw error
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
