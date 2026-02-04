import React from 'react';
import { Search, Heart, Circle } from 'lucide-react';

export const FeatureGrid = () => {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-h-auto lg:h-[320px]">
      
      {/* CARD 1 - Babysitter Info */}
      <div className="bg-white p-10 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 shadow-sm z-10">
        <div>
          <h3 className="font-serif text-2xl font-bold text-childcare-text mb-4">Need a Babysitter?</h3>
          <p className="text-gray-500 text-sm mb-4">Find trusted local care for your little ones in minutes.</p>
          <p className="font-bold text-childcare-primary">Starting From $10/hr</p>
        </div>
        <button 
          className="border border-gray-300 rounded-full py-2 px-6 w-max text-sm font-medium hover:bg-gray-50 transition-colors mt-6"
          aria-label="Learn more about babysitters"
        >
          Learn More
        </button>
      </div>

      {/* CARD 2 - Quality Care */}
      <div className="bg-childcare-mustard p-10 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform duration-300 shadow-sm z-10">
        <h3 className="font-serif text-2xl font-bold text-white mb-6">Quality Care</h3>
        {/* Simple Handshake Icon Representation */}
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
             <Heart size={32} className="text-white fill-white" />
        </div>
      </div>

      {/* CARD 3 - Age Group */}
      <div className="bg-childcare-coral p-10 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform duration-300 shadow-sm z-10 relative overflow-hidden">
        <h3 className="font-serif text-2xl font-bold text-white relative z-10 leading-snug">
          For children <br/> 5 months to <br/> 6 years of age
        </h3>
        {/* Decorative Dot Element */}
        <div className="w-4 h-4 bg-yellow-300 rounded-full mt-6 absolute bottom-10 animate-bounce"></div>
        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full"></div>
      </div>

      {/* CARD 4 - Professionals */}
      <div className="bg-childcare-teal p-10 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform duration-300 shadow-sm z-10 relative overflow-hidden">
        <h3 className="font-serif text-2xl font-bold text-white relative z-10">Child Care Professionals</h3>
        
        {/* Abstract Geometric Shapes */}
        <div className="absolute bottom-4 left-4">
             <Circle size={24} className="text-white/30" />
        </div>
        <div className="absolute top-8 right-8 w-12 h-12 border-2 border-white/20 rounded-lg transform rotate-12"></div>
         <div className="absolute bottom-12 right-12 w-8 h-8 bg-white/10 rounded-full"></div>
      </div>

    </section>
  );
};
