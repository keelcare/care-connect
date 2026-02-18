import React from 'react';
import { Search, Heart, Baby, Award } from 'lucide-react';
import Link from 'next/link';

export const RightPreviewPanel = () => {
  return (
    <div className="bg-white h-full rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative z-20 w-full lg:w-[55%] lg:-ml-20 lg:mt-12 border border-gray-100">
      
      {/* SECTION 1: Hero Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-[55%]">
        {/* Left Side: Text */}
        <div className="bg-childcare-lavender/30 p-8 flex flex-col justify-center">
          <h1 className="font-serif text-[40px] md:text-[48px] leading-[1.1] font-semibold text-childcare-text mb-6">
            Quickly Find a <br />
            <span className="text-childcare-primary">Babysitter</span>
          </h1>
          <Link href="/search">
            <button className="bg-childcare-primary text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all w-max flex items-center gap-2">
              <Search size={18} />
              Book a Babysitter
            </button>
          </Link>
        </div>

        {/* Right Side: Image */}
        <div className="relative h-full">
            <img 
            src="/babysitter_playing.png" 
            alt="Babysitter playing" 
            className="w-full h-full object-cover"
            />
             {/* Decorative overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* SECTION 2: Lower Grid */}
      <div className="flex-grow p-6">
        <div className="grid grid-cols-2 gap-4 h-full">
          
          {/* Card 1 */}
          <div className="bg-childcare-neutral rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer group">
            <div>
              <h3 className="font-bold text-childcare-text text-lg mb-1">Need a Babysitter?</h3>
              <p className="text-xs text-gray-500">Professional care on demand</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-bold text-childcare-primary">From $15/hr</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-childcare-primary group-hover:text-white transition-colors">
                <Search size={14} />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-childcare-secondary rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden relative text-primary-900">
            <h3 className="font-bold text-lg relative z-10">Quality Care</h3>
            <div className="absolute bottom-[-10px] right-[-10px] opacity-20 rotate-[-15deg]">
              <Heart size={80} fill="currentColor" />
            </div>
            <div className="mt-4 relative z-10 bg-white/40 w-max px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm text-primary-900">
              Verified Profiles
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-childcare-coral rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer text-white">
             <div className="flex items-start justify-between">
                <h3 className="font-bold text-lg leading-tight w-2/3">For children 5mo to 6yr</h3>
                <Baby size={24} />
             </div>
             <p className="text-xs text-white/80 mt-2">Specialized attention for early years.</p>
          </div>

          {/* Card 4 */}
          <div className="bg-childcare-teal rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer text-white overflow-hidden relative">
            <div className="absolute top-2 right-4 w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
            <div className="absolute bottom-6 right-8 w-2 h-2 rounded-full bg-pink-400"></div>
            
            <h3 className="font-bold text-lg relative z-10">Child Care Professionals</h3>
            
            <div className="flex items-center gap-2 mt-2 text-white/80 text-xs">
              <Award size={14} />
              <span>Certified Team</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
