'use client';

import { LandingPage } from '@/components/landing-new/LandingPage';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SplashLoader } from '@/components/ui/SplashLoader';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  // Redirect logged-in users to their respective dashboards
  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === 'nanny') {
        router.push('/dashboard');
      } else if (user.role === 'parent') {
        router.push('/browse');
      } else if (user.role === 'admin') {
        router.push('/admin');
      }
    }
  }, [user, loading, router]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render home page for logged-in users (they'll be redirected)
  if (user) {
    return null;
  }

  return (
    <>
      {showSplash && <SplashLoader onFinish={handleSplashFinish} />}
      <LandingPage />
    </>
  );
}
