import React from 'react';
import Link from 'next/link';

export const HeroBanner = () => {
  return (
    <section className="w-full min-h-[520px] grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE - Text Content */}
      <div className="bg-childcare-lavender h-full flex flex-col justify-center px-8 md:pl-20 py-16 md:py-0 order-2 md:order-1">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-[56px] font-semibold text-white leading-tight mb-8">
          Quickly Find a <br />
          Babysitter
        </h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link href="/search">
            <button 
              className="bg-childcare-primary text-white rounded-full px-6 py-3 font-medium hover:brightness-110 transition-all shadow-md"
              aria-label="Book a Babysitter"
            >
              Book a Babysitter
            </button>
          </Link>
          
          <span className="text-stone-600 font-medium">+356 376 7900</span>
        </div>
      </div>

      {/* RIGHT SIDE - Hero Image */}
      <div className="bg-childcare-primary relative h-[400px] md:h-full flex items-end justify-center overflow-hidden order-1 md:order-2">
        <img 
          src="/babysitter_playing.png" 
          alt="Mother and child playing with toys" 
          className="w-full h-full object-cover object-bottom"
        />
        {/* Slight overlap visual trick if needed, but object-cover usually handles fill well */}
      </div>
    </section>
  );
};
