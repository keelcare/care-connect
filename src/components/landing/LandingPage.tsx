import React from 'react';
import { Navbar } from './Navbar';
import HeroSection from './HeroSection';
import { RolesSection } from './RolesSection';
import { ThatsUs } from './ThatsUs';
import { SafetyPromise } from './SafetyPromise';
import { FAQSection } from './FAQSection';
// import { HowItWorksSection } from './HowItWorksSection';
import { AboutUs } from './AboutUs';
import { Footer } from './Footer';
import { HashScrollHandler } from './HashScrollHandler';

export const LandingPage = () => {
  return (
    <div className="relative min-h-dvh bg-background selection:bg-primary selection:text-white font-sans">
      <HashScrollHandler />
      <Navbar />
      <main>
        <HeroSection />
        <RolesSection />
        <SafetyPromise />
        {/* <HowItWorksSection /> */}
        <FAQSection />
        <AboutUs />
        <ThatsUs />
      </main>
      <Footer />
    </div>
  );
};
