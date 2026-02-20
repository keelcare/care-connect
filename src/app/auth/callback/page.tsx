'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import styles from './page.module.css';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [hasProcessed, setHasProcessed] = React.useState(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) return;

    const handleCallback = async () => {
      setHasProcessed(true);

      // Check for errors in query params
      const error = searchParams.get('error');
      if (error) {
        console.error('Auth error:', error);
        router.push(`/auth/login?error=${encodeURIComponent(error)}`);
        return;
      }

      try {
        // Check for token from backend (Token Exchange Flow)
        const token = searchParams.get('token');
        
        if (token) {
          // Instantly wipe the massive token from the user's URL bar for a cleaner experience
          window.history.replaceState({}, document.title, window.location.pathname);
          
          console.log('Exchanging token for session...');
          await api.auth.setSession(token);
        }

        // With cookie-based auth, we just fetch the user.
        // The cookies are already set by the backend (via setSession or redirect)
        console.log('Fetching user data for callback...');
        const user = await api.users.me();

        // If we get here, we are logged in
        await login(user);
        // AuthContext login will handle the redirect
      } catch (err) {
        console.error('Failed to verify session during callback:', err);
        router.push('/auth/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, login, router, hasProcessed]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-linear-to-br from-teal-50 to-pink-50">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.spinner} />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
