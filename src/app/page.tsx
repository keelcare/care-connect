'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import React, { useState, useCallback } from 'react';
import { SplashLoader } from '@/components/ui/SplashLoader';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === 'parent') {
        router.push('/parent-dashboard');
      } else if (user.role === 'nanny') {
        router.push('/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin');
      }
    }
  }, [user, loading, router]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
    if (!user && !loading) {
      const isNative = Capacitor.isNativePlatform();
      router.push(isNative ? '/auth/login' : '/welcome');
    }
  }, [user, loading, router]);

  // If loading auth state, just show the spinner behind/in place of splash
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is resolved, we either redirecting (handled in effect) or showing splash
  if (user) return null;

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
