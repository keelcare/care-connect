import React from 'react';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const HeroLeft = () => {
  return (
    <div className="flex flex-col justify-center h-full pt-20 lg:pt-0 relative z-10">
      {/* Heading Group */}
      <div className="relative mb-6">
        {/* Floating Profile Images (Decorative) */}
        <div className="absolute -top-12 left-10 md:-left-8 animate-bounce delay-700 duration-[3000ms]">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
        </div>
        <div className="absolute top-0 right-10 md:right-20 animate-bounce delay-150 duration-[4000ms]">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          />
        </div>

        <h1 className="text-[42px] md:text-[56px] font-medium leading-[1.1] text-[#222222] tracking-tight">
          Find trusted care for <br className="hidden md:block" />
          your loved ones with <br className="hidden md:block" />
          <span className="font-serif italic font-normal">Keel</span>
        </h1>
      </div>

      {/* Subtext */}
      <p className="text-[#6b6b6b] text-base leading-relaxed max-w-[420px] mb-10">
        Connect with verified, experienced caregivers for child care, senior care, and pet care. We make finding the perfect match simple and safe.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <button className="bg-harmony-cta text-white rounded-full px-8 py-3.5 font-medium hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl text-sm">
          Find a Caregiver
        </button>
        <Link href="/auth/signup" className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-harmony-primary hover:bg-white/50 transition-all font-medium text-sm">
          Become a Caregiver
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span className="absolute bottom-2 left-0 w-full h-px bg-current scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Link>
      </div>

      {/* Partner Badges */}
      <div className="flex gap-4">
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 pr-5 rounded-2xl shadow-soft border border-white/50">
          <div className="w-10 h-10 bg-[#f0f0f0] rounded-xl flex items-center justify-center text-gray-700">
            <Star size={18} fill="currentColor" className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">4.9/5 Rating</p>
            <p className="text-[10px] text-gray-500 font-medium">Trusted by thousands</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 pr-5 rounded-2xl shadow-soft border border-white/50">
          <div className="w-10 h-10 bg-[#f0f0f0] rounded-xl flex items-center justify-center text-gray-700">
            <ShieldCheck size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Verified</p>
            <p className="text-[10px] text-gray-500 font-medium">Licensed Therapists</p>
          </div>
        </div>
      </div>
    </div>
  );
};
