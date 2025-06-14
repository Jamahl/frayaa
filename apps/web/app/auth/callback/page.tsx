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
        console.log('[AuthCallback] window.location:', window.location.href);
        console.log('[AuthCallback] getSession() result:', data, error);

        if (error) {
          console.error('Auth callback error:', error);
          router.replace('/login?error=auth_failed');
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 400));

        if (data.session && data.session.user) {
          console.log('[AuthCallback] Session and user found, redirecting to /dashboard:', data.session.user);
          router.replace('/dashboard');
        } else {
          console.warn('[AuthCallback] No session or user found after auth, redirecting to /login', { session: data.session });
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
