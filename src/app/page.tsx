'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import React, { useState, useCallback, useEffect } from 'react';
import { SplashLoader } from '@/components/ui/SplashLoader';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem('splashShown') === 'true') {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = useCallback(() => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  }, []);

  // Centralized redirection logic
  useEffect(() => {
    if (!mounted) return;

    // We only redirect once the splash animation is over AND auth check is complete
    if (!showSplash && !loading) {
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
  }, [user, loading, showSplash, mounted, router]);

  if (!mounted) return null;

  // Always show splash until finished to ensure a smooth transition
  return (
    <>
      {showSplash && <SplashLoader onFinish={handleSplashFinish} />}
      {!showSplash && (
        <div className="min-h-dvh flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
}
