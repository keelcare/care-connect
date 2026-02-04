import React from 'react';
import { Play } from 'lucide-react';

export const PromoSection = () => {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
      
      {/* LEFT SIDE - Video / Image */}
      <div className="relative h-[400px] md:h-full w-full bg-gray-200 group cursor-pointer overflow-hidden">
        <img 
          src="/mother_child_caring.png" 
          alt="Babysitter helping child" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
             <Play size={24} className="text-childcare-primary fill-childcare-primary ml-1" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Text Content */}
      <div className="bg-childcare-neutral h-full flex flex-col justify-center px-8 md:pl-20 py-16 md:py-0">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-childcare-text mb-6 leading-tight">
          Daycare is Great... <br />
          <span className="text-childcare-primary">Kids Make it Special.</span>
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-md">
           Our verified caregivers provide more than just supervision. They create engaging, safe, and loving environments where your child can thrive, learn, and play in the comfort of your own home.
        </p>
      </div>

    </section>
  );
};
