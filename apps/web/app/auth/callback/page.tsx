'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Wait for Supabase to process the OAuth callback and set the session
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.replace('/login?error=auth_failed');
          return;
        }

        // Add a short delay for smoother UX (optional, can remove if not desired)
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (data.session && data.session.user) {
          // Valid session and user present, sync Google tokens with Django backend
          try {
            const syncRes = await fetch(
              process.env.NEXT_PUBLIC_API_URL
                ? `${process.env.NEXT_PUBLIC_API_URL}/google-tokens/`
                : 'http://localhost:8000/google-tokens/',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // For cookie/session if needed
                body: JSON.stringify({ supabase_user_id: data.session.user.id }),
              }
            );
            const syncJson = await syncRes.json();
            if (!syncRes.ok || !syncJson.success) {
              console.error('Failed to sync Google tokens:', syncJson.error || syncJson);
              router.replace('/login?error=token_sync_failed');
              return;
            }
            // Success: redirect to dashboard
            router.replace('/dashboard');
          } catch (err) {
            console.error('Unexpected error syncing tokens:', err);
            router.replace('/login?error=token_sync_unexpected');
            return;
          }
        } else {
          // No session/user, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.replace('/login?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}

