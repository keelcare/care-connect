"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { UserPlus, HeartHandshake, CalendarCheck2, MessageCircle, CreditCard } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your profile",
    description: "Tell us about your family, your needs, and any special requirements. It takes less than 3 minutes.",
  },
  {
    number: "02",
    icon: HeartHandshake,
    title: "Choose the type of care",
    description: "Browse from child care, shadow teachers, special needs support, and more — all in one place.",
  },
  {
    number: "03",
    icon: CalendarCheck2,
    title: "Set booking details",
    description: "Pick your schedule, upload any necessary documents, and specify exactly what you need.",
  },
  {
    number: "04",
    icon: MessageCircle,
    title: "Connect with your caregiver",
    description: "Chat, review verified profiles, and confirm your match. Every caregiver is background-checked.",
  },
  {
    number: "05",
    icon: CreditCard,
    title: "Pay after completion",
    description: "No upfront payments. You're only charged once care is delivered — safe, simple, and transparent.",
  },
];

const StepItem = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-5 group"
    >
      {/* Step number + icon bubble */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
          <Icon size={20} className="text-white" strokeWidth={1.5} />
        </div>
        <span className="absolute -top-2 -right-2 text-[10px] font-bold text-primary-900/40 font-mono">
          {step.number}
        </span>
      </div>

      {/* Text */}
      <div className="flex-1 pb-8">
        <h3 className="text-lg md:text-xl font-display font-semibold text-primary-900 mb-1 leading-snug">
          {step.title}
        </h3>
        <p className="text-sm md:text-base text-primary-900/60 leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};

export const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 md:px-8 overflow-hidden"
      style={{ background: "linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)" }}
    >
      {/* Subtle decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(210, 70%, 88%) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(38, 80%, 85%) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT: Header + Visual Card */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-900/15 bg-primary-900/5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-900/50" />
                <span className="text-xs font-semibold tracking-widest uppercase text-primary-900/60">How It Works</span>
              </div>

              {/* Split-text heading */}
              <h2 className="text-4xl sm:text-5xl md:text-fluid-5xl font-display font-medium text-primary-900 leading-[1.1] tracking-tight mb-6">
                {/* Line 1: "Care made simple," */}
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={isInView ? { y: "0%" } : {}}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  >
                    Care made simple,
                  </motion.span>
                </span>
                {/* Line 2: "step by step." italic */}
                <span className="block overflow-hidden">
                  <motion.span
                    className="block italic text-sky-700/80"
                    initial={{ y: "105%" }}
                    animate={isInView ? { y: "0%" } : {}}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
                  >
                    step by step.
                  </motion.span>
                </span>
              </h2>

              {/* Split-text subtext — word by word */}
              <p className="text-base md:text-lg text-primary-900/60 leading-relaxed mb-10 max-w-md flex flex-wrap gap-x-[0.3em]">
                {"From your first search to your first booking — Keel guides you every step of the way.".split(" ").map((word, i) => (
                  <span key={i} className="overflow-hidden inline-block">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={isInView ? { y: "0%" } : {}}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.03 }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </p>

            </motion.div>
          </div>

          {/* RIGHT: Steps */}
          <div className="relative pt-2">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 bottom-12 w-px bg-gradient-to-b from-primary-900/20 via-primary-900/10 to-transparent" />

            <div className="space-y-0">
              {steps.map((step, index) => (
                <StepItem key={step.number} step={step} index={index} />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
