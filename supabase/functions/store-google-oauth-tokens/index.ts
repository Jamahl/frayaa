// Supabase Edge Function: store-google-oauth-tokens
// This function runs on user sign-in and stores Google OAuth tokens securely in the users table.
// Docs: https://supabase.com/docs/guides/functions

import { serve } from 'std/http/server.ts'

// Types for Supabase Auth webhook payload
interface AuthEvent {
  event: string
  session?: {
    user: {
      id: string
      email: string
      user_metadata: any
      identities: Array<{
        provider: string
        provider_id: string
        identity_data: {
          access_token?: string
          refresh_token?: string
          expires_at?: number
        }
      }>
    }
    provider_token?: string
    provider_refresh_token?: string
    expires_at?: number
  }
}

serve(async (req) => {
  try {
    const body = await req.json() as AuthEvent
    if (body.event !== 'USER_SIGNED_IN' || !body.session) {
      return new Response('Not a sign-in event', { status: 200 })
    }

    const user = body.session.user
    // Find Google identity
    const googleIdentity = user.identities?.find(i => i.provider === 'google')
    if (!googleIdentity) {
      return new Response('No Google identity found', { status: 200 })
    }

    // Extract tokens
    const accessToken = googleIdentity.identity_data.access_token || body.session.provider_token
    const refreshToken = googleIdentity.identity_data.refresh_token || body.session.provider_refresh_token
    const expiresAt = googleIdentity.identity_data.expires_at || body.session.expires_at

    if (!accessToken || !refreshToken || !expiresAt) {
      return new Response('Missing Google tokens', { status: 400 })
    }

    // Update user record in public.users
    const supabaseAdminKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    if (!supabaseAdminKey || !supabaseUrl) {
      return new Response('Missing environment variables', { status: 500 })
    }

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseAdminKey,
        'Authorization': `Bearer ${supabaseAdminKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        google_access_token: accessToken,
        google_refresh_token: refreshToken,
        google_token_expiry: new Date(expiresAt * 1000).toISOString()
      })
    })

    if (!updateRes.ok) {
      const err = await updateRes.text()
      return new Response(`Failed to update user: ${err}`, { status: 500 })
    }

    return new Response('Google tokens stored successfully', { status: 200 })
  } catch (err) {
    return new Response(`Error: ${err}`, { status: 500 })
  }
})
