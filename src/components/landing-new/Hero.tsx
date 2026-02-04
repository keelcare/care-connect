'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const illustrations = [
  { url: '/mother_child_caring.png', size: 'h-64 md:h-80', span: 'col-span-1' },
  { url: '/babysitter_playing.png', size: 'h-48 md:h-60', span: 'col-span-1' },
  { url: '/image1.png', size: 'h-72 md:h-96', span: 'col-span-1' },
  { url: '/image2.png', size: 'h-56 md:h-72', span: 'col-span-1' },
  { url: '/image3.png', size: 'h-48 md:h-64', span: 'col-span-1' },
];

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  
  // Parallax transforms - creating different speeds for depth
  const y1 = useTransform(scrollY, [0, 500], [0, -150]); // Moves fastest
  const y2 = useTransform(scrollY, [0, 500], [0, -80]);  // Moves medium
  const y3 = useTransform(scrollY, [0, 500], [0, -220]); // Moves very fast
  
  const physicsY1 = useSpring(y1, { stiffness: 100, damping: 20 });
  const physicsY2 = useSpring(y2, { stiffness: 100, damping: 20 });
  const physicsY3 = useSpring(y3, { stiffness: 100, damping: 20 });

  return (
    <section ref={containerRef} className="pt-40 pb-20 overflow-hidden relative min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 mb-8 max-w-lg mx-auto"
        >
          <div className="w-6 h-6 rounded-full bg-[#1F6F5B]/10 flex items-center justify-center shrink-0">
             <Quote size={12} className="text-[#1F6F5B] fill-current" />
          </div>
          <p className="text-xs md:text-sm font-medium text-[#0F172A] italic">
            "It is not how much we do, but how much love we put in the doing."
            <span className="block text-[10px] text-gray-400 not-italic mt-0.5 font-semibold tracking-wide uppercase">— Mother Teresa</span>
          </p>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-medium text-[#0F172A] leading-[1.1] mb-8"
        >
          Where Big Needs <br />
          Meet Gentle Care
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
          className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium font-body"
        >
          Inclusive, compassionate care that strengthens both <br className="hidden md:block" /> children and families through verified connections.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button className="bg-[#0F172A] text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group shadow-2xl shadow-navy-900/10">
            Book a Session
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[#E08E79] transition-colors duration-300">
              <ArrowUpRight size={18} />
            </div>
          </button>
          <button className="bg-[#E08E79] text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group shadow-2xl shadow-terracotta/20">
            Our Services
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[#0F172A] transition-colors duration-300">
              <ArrowUpRight size={18} />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Illustrative Masonry Grid with Parallax */}
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-end gap-6 md:gap-8 min-h-[400px]">
        {illustrations.map((ill, idx) => {
           // Distribute parallax speeds based on index
           const yAnim = idx % 3 === 0 ? physicsY1 : idx % 2 === 0 ? physicsY2 : physicsY3;
           
           return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{ y: yAnim }}
              transition={{ delay: 0.4 + (idx * 0.1), duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
              className={`rounded-[32px] overflow-hidden ${ill.size} w-40 md:w-52 shadow-xl hover:shadow-2xl transition-shadow duration-500 hover:scale-105 relative z-0`}
            >
              <ImageWithFallback 
                src={ill.url}
                alt="Care Illustration"
                className="w-full h-full object-cover grayscale-0"
              />
              {/* Subtle sheen on hover/interaction */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          );
        })}
      </div>
      
      {/* Decorative background blobs */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#E5F1EC] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 -translate-x-1/2 -z-10" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#E08E79] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 translate-x-1/2 -z-10" />
    </section>
  );
};
