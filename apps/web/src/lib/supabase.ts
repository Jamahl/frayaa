import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our database
export type User = {
  id: string
  email: string
  google_refresh_token?: string
  created_at: string
}

export type Preferences = {
  id: string
  user_id: string
  preferred_days: string[]
  preferred_times: string[]
  buffer_minutes: number
  tone: string
  style: string
  created_at: string
  updated_at: string
}
