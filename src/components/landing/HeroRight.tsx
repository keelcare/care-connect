import React from 'react';
import { Twitter, Instagram } from 'lucide-react';
import { FloatingWidget } from './FloatingWidget';

export const HeroRight = () => {
  return (
    <div className="relative h-full flex items-center justify-center pl-0 md:pl-10 pb-10 md:pb-0">
      {/* Main Image Container */}
      <div className="relative w-full max-w-[550px] aspect-[4/5] md:aspect-[3/4] rounded-[32px] overflow-visible">
        
        {/* Floating Socials (Top Center) */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 text-gray-700 hover:text-[#1DA1F2]">
            <Twitter size={20} fill="currentColor" strokeWidth={0} />
          </button>
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 text-gray-700 hover:text-[#E1306C]">
            <Instagram size={20} />
          </button>
        </div>

        {/* The Image */}
        <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-shadow duration-500 group">
          <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
          <img 
            src="/antigravity/brain/b1640e6a-2420-411d-8a3d-0e2d5f0d33ce/nanny_illustration_1770125161214.png" 
            alt="Nanny caring for child illustration" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out bg-[#FDF8F5]"
          />
        </div>

        {/* Floating Chat Widget */}
        <FloatingWidget />
        
        {/* Decorative elements behind */}
        <div className="absolute top-10 -right-10 w-full h-full border-2 border-harmony-navy rounded-[32px] -z-10 hidden md:block"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#F9EADB] rounded-full blur-3xl -z-10 opacity-60"></div>
      </div>
    </div>
  );
};
