'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Baby,
  Heart,
  PawPrint,
  Home,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FeaturedServices: React.FC = () => {
  const router = useRouter();

  return (
    <section className="py-20 px-6 bg-wellness-cream relative overflow-hidden">
        {/* Background blobs to link sections */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-wellness-peach/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(0,auto)]">
            
            {/* 1. Services Header / Intro Block (Top Left) */}
            <div className="lg:col-span-8 flex flex-col justify-center lg:pr-12 mb-8 lg:mb-0">
                <p className="text-wellness-green font-bold uppercase tracking-widest text-xs mb-3">Our Services</p>
                <h2 className="text-4xl md:text-5xl font-heading text-wellness-navy mb-4 leading-tight">
                    Professional care <br/>
                    <span className="text-wellness-terracotta">tailored to your needs.</span>
                </h2>
                <p className="text-lg text-wellness-text/70 max-w-xl">
                    Whether you need a specialized nanny, a companion for your parents, or someone to walk the dog, we have verified professionals ready to help.
                </p>
            </div>

            {/* 2. Visual "Quality Care" Block (Yellow/Mustard) - Reference: "Quality Care" */}
            <div 
                onClick={() => router.push('/browse?service=Child Care')}
                className="lg:col-span-4 bg-wellness-mustard rounded-[40px] p-8 min-h-[300px] relative overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02]"
            >
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Star className="text-white" size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-heading text-wellness-navy mb-2">Quality Care</h3>
                        <p className="text-wellness-navy/80 font-medium">For children 5 months to 6 years of age</p>
                    </div>
                </div>
                {/* Decorative Image/Shape */}
                <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/10 rounded-tl-full" />
            </div>

            {/* 3. "Child Care" Block (Green) with Image - Reference: "Child Care Professionals" */}
            <div 
                onClick={() => router.push('/browse?service=Child Care')}
                className="lg:col-span-4 lg:row-span-2 bg-wellness-navy text-white rounded-[40px] p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden cursor-pointer group"
            >
                 <div className="relative z-10">
                    <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                        <Baby size={24} />
                    </div>
                    <h3 className="text-3xl font-heading mb-2">Child Care Professionals</h3>
                    <p className="text-white/70">Verified nannies, babysitters, and au pairs.</p>
                 </div>
                 
                 {/* Geometric shapes from reference */}
                 <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-wellness-green rounded-full opacity-80" />
                 <div className="absolute bottom-[40px] right-[60px] w-20 h-20 bg-wellness-blue rounded-lg transform rotate-12 opacity-80" />
                 
                 <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:gap-4 transition-all z-10">
                     Find a Nanny <ArrowRight size={16} />
                 </div>
            </div>

            {/* 4. "Senior Care" Block (Terracotta) - Reference: Red Block */}
            <div 
                onClick={() => router.push('/browse?service=Senior Care')}
                className="lg:col-span-4 bg-wellness-terracotta rounded-[40px] p-8 min-h-[300px] relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform"
            >
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-heading mb-2">Senior Care</h3>
                        <p className="text-white/90 font-medium"> compassionate companionship</p>
                    </div>
                </div>
                 {/* Diamond decor */}
                 <div className="absolute top-8 right-8 text-white/30">
                     <div className="w-4 h-4 bg-white/40 rotate-45 mb-2" />
                     <div className="w-2 h-2 bg-white/40 rotate-45 mx-auto" />
                 </div>
            </div>

            {/* 5. "Pet Care" Block (Green) */}
             <div 
                onClick={() => router.push('/browse?service=Pet Care')}
                className="lg:col-span-4 bg-wellness-green rounded-[40px] p-8 min-h-[300px] relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform"
            >
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <PawPrint size={24} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-heading mb-2">Pet Care</h3>
                        <p className="text-white/90 font-medium">Walks, sitting, and love.</p>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-[100px]" />
            </div>

            {/* 6. "Housekeeping" Small Block (Peach) */}
            <div 
                onClick={() => router.push('/browse?service=Housekeeping')}
                className="lg:col-span-4 bg-wellness-peach rounded-[40px] p-8 min-h-[200px] flex items-center justify-between cursor-pointer group hover:border-wellness-mustard border-2 border-transparent transition-colors"
            >
                <div>
                     <h3 className="text-xl font-heading text-wellness-navy mb-1">Housekeeping</h3>
                     <p className="text-sm text-wellness-text/70">Keep your home sparkling</p>
                </div>
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-wellness-navy group-hover:scale-110 transition-transform">
                    <Home size={20} />
                </div>
            </div>

             <div className="lg:col-span-4 bg-white rounded-[40px] p-8 min-h-[200px] flex flex-col justify-center items-center text-center border border-wellness-beige">
                 <p className="text-wellness-navy font-bold text-xl mb-4">Need something else?</p>
                 <Button onClick={() => router.push('/browse')} className="rounded-full bg-wellness-navy text-white px-8">Browse All Services</Button>
            </div>

        </div>
      </div>
    </section>
  );
};
