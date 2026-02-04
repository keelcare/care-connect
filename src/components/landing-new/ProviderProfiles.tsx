import React from 'react';
import { Star, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';

const providers = [
  {
    name: 'Sarah Mitchell',
    role: 'Nanny & Early Educator',
    rating: 4.9,
    reviews: 124,
    rate: '$25/hr',
    image: 'https://images.unsplash.com/photo-1743247299142-8f1c919776c4',
    tags: ['First Aid', 'Bilingual']
  },
  {
    name: 'Robert Chen',
    role: 'Senior Care Companion',
    rating: 5.0,
    reviews: 89,
    rate: '$30/hr',
    image: 'https://images.unsplash.com/photo-1628313388777-9b9a751dfc6a',
    tags: ['Elderly Care', 'Nursing']
  },
  {
    name: 'Elena Rodriguez',
    role: 'Professional Housekeeper',
    rating: 4.8,
    reviews: 210,
    rate: '$40/hr',
    image: 'https://images.unsplash.com/photo-1743247299142-8f1c919776c4', // Reusing friendly avatar as per source
    tags: ['Deep Clean', 'Eco-friendly']
  }
];

export const ProviderProfiles = () => {
  return (
    <section className="py-24 px-6 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Meet Our Top Professionals</h2>
            <p className="text-xl text-gray-500 max-w-xl font-medium">
              Every provider is vetted through our rigorous 7-step <br className="hidden md:block" /> verification process to ensure your peace of mind.
            </p>
          </div>
          <button className="text-[#0F172A] font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all group">
            Explore more experts <ArrowUpRight className="group-hover:text-[#E08E79]" size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {providers.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[40px] p-8 hover:shadow-2xl hover:shadow-navy-900/5 transition-all group border border-gray-100"
            >
              <div className="relative mb-8">
                <div className="w-full aspect-square rounded-[32px] overflow-hidden bg-[#E5F1EC]/50 flex items-center justify-center">
                  <ImageWithFallback 
                    src={p.image}
                    alt={p.name}
                    className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-1 shadow-sm border border-gray-50">
                  <Star size={16} className="text-[#F1B92B]" fill="currentColor" />
                  <span className="font-bold text-[#0F172A]">{p.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-[#1F6F5B]" />
                <span className="text-sm font-bold text-[#1F6F5B] uppercase tracking-wider">Fully Verified</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-1">{p.name}</h3>
              <p className="text-gray-500 mb-6 font-medium">{p.role}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {p.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-[#F8F9FA] rounded-full text-sm font-bold text-[#0F172A]/70 border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-[#0F172A]">{p.rate}</span>
                  <span className="text-gray-400 font-medium"> / hour</span>
                </div>
                <button className="bg-[#0F172A] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#E08E79] transition-colors shadow-lg shadow-navy-900/20">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
