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
  const [status, setStatus] = React.useState<string>('Initializing...');
  const [debugLog, setDebugLog] = React.useState<string[]>([]);
  const [hasProcessed, setHasProcessed] = React.useState(false);

  const addLog = (msg: string) => {
    console.log(msg);
    setDebugLog((prev) => [...prev, `${new Date().toISOString().split('T')[1].slice(0, 8)}: ${msg}`]);
  };

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) return;

    const handleCallback = async () => {
      setHasProcessed(true);
      addLog('Callback initiated');

      // Check for errors in query params
      const error = searchParams.get('error');
      if (error) {
        addLog(`Error param detected: ${error}`);
        setStatus(`Error: ${error}`);
        // Delay redirect to let user see error
        setTimeout(() => router.push(`/auth/login?error=${encodeURIComponent(error)}`), 3000);
        return;
      }

      try {
        // Check for token from backend (Token Exchange Flow)
        const token = searchParams.get('token');
        addLog(token ? `Token found in URL: ${token.substring(0, 10)}...` : 'No token in URL');
        
        if (token) {
          addLog('Exchanging token for session...');
          setStatus('Exchanging token...');
          try {
            await api.auth.setSession(token);
            addLog('Session set successfully');
          } catch (e: any) {
            addLog(`setSession failed: ${e.message}`);
            throw e;
          }
        } else {
             addLog('Proceeding with cookie check (legacy flow)...');
        }

        // With cookie-based auth, we just fetch the user.
        // The cookies are already set by the backend (via setSession or redirect)
        setStatus('Fetching user profile...');
        addLog('Calling api.users.me()...');
        const user = await api.users.me();
        addLog(`User fetch success: ${user.id}`);

        // If we get here, we are logged in
        setStatus('Login success! Redirecting...');
        await login(user);
        // AuthContext login will handle the redirect
      } catch (err: any) {
        const msg = err.message || 'Unknown error';
        addLog(`Callback failed: ${msg}`);
        setStatus(`Auth Failed: ${msg}`);
        console.error('Failed to verify session during callback:', err);
        // Do not redirect immediately so we can read the logs
      }
    };

    handleCallback();
  }, [searchParams, login, router, hasProcessed]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-teal-50 to-pink-50 p-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
         <h2 className="text-xl font-bold mb-4 text-center">{status}</h2>
         <div className="bg-gray-100 p-4 rounded text-xs font-mono h-64 overflow-y-auto">
            {debugLog.map((log, i) => (
                <div key={i} className="border-b border-gray-200 py-1">{log}</div>
            ))}
         </div>
         <div className="mt-4 text-center">
            <button 
                onClick={() => router.push('/auth/login')}
                className="text-primary hover:underline text-sm"
            >
                Return to Login
            </button>
         </div>
      </div>
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
