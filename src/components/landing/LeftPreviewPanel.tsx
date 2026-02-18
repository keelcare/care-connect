import React from 'react';
import { ShieldCheck, Heart, UserCheck, Star } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
    <div className="w-8 h-8 rounded-full bg-childcare-mint flex items-center justify-center text-childcare-primary">
      <Icon size={16} />
    </div>
    <h3 className="text-xs font-bold text-childcare-text">{title}</h3>
    <p className="text-[10px] text-gray-500 leading-tight">{desc}</p>
  </div>
);

export const LeftPreviewPanel = () => {
  return (
    <div className="bg-white h-full rounded-3xl shadow-xl overflow-hidden flex flex-col relative z-10 w-full lg:w-[45%]">
      
      {/* SECTION 1: Services Header Area */}
      <div className="bg-gradient-to-b from-childcare-mint to-white p-6 pb-8">
        <h2 className="text-xl font-serif font-semibold text-childcare-text mb-4 text-center">Our Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ServiceCard icon={UserCheck} title="Nanny" desc="Full-time care" />
          <ServiceCard icon={Heart} title="Babysitter" desc="Occasional help" />
          <ServiceCard icon={Star} title="Special Needs" desc="Expert care" />
          <ServiceCard icon={ShieldCheck} title="Elderly Care" desc="Compassionate" />
        </div>
      </div>

      {/* SECTION 2: Middle Promotion Area */}
      <div className="p-6 grid grid-cols-2 gap-4 items-center flex-grow">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-childcare-text leading-tight">
            Babycare is a specialist Nanny Public Liability
          </h3>
          <button className="bg-childcare-secondary text-primary-900 text-xs px-4 py-2 rounded-full font-bold hover:brightness-105 transition-all">
            Learn More
          </button>
        </div>
        <div className="relative">
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg z-20 animate-bounce delay-700 duration-[3000ms]">
             <div className="flex items-center gap-1">
               <Star size={12} className="text-yellow-400 fill-yellow-400" />
               <span className="text-xs font-bold">4.9</span>
             </div>
          </div>
          <img 
            src="/mother_child_caring.png" 
            alt="Mother and Child" 
            className="rounded-2xl w-full object-cover shadow-md aspect-square"
          />
        </div>
      </div>

      {/* SECTION 3: Safety Feature Strip */}
      <div className="bg-childcare-neutral py-4 px-6 border-y border-gray-100">
        <p className="text-xs font-bold text-center text-childcare-text mb-3">Every Baby with Love & Safety</p>
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-childcare-primary"></span> Verified
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-childcare-secondary"></span> Insured
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-childcare-coral"></span> Certified
          </div>
        </div>
      </div>

      {/* SECTION 4: CTA Footer Panel */}
      <div className="bg-childcare-primary p-6 mt-auto">
        <h4 className="text-white font-medium text-sm mb-3">Your little ones deserve the very best care.</h4>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-colors"
          />
          <button className="bg-white text-childcare-primary rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
