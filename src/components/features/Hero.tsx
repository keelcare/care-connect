'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Shield, Star, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  const router = useRouter();

  const handleSearch = () => {
    router.push('/auth/signup?role=parent');
  };

  return (
    <section className="pt-6 pb-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Hero Card Container */}
        <div className="bg-wellness-cream rounded-[48px] p-8 md:p-16 relative overflow-hidden">
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Left: Illustration Composition (Mimicking the Vector Art of Fundsmate) */}
                <div className="relative h-[400px] w-full flex items-center justify-center order-2 lg:order-1">
                    {/* Abstract Blob for Background */}
                    <div className="absolute inset-0 bg-wellness-peach/50 rounded-full blur-[60px] transform scale-75" />
                    
                    {/* The "Illustration" constructed from CSS Shapes & Icons */}
                    <div className="relative z-10 w-full max-w-sm">
                        {/* Main Character Shape */}
                        <div className="w-64 h-64 bg-wellness-navy rounded-t-full rounded-b-[40px] mx-auto relative overflow-hidden flex items-end justify-center">
                            <div className="w-40 h-40 bg-wellness-mustard/20 rounded-full mb-8" /> 
                            {/* Stylized Face placeholder */}
                            <div className="absolute top-16 w-20 h-24 bg-wellness-peach rounded-2xl" />
                        </div>
                        
                        {/* Interactive Elements Floating Around */}
                        <div className="absolute top-0 right-0 bg-white p-4 rounded-2xl shadow-premium rotate-6 animate-slide-up">
                            <HeartHandshake className="text-wellness-terracotta w-8 h-8" />
                        </div>
                        
                        <div className="absolute bottom-10 -left-4 bg-white p-4 rounded-2xl shadow-premium -rotate-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Shield className="text-wellness-green w-8 h-8" />
                            <div className="h-1 w-8 bg-neutral-100 rounded-full mt-2" />
                            <div className="h-1 w-5 bg-neutral-100 rounded-full mt-1" />
                        </div>

                        {/* "List" Board Element from reference */}
                        <div className="absolute top-10 -left-8 bg-white border-4 border-wellness-green/20 rounded-xl w-32 h-40 p-3 transform -rotate-12 -z-10">
                             <div className="w-full h-full border-2 border-dashed border-neutral-200 rounded flex flex-col gap-2 p-2">
                                 <div className="w-4 h-4 rounded-full bg-wellness-green/40" />
                                 <div className="w-full h-2 bg-neutral-100 rounded" />
                                 <div className="w-full h-2 bg-neutral-100 rounded" />
                                 <div className="w-2/3 h-2 bg-neutral-100 rounded" />
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right: Copy (Text) */}
                <div className="order-1 lg:order-2 space-y-6">
                    <p className="font-bold text-wellness-navy/60 uppercase tracking-widest text-xs">Trusted Care Connections</p>
                    
                    <h1 className="text-5xl lg:text-7xl font-heading text-wellness-navy leading-[1.1]">
                        Quickly Find a <br/>
                        <span className="text-wellness-terracotta">Trusted Nanny.</span>
                    </h1>
                    
                    <p className="text-lg text-neutral-600 max-w-md leading-relaxed">
                        By connecting with background-checked professionals, you have the opportunity to find the perfect match for your family's needs instantly.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <Button 
                            onClick={handleSearch}
                            className="bg-wellness-navy hover:bg-wellness-navy/90 text-white rounded-full px-8 py-6 text-lg shadow-lg"
                        >
                            Find a Nanny
                        </Button>
                        <Button variant="ghost" className="rounded-full px-6 py-6 text-wellness-navy hover:bg-wellness-navy/5">
                            How it works
                        </Button>
                    </div>
                </div>

            </div>

             {/* Decorative Background Circles like reference */}
             <div className="absolute -left-20 -bottom-20 w-96 h-96 border border-wellness-navy/5 rounded-full" />
             <div className="absolute -left-10 -bottom-10 w-96 h-96 border border-wellness-navy/5 rounded-full" />
        </div>
        
      </div>
    </section>
  );
};
