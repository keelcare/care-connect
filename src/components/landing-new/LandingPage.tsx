import React from 'react';
import { Navbar } from './Navbar';
import HeroSection from './HeroSection';
import { ExpertiseScroll } from './ExpertiseScroll';

import { ThatsUs } from './ThatsUs';
import { SafetyPromise } from './SafetyPromise';
import { HowItWorksSection } from './HowItWorksSection';
import { Footer } from './Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-dvh bg-background selection:bg-primary selection:text-white font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <ExpertiseScroll />
        <SafetyPromise />
        <HowItWorksSection />
        <ThatsUs />
      </main>
      <Footer />
    </div>
  );
};
