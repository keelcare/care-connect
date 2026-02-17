'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { Container } from '@/components/layout/Container';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect nannies to dashboard
  React.useEffect(() => {
    if (!loading && user?.role === 'nanny') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render parent layout for nannies
  if (user?.role === 'nanny') {
    return null;
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Unified Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="pt-24 pb-24 lg:pb-8">
        <Container padding="responsive">
          {children}
        </Container>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavBar />
    </div>
  );
}
