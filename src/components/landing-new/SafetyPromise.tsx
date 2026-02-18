"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, UserCheck, CheckCircle, FileCheck } from "lucide-react";

const cards = [
  {
    id: 1,
    icon: <UserCheck className="w-8 h-8 text-white" />,
    title: "Identity Verified",
    desc: "Government-issued ID checks for every caregiver.",
    color: "bg-primary-900",
  },
  {
    id: 2,
    icon: <FileCheck className="w-8 h-8 text-white" />,
    title: "Background Checks",
    desc: "Comprehensive criminal & registry scanning.",
    color: "bg-emerald-600",
  },
  {
    id: 3,
    icon: <CheckCircle className="w-8 h-8 text-white" />,
    title: "Reference Checked",
    desc: "Verified employment history and character references.",
    color: "bg-stone-500",
  },
];

const warmBg = "linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)";

const SafetyCard = ({ card }: { card: typeof cards[0] }) => (
  <div className="p-8 flex flex-col items-center justify-center text-center bg-white/90 backdrop-blur-md border border-stone-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[280px]">
    <div className={`w-20 h-20 ${card.color} rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-900/5 mb-8 ring-4 ring-white`}>
      {card.icon}
    </div>
    <h3 className="text-2xl font-bold text-primary-900 mb-4 tracking-tight">{card.title}</h3>
    <p className="text-stone-500 font-medium leading-relaxed">{card.desc}</p>
  </div>
);

export const SafetyPromise = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.7]);
  const textY = useTransform(scrollYProgress, [0, 0.4], ["0%", "-25%"]);
  const subtextOpacity = useTransform(scrollYProgress, [0.05, 0.2], [1, 0]);
  const subtextY = useTransform(scrollYProgress, [0.05, 0.2], [0, -20]);

  const card1X = useTransform(scrollYProgress, [0.3, 0.5], ["-120%", "0%"]);
  const card1Opacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const card2X = useTransform(scrollYProgress, [0.45, 0.65], ["120%", "0%"]);
  const card2Opacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const card3X = useTransform(scrollYProgress, [0.6, 0.8], ["-120%", "0%"]);
  const card3Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative z-10 h-auto md:h-[250vh]"
      style={{ background: warmBg }}
    >
      {/* ── MOBILE: normal flow layout ── */}
      <div className="md:hidden py-16 px-5">
        <div className="max-w-sm mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full text-amber-900/90 text-sm font-bold tracking-wide uppercase shadow-sm border border-amber-100/50">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Uncompromised Safety</span>
          </div>
          <h2 className="text-3xl font-display font-medium text-primary-900 leading-[1.1] tracking-tight">
            Peace of mind is <br />
            <span className="italic">our promise to you.</span>
          </h2>
          <p className="text-base text-stone-600 leading-relaxed">
            Every professional on Keel undergoes a rigorous, multi-step verification before entering your home.
          </p>
          <div className="flex flex-col gap-4 w-full">
            {cards.map((card) => (
              <SafetyCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP: sticky scroll animation ── */}
      <div
        className="hidden md:flex sticky top-0 h-screen overflow-hidden flex-col items-center pt-24 lg:pt-32 px-6"
        style={{ background: warmBg }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[-5%] w-96 h-96 bg-primary-900/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            style={{ scale: textScale, y: textY }}
            className="text-center z-10 w-full max-w-4xl origin-center"
          >
            <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full text-amber-900/90 text-sm font-bold tracking-wide uppercase mb-6 shadow-sm border border-amber-100/50">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Uncompromised Safety</span>
            </div>
            <h2 className="text-5xl md:text-fluid-5xl lg:text-fluid-6xl font-display font-medium text-primary-900 mb-4 md:mb-6 leading-[1.1] tracking-tight">
              Peace of mind is <br />
              <span className="italic text-primary-900 relative">
                our promise to you.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h2>
            <motion.p
              style={{ opacity: subtextOpacity, y: subtextY }}
              className="text-2xl text-stone-600 leading-relaxed font-body max-w-2xl mx-auto"
            >
              We believe trust is the foundation of care. That's why every professional on Keel undergoes a rigorous, multi-step verification process before they ever step foot in your home.
            </motion.p>
          </motion.div>

          <div className="absolute top-[40%] w-full max-w-6xl flex flex-row items-center justify-between gap-6 lg:gap-8">
            <motion.div style={{ x: card1X, opacity: card1Opacity }} className="w-full max-w-sm">
              <SafetyCard card={cards[0]} />
            </motion.div>
            <motion.div style={{ x: card2X, opacity: card2Opacity }} className="w-full max-w-sm mt-12">
              <SafetyCard card={cards[1]} />
            </motion.div>
            <motion.div style={{ x: card3X, opacity: card3Opacity }} className="w-full max-w-sm">
              <SafetyCard card={cards[2]} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
