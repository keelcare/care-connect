'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PremiumNavbar } from '@/components/layout/Navbar/PremiumNavbar';
import BottomNavBar from '@/components/layout/BottomNavBar';

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
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-8 h-8 border-4 border-[#1F6F5B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render parent layout for nannies
  if (user?.role === 'nanny') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Premium Navbar */}
      <PremiumNavbar />

      {/* Main Content Area */}
      <main className="pt-24 pb-24 lg:pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavBar />
    </div>
  );
}
