'use client';

import React from 'react';
import { Search, UserCheck, CalendarCheck, MessageCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Search,
      title: 'Search',
      description:
        'Browse through our network of verified caregivers. Filter by location, availability, and specialty.',
    },
    {
      step: '02',
      icon: UserCheck,
      title: 'Review & Select',
      description:
        'Read reviews, check credentials, and view detailed profiles to find your perfect match.',
    },
    {
      step: '03',
      icon: MessageCircle,
      title: 'Connect',
      description:
        'Message caregivers directly, ask questions, and discuss your specific needs.',
    },
    {
      step: '04',
      icon: CalendarCheck,
      title: 'Book & Relax',
      description:
        'Schedule care sessions with confidence. Manage everything from your dashboard.',
    },
  ];

  return (
    <section className="py-24 px-6 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-xl mx-auto">
            Finding trusted care is simple
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Connector line (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-stone-700" />
                )}

                <div className="relative">
                  {/* Step number */}
                  <div className="text-6xl font-bold text-stone-800 absolute -top-4 -left-2 select-none">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-stone-800 flex items-center justify-center mb-6 group-hover:bg-stone-700 transition-colors">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
