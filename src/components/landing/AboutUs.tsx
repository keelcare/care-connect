"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ═══════════════════════════════════════════════════════════
   EDITORIAL COLORS — pulled from the existing design system
   (warm cream bg, deep navy text, sky-blue accent)
   ═══════════════════════════════════════════════════════════ */
const WARM_BG =
  "linear-gradient(160deg, hsl(38,60%,97%) 0%, hsl(30,50%,95%) 50%, hsl(45,55%,96%) 100%)";

/* ═══════════════════════════════════════════════════════════
   COPY — three blocks in exact order
   ═══════════════════════════════════════════════════════════ */
const BLOCK_1_TEXT =
  "Inclusive education in India has grown tremendously over the past decade, with shadow teachers becoming an essential part of supporting children with diverse learning and developmental needs. While the demand has increased rapidly - especially after COVID-19 - finding trained, reliable shadow educators remains a challenge for many families and schools.";

const BLOCK_2_TEXT =
  "At KEELcare, we bridge that gap by providing qualified shadow teachers matched to each child's unique needs, diagnosis, and learning profile. With a child-first approach and placements available within 24 hours whenever possible, we are committed to making quality educational support accessible, timely, and personalised.";

const BLOCK_3_TEXT =
  "Because every child deserves the right support to learn, grow, and thrive.";

/* ═══════════════════════════════════════════════════════════
   HAND-DRAWN EDITORIAL ARROW SVG
   (curved, annotation-style — not a generic chevron)
   ═══════════════════════════════════════════════════════════ */
const EditorialArrow = React.forwardRef<SVGSVGElement>((_, ref) => (
  <svg
    ref={ref}
    viewBox="0 0 60 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-10 md:w-14 h-auto"
    aria-hidden="true"
  >
    {/* Main curved stroke — hand-drawn feel via slight wobble in the path */}
    <path
      d="M30 8 C28 40, 35 60, 30 90 C25 120, 32 140, 30 170"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
      className="arrow-stem"
    />
    {/* Left feather of arrowhead */}
    <path
      d="M30 170 C28 170, 18 158, 14 152"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
      className="arrow-head-l"
    />
    {/* Right feather of arrowhead */}
    <path
      d="M30 170 C32 170, 42 158, 46 152"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
      className="arrow-head-r"
    />
  </svg>
));
EditorialArrow.displayName = "EditorialArrow";



