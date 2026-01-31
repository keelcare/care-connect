'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

export const CTASection: React.FC = () => {
  const benefits = [
    'Free to browse and message caregivers',
    'All caregivers are background-verified',
    'Cancel anytime, no hidden fees',
    '24/7 customer support available',
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-stone-100 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="p-10 lg:p-16">
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-4">
                Get Started Today
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                Ready to find the perfect care for your family?
              </h2>
              <p className="text-stone-600 mb-8 text-lg">
                Join over 50,000 families who trust Keel to find
                verified, reliable caregivers.
              </p>

              {/* Benefits List */}
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-stone-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button className="h-12 px-8 bg-accent hover:bg-accent-600 text-white rounded-xl font-semibold group">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button
                    variant="outline"
                    className="h-12 px-8 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl font-semibold"
                  >
                    Browse Caregivers
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative hidden lg:block h-full min-h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1491013516836-7db643ee125a?q=80&w=800&auto=format&fit=crop"
                alt="Happy family with caregiver"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-100/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
