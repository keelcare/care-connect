import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from './Hero';
import { BentoServices } from './BentoServices';

import { SafetyPromise } from './SafetyPromise';
import { CTA } from './CTA';
import { Footer } from './Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-terracotta selection:text-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <BentoServices />
        <SafetyPromise />

        <CTA />
      </main>
      <Footer />
    </div>
  );
};
