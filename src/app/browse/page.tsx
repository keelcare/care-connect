'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function BrowsePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user?.role === 'nanny') {
        router.replace('/dashboard');
      } else {
        // Default for parents and others
        router.replace('/parent-dashboard');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
    </div>
  );
}
