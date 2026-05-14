'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Centralized redirection logic
  useEffect(() => {
    if (!mounted) return;

    // Redirect instantly when auth check is done. 
    // The SplashLoader (now in RootLayout) will cover this routing transition.
    if (!loading) {
      if (user) {
        // Logged in users go directly to their dashboard
        if (user.role === 'parent') {
          router.push('/parent-dashboard');
        } else if (user.role === 'nanny') {
          router.push('/dashboard');
        } else if (user.role === 'admin') {
          router.push('/admin');
        }
      } else {
        // Unauthenticated users go to landing
        const isNative = Capacitor.isNativePlatform();
        router.push(isNative ? '/welcome-mobile' : '/welcome');
      }
    }
  }, [user, loading, mounted, router]);

  // Render nothing. The global SplashLoader covers the screen, and we route instantly.
  return null;
}
