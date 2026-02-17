"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, UserCheck, CheckCircle, FileCheck } from "lucide-react";

export const SafetyPromise = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax / Scroll Animations
  const leftX = useTransform(scrollYProgress, [0.1, 0.4], [-100, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  const rightX = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  
  // Center fade up
  // Removed scroll-mapped opacity for content to prefer smooth entry
  
  const SMOOTH_EASE = [0.2, 0.8, 0.2, 1];

  return (
    <section 
      ref={containerRef} 
      className="h-dvh flex items-center justify-center px-6 bg-background relative overflow-hidden" 
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[-5%] w-96 h-96 bg-primary-900/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-terracotta/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Header Block */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.0, ease: SMOOTH_EASE }}
            className="max-w-3xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-primary-900/10 px-4 py-1.5 rounded-full text-primary-900 text-sm font-semibold tracking-wide uppercase mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Uncompromised Safety</span>
            </div>
            
            <h2 className="text-fluid-4xl md:text-fluid-5xl font-display font-medium text-primary-900 mb-8 leading-[1.15]">
              Peace of mind is <br/>
              <span className="italic text-primary-900">our promise to you.</span>
            </h2>
            
            <p className="text-xl text-stone-600 leading-relaxed font-body">
              We believe trust is the foundation of care. That's why every professional on Keel undergoes a rigorous, multi-step verification process before they can ever accept a booking.
            </p>
          </motion.div>

          {/* Animated Badges Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 w-full max-w-5xl items-center">
            
            {/* Left Column - Flying In From Left */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: SMOOTH_EASE, delay: 0.2 }}
              className="space-y-6"
            >
              <SafetyCard 
                icon={<UserCheck className="w-8 h-8 text-white" />}
                title="Identity Verified"
                desc="Government-issued ID checks for every caregiver."
                color="bg-primary-900"
              />
              <SafetyCard 
                icon={<FileCheck className="w-8 h-8 text-white" />}
                title="Background Checks"
                desc="Comprehensive criminal & registry scanning."
                color="bg-terracotta"
                delay={0.1}
              />
            </motion.div>

            {/* Right Column - Flying In From Right */}
            <motion.div 
               initial={{ x: 100, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 1.2, ease: SMOOTH_EASE, delay: 0.4 }}
               className="space-y-6 md:mt-12" // Staggered visual offset
            >
              <SafetyCard 
                icon={<CheckCircle className="w-8 h-8 text-white" />}
                title="Reference Checked"
                desc="Verified employment history and character references."
                color="bg-secondary"
                delay={0.2}
              />
              <div className="hidden md:block p-8 rounded-3xl bg-white shadow-xl shadow-emerald-900/5 border border-white/50 backdrop-blur-sm opacity-80 scale-95">
                 <p className="font-display text-2xl text-primary-900 mb-2">100%</p>
                 <p className="text-stone-500 font-medium">Verified Professionals</p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

const SafetyCard = ({ icon, title, desc, color, delay = 0 }: { icon: React.ReactNode, title: string, desc: string, color: string, delay?: number }) => (
  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-stone-200/40 border border-white flex items-center text-left gap-6 hover:scale-[1.02] transition-transform duration-300">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-primary-900 mb-1">{title}</h3>
      <p className="text-stone-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);
