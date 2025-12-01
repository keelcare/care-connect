"use client";

import { Hero } from "@/components/features/Hero";
import { FeaturedServices } from "@/components/features/FeaturedServices";
import { TrustedBy } from "@/components/features/TrustedBy";
import { HowItWorks } from "@/components/features/HowItWorks";
import { CTASection } from "@/components/features/CTASection";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SplashLoader } from "@/components/ui/SplashLoader";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  // Redirect logged-in nannies to dashboard
  React.useEffect(() => {
    if (!loading && user?.role === 'nanny') {
      router.push('/dashboard');
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

  // Don't render home page for nannies (they'll be redirected)
  if (user?.role === 'nanny') {
    return null;
  }

  return (
    <>
      {showSplash && <SplashLoader onFinish={handleSplashFinish} />}
      <Hero />
      <TrustedBy />
      <FeaturedServices />
      <HowItWorks />
      <CTASection />
    </>
  );
}
