"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export const ThatsUs = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // "That's Us" text stays visible until 55%, then fades out by 70%
  const textOpacity = useTransform(scrollYProgress, [0, 0.55, 0.70], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.55, 0.70], ["0%", "-12%"]);

  // Container expands from 85% to 100% width, radius 40 -> 0
  const containerWidth = useTransform(scrollYProgress, [0.1, 0.9], ["85%", "100%"]);
  const containerHeight = useTransform(scrollYProgress, [0.1, 0.9], ["70%", "100%"]);
  const containerRadius = useTransform(scrollYProgress, [0.1, 0.9], [40, 0]);
  const containerOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  // "Find the help" fades in right after the title fades out — no gap
  const subtextOpacity = useTransform(scrollYProgress, [0.65, 0.88], [0, 1]);
  const subtextY = useTransform(scrollYProgress, [0.65, 0.88], ["18px", "0px"]);

  // CTA buttons fade in slightly after subtext
  const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.75, 0.95], ["16px", "0px"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[180vh] md:h-[200vh]"
      style={{ background: "linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)" }}>

        {/* "That's Us - Keel" text — always on top */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
        >
          <h2 className="text-3xl sm:text-4xl md:text-fluid-5xl lg:text-fluid-6xl font-display font-medium text-primary-900 tracking-tight text-center px-4">
            That's Us — Keel.
          </h2>
        </motion.div>

        {/* Expanding green container */}
        <motion.div
          style={{
            width: containerWidth,
            height: containerHeight,
            borderRadius: containerRadius,
            opacity: containerOpacity,
            background:
              "linear-gradient(135deg, hsl(200, 70%, 92%) 0%, hsl(210, 75%, 88%) 50%, hsl(195, 65%, 90%) 100%)",
            backgroundSize: "200% 200%",
          }}
          className="relative flex items-center justify-center overflow-hidden z-20 shadow-2xl"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.75)_0%,transparent_65%)]" />

          {/* "Find the help" */}
          <motion.div
            style={{ opacity: subtextOpacity, y: subtextY }}
            className="relative z-10 text-center px-6 md:px-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-fluid-4xl lg:text-fluid-6xl font-display font-medium text-primary-900 leading-tight">
              Find the help <br />
              <span className="italic text-sky-700/90">your family deserves.</span>
            </h2>

            {/* CTA Buttons */}
            <motion.div
              style={{ opacity: ctaOpacity, y: ctaY }}
              className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/auth/signup">
                <button className="w-full sm:w-auto bg-primary-900 text-white px-10 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-primary-800 hover:scale-105 transition-all shadow-lg shadow-primary-900/20">
                  Find Care Today
                </button>
              </Link>
              <Link href="/auth/signup?role=nanny">
                <button className="w-full sm:w-auto bg-white/40 text-primary-900 backdrop-blur-md px-10 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-white/60 transition-all border border-primary-900/20">
                  Become a Provider
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
