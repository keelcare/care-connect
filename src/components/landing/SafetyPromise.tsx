"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const checks = [
  {
    number: "01",
    title: "Identity Verified",
    desc: "Every caregiver submits a government-issued photo ID before their profile goes live. No exceptions.",
  },
  {
    number: "02",
    title: "Background Checked",
    desc: "We run comprehensive criminal record and registry scans — updated regularly, not just once.",
  },
  {
    number: "03",
    title: "Reference Confirmed",
    desc: "Past employers are contacted directly. We verify character, reliability, and professional history.",
  },
];

const warmBg = "linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)";

export const SafetyPromise = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: warmBg }}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          style={{ y }}
          className="mb-20"
        >
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-900 leading-[1.05] tracking-tight max-w-lg">
              Peace of mind is{" "}
              <span className="italic">our promise to you.</span>
            </h2>
            <p className="text-base text-stone-500 leading-relaxed max-w-xs md:text-right">
              Every professional on Keel passes a rigorous, multi-step
              verification before stepping into your home.
            </p>
          </div>
        </motion.div>

        {/* Check items — horizontal rule list */}
        <div className="flex flex-col divide-y divide-stone-200/70">
          {checks.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[auto_1fr_1fr] items-start gap-8 py-8 group"
            >
              {/* Number */}
              <span className="text-xs font-bold text-stone-300 tabular-nums pt-1 w-8">
                {item.number}
              </span>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold text-primary-900 tracking-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-stone-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
