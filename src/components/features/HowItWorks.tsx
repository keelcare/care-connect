'use client';

import React from 'react';
import Image from 'next/image';
import { Search, UserCheck, CalendarCheck, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Search',
      description: 'Filter based on your specific needs.',
    },
    {
      title: 'Review',
      description: 'Check background-verified profiles.',
    },
    {
      title: 'Connect',
      description: 'Chat and interview candidates.',
    },
    {
      title: 'Book',
      description: 'Schedule care securely.',
    },
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Large Visual (Reference: "Daycare is Great" Image Section) */}
          <div className="relative h-[600px] rounded-[40px] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=1000&auto=format&fit=crop"
              alt="Caregiver making it special"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Play Button / Interactive Element */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-wellness-navy border-b-[8px] border-b-transparent ml-1" />
                    </div>
                </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-wellness-green/10 text-wellness-green rounded-full">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="font-heading text-lg text-wellness-navy mb-1">Simple & Secure</p>
                        <p className="text-sm text-neutral-600">Every booking is insured and monitored for your peace of mind.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Right: Content (Reference: "Kids Make it Special" Text Section) */}
          <div>
             <p className="text-wellness-green font-bold uppercase tracking-widest text-xs mb-3">How It Works</p>
             <h2 className="text-fluid-4xl md:text-fluid-5xl font-heading text-wellness-navy mb-6 leading-tight">
                Finding the perfect match <br/> 
                <span className="text-wellness-primary">made simple.</span>
             </h2>
             <p className="text-lg text-neutral-600 mb-10 leading-relaxed">
                We've streamlined the process to help you find trusted care in minutes, not days. Here's how you can get started.
             </p>

             <div className="space-y-8 relative">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-neutral-100" />

                {steps.map((step, index) => (
                    <div key={index} className="relative flex items-center gap-6 group cursor-default">
                        {/* Dot */}
                        <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-wellness-green flex items-center justify-center group-hover:bg-wellness-green group-hover:text-white transition-colors">
                            <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                        {/* Text */}
                        <div className="flex-1 p-4 rounded-2xl group-hover:bg-wellness-cream transition-colors">
                            <h3 className="text-xl font-bold text-wellness-navy mb-1">{step.title}</h3>
                            <p className="text-neutral-500 text-sm">{step.description}</p>
                        </div>
                    </div>
                ))}
             </div>

             <div className="mt-12">
                 <Button className="bg-wellness-navy text-white px-8 py-6 rounded-full text-lg hover:bg-wellness-navy/90 shadow-lg group">
                     Start Your Search 
                     <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};
