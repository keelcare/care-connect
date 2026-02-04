import React from 'react';
import { Navbar } from './Navbar';
import { Logo } from './Logo';
import { HeroBanner } from './stacked/HeroBanner';
import { FeatureGrid } from './stacked/FeatureGrid';
import { PromoSection } from './stacked/PromoSection';

export const LandingPage = () => {
  return (
    <div className="min-h-screen w-full relative bg-white font-sans antialiased text-childcare-text selection:bg-childcare-mint">
      
      {/* Header Section */}
      <header className="w-full bg-childcare-primary relative z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[80px] flex justify-between items-center">
          <Logo />
          <Navbar />
        </div>
      </header>

      {/* Main Content - Stacked Sections */}
      <main className="flex flex-col">
        <HeroBanner />
        <FeatureGrid />
        <PromoSection />
      </main>

    </div>
  );
};
