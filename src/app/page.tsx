'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import React from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'parent') {
          router.push('/parent-dashboard');
        } else if (user.role === 'nanny') {
          router.push('/dashboard');
        } else if (user.role === 'admin') {
          router.push('/admin');
        }
      } else {
        const isNative = Capacitor.isNativePlatform();
        router.push(isNative ? '/auth/login' : '/welcome');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