/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export const AboutUs = () => {
  /* ── Refs ── */
  const wrapperRef = useRef<HTMLDivElement>(null); // outermost scroll container

  const block1Ref = useRef<HTMLDivElement>(null); // Block 1 pin wrapper
  const block1TextRef = useRef<HTMLParagraphElement>(null);

  const arrowSectionRef = useRef<HTMLDivElement>(null);
  const arrowSvgRef = useRef<SVGSVGElement>(null);

  const block2Ref = useRef<HTMLDivElement>(null);
  const block2TextRef = useRef<HTMLParagraphElement>(null);

  const block3Ref = useRef<HTMLDivElement>(null);
  const block3TextRef = useRef<HTMLHeadingElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  /* ── GSAP setup ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ─────────────────────────────────────────────
         gsap.matchMedia — responsive animation logic
         ───────────────────────────────────────────── */
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions!;

          /* ═══════════════════════════════════════════
             BLOCK 1 — Staggered word-by-word reveal
             Scroll-scrubbed, pinned in viewport.
             ═══════════════════════════════════════════ */
          if (block1TextRef.current) {
            const split1 = new SplitText(block1TextRef.current, {
              type: "words",
            });

            gsap.set(split1.words, {
              opacity: 0,
              y: isDesktop ? 18 : 10,       // ← TWEAK: vertical travel distance
              filter: "blur(4px)",
            });

            ScrollTrigger.create({
              trigger: block1Ref.current,
              start: "top 80%",                // ← TWEAK: when reveal starts
              end: "top 10%",                  // ← TWEAK: when reveal completes
              scrub: 1,                        // ← TWEAK: scrub smoothness (seconds)
              animation: gsap.to(split1.words, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1,
                ease: "power3.out",
                stagger: isDesktop ? 0.04 : 0.06, // ← TWEAK: word stagger timing
              }),
            });
          }

          /* ═══════════════════════════════════════════
             ARROW — Stroke-dashoffset draw animation
             Scrubbed between Block 1 and Block 2.
             ═══════════════════════════════════════════ */
          if (arrowSvgRef.current) {
            const paths = arrowSvgRef.current.querySelectorAll("path");
            paths.forEach((path) => {
              const length = path.getTotalLength();
              gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
              });
            });

            ScrollTrigger.create({
              trigger: arrowSectionRef.current,
              start: "top 70%",                // ← TWEAK: arrow draw start
              end: "bottom 50%",               // ← TWEAK: arrow draw end
              scrub: 0.8,                      // ← TWEAK: arrow scrub speed
              animation: gsap.to(paths, {
                strokeDashoffset: 0,
                duration: 1,
                ease: "none",
                stagger: 0.15,                 // ← TWEAK: stem → head-L → head-R stagger
              }),
            });
          }

          /* ═══════════════════════════════════════════
             BLOCK 2 — Second editorial paragraph
             Styled identically to Block 1.
             ═══════════════════════════════════════════ */
          if (block2TextRef.current) {
            const split2 = new SplitText(block2TextRef.current, {
              type: "words",
            });

            gsap.set(split2.words, {
              opacity: 0,
              y: isDesktop ? 18 : 10,
              filter: "blur(4px)",
            });

            ScrollTrigger.create({
              trigger: block2Ref.current,
              start: "top 80%",
              end: "top 10%",
              scrub: 1,
              animation: gsap.to(split2.words, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1,
                ease: "power3.out",
                stagger: isDesktop ? 0.04 : 0.06,
              }),
            });
          }

          /* ═══════════════════════════════════════════
             BLOCK 3 — Payoff line (emotional climax)
             Large type, centered, with highlighter-wipe
             accent behind key phrase, scrubbed to scroll.
             ═══════════════════════════════════════════ */
          if (block3TextRef.current) {
            const split3 = new SplitText(block3TextRef.current, {
              type: "words",
            });

            gsap.set(split3.words, {
              opacity: 0,
              y: isDesktop ? 24 : 14,
            });

            // Word reveal
            ScrollTrigger.create({
              trigger: block3Ref.current,
              start: "top 70%",                // ← TWEAK: payoff reveal start
              end: "top 20%",                  // ← TWEAK: payoff reveal end
              scrub: 1,
              animation: gsap.to(split3.words, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                stagger: isDesktop ? 0.06 : 0.08, // ← TWEAK: slightly more dramatic stagger
              }),
            });
          }

          // Highlighter wipe behind accent phrase
          if (highlightRef.current) {
            gsap.set(highlightRef.current, { scaleX: 0, transformOrigin: "left center" });

            ScrollTrigger.create({
              trigger: block3Ref.current,
              start: "top 40%",                // ← TWEAK: highlight wipe start (after text begins appearing)
              end: "top 5%",                   // ← TWEAK: highlight wipe end
              scrub: 0.8,
              animation: gsap.to(highlightRef.current, {
                scaleX: 1,
                duration: 1,
                ease: "power2.inOut",
              }),
            });
          }
        }
      );
    }, wrapperRef);

    /* Cleanup — kill all ScrollTriggers + revert SplitText on unmount / HMR */
    return () => ctx.revert();
  }, []);

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <section
      id="about"
      ref={wrapperRef}
      className="relative overflow-hidden"
      style={{ background: WARM_BG }}
    >
      {/* Grain overlay — printed-page texture */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-sky-200/8 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-primary-900/5 blur-[140px]" />
      </div>

      {/* ──────────────────────────────────────────
           BLOCK 1 — Primary editorial reveal
           ────────────────────────────────────────── */}
      <div
        ref={block1Ref}
        className="relative z-10 flex min-h-[70vh] items-center px-6 py-32 md:min-h-[80vh] md:px-16 lg:px-24"
      >
        <div className="mx-auto w-full max-w-5xl">
          {/* Section label */}
          <span className="mb-8 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700/70">
            <span className="inline-block h-px w-5 bg-sky-600/50" />
            About KEELcare
          </span>

          {/* Block 1 text — large serif editorial treatment */}
          <p
            ref={block1TextRef}
            className="max-w-3xl font-serif text-[1.35rem] font-normal leading-[1.75] tracking-tight text-primary-900/90 md:text-[1.65rem] md:leading-[1.7] lg:text-[1.85rem]"
          >
            {BLOCK_1_TEXT}
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────
           ARROW — Hand-drawn editorial connector
           ────────────────────────────────────────── */}
      <div
        ref={arrowSectionRef}
        className="relative z-10 flex items-center justify-center pt-12 pb-4 md:pt-20 md:pb-8"
      >
        <div className="text-primary-900/25">
          <EditorialArrow ref={arrowSvgRef} />
        </div>
      </div>

      {/* ──────────────────────────────────────────
           BLOCK 2 — Second paragraph
           Same large editorial typography as Block 1.
           ────────────────────────────────────────── */}
      <div
        ref={block2Ref}
        className="relative z-10 flex min-h-[45vh] items-center px-6 pt-12 pb-10 md:min-h-[45vh] md:px-16 lg:px-24 md:pb-16"
      >
        <div className="mx-auto w-full max-w-5xl">
          <p
            ref={block2TextRef}
            className="mx-auto text-center max-w-3xl font-serif text-[1.35rem] font-normal leading-[1.75] tracking-tight text-primary-900/90 md:text-[1.65rem] md:leading-[1.7] lg:text-[1.85rem]"
          >
            {BLOCK_2_TEXT}
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────
           BLOCK 3 — Payoff / emotional climax
           Large, centered, with highlighter-marker
           wipe behind the key phrase.
           ────────────────────────────────────────── */}
      <div
        ref={block3Ref}
        className="relative z-10 flex min-h-[60vh] items-center justify-center px-6 pt-16 pb-32 md:min-h-[60vh] md:px-16 md:pt-24"
      >
        <div className="relative mx-auto max-w-4xl text-center">
          <h2
            ref={block3TextRef}
            className="font-serif text-3xl font-medium leading-[1.2] tracking-tight text-primary-900 sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.15]"
          >
            Because every child deserves the right{" "}
            <span className="relative inline-block">
              {/* Highlighter wipe — sits behind the text */}
              <span
                ref={highlightRef}
                aria-hidden="true"
                className="absolute -inset-x-2 bottom-0 top-1/2 -z-10 rounded-sm bg-sky-200/50"
              />
              <em className="not-italic text-sky-700/90">support</em>
            </span>{" "}
            to learn, grow, and thrive.
          </h2>
        </div>
      </div>
    </section>
  );
};
