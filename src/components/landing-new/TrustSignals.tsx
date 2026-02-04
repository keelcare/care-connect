import React from 'react';
import { Shield, ShieldCheck, UserCheck, Heart } from 'lucide-react';

const trustItems = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-[#1F6F5B]" />,
    title: 'Background Checked',
    desc: 'Every provider undergoes a rigorous identity and criminal background verification.'
  },
  {
    icon: <UserCheck className="w-10 h-10 text-[#E08E79]" />,
    title: 'Reference Verified',
    desc: 'We speak with previous employers to ensure reliable and compassionate care.'
  },
  {
    icon: <Shield className="w-10 h-10 text-[#F1B92B]" />,
    title: 'Insured Services',
    desc: 'All bookings through Keel are covered by our comprehensive insurance policy.'
  },
  {
    icon: <Heart className="w-10 h-10 text-[#0F172A]" />,
    title: 'Health & Wellness',
    desc: 'Regular health screenings and safety training for all our care professionals.'
  }
];

export const TrustSignals = () => {
  return (
    <section className="py-24 px-6 bg-[#E5F1EC]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-8 leading-tight">
              Your safety is our <br />
              <span className="text-[#1F6F5B]">absolute priority.</span>
            </h2>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              We go beyond just matching names. Our trust and safety team works around the clock to ensure every connection you make on Keel is safe, professional, and reliable.
            </p>
            <div className="space-y-4">
               {['Premium vetting process', '24/7 Support line', 'Identity protection', 'Secure payments'].map((item) => (
                 <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1F6F5B] flex items-center justify-center text-white">
                        <ShieldCheck size={14} />
                    </div>
                    <span className="font-bold text-[#0F172A]">{item}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trustItems.map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[40px] shadow-xl shadow-emerald-900/5 hover:transform hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-4">{item.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
