import React from 'react';
import { Navbar } from './Navbar';
import HeroSection from './HeroSection';
import { ExpertiseScroll } from './ExpertiseScroll';

import { ThatsUs } from './ThatsUs';
import { SafetyPromise } from './SafetyPromise';
import { ServicesShowcase } from './ServicesShowcase';
import { FAQSection } from './FAQSection';
import { HowItWorksSection } from './HowItWorksSection';
import { AboutUs } from './AboutUs';
import { Footer } from './Footer';
import { WaitlistModal } from './WaitlistModal';

export const LandingPage = () => {
  return (
    <div className="min-h-dvh bg-background selection:bg-primary selection:text-white font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <ExpertiseScroll />
        <ServicesShowcase />
        <SafetyPromise />
        <HowItWorksSection />
        <FAQSection />
        <AboutUs />
        <ThatsUs />
        {process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true' && <WaitlistModal />}
      </main>
      <Footer />
    </div>
  );
};
