'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
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
        router.push('/welcome');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
