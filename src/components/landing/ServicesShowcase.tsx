'use client';

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen,
  HeartPulse,
  Check,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════ */

type Service = {
  id: string;
  label: string;
  Icon: LucideIcon;
  tagline: string;
  description: string;
  duties: string[];
  idealFor: string[];
  facts: { label: string; value: string }[];
  tint: string;
  iconBg: string;
};

const services: Service[] = [
  {
    id: 'shadow-teacher',
    label: 'Shadow Teacher',
    Icon: BookOpen,
    tagline: 'A steady hand beside your child in the classroom, every single day.',
    description:
      "A shadow teacher accompanies your child to school, providing the individual attention mainstream classrooms can't always give. They help your child stay focused, understand lessons, and build confidence.",
    duties: [
      "In-classroom support tailored to your child's learning style",
      'Bridging communication between teachers, therapists, and parents',
      'Helping with focus, transitions, and classroom routines',
      'Building social skills and independence, step by step',
    ],
    idealFor: ['Learning differences', 'ADHD & autism spectrum', 'School integration', 'Exam & study support'],
    facts: [
      { label: 'Engagement', value: 'School hours, term-long placements' },
      { label: 'Vetting', value: 'Education background verified' },
      { label: 'Approach', value: 'Works with your school & therapists' },
    ],
    tint: 'hsl(38, 55%, 96%)',
    iconBg: 'hsl(38, 60%, 89%)',
  },
  {
    id: 'special-needs',
    label: 'Special Needs',
    Icon: HeartPulse,
    tagline: "Trained care that follows your family's plan, not a generic one.",
    description:
      'Special needs care requires more than kindness — it requires training. Keel connects you with caregivers experienced in supporting children and adults with developmental, physical, or behavioural needs.',
    duties: [
      'Following therapy and behavioural plans set by your specialists',
      'Assistance with mobility, feeding, and daily living activities',
      'Sensory-aware engagement and structured routines',
      'Calm, trained response to behavioural episodes',
    ],
    idealFor: ['Developmental delays', 'Physical disabilities', 'Behavioural support', 'Respite for family caregivers'],
    facts: [
      { label: 'Engagement', value: 'Flexible — hourly to full-time' },
      { label: 'Vetting', value: 'Experience & references confirmed' },
      { label: 'Approach', value: 'Aligned with your care plan' },
    ],
    tint: 'hsl(350, 40%, 96%)',
    iconBg: 'hsl(350, 45%, 91%)',
  },
];

const isWaitlist = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';

/* ═══════════════════════════════════════════════════════════
   Z-ROW — one service in Z-pattern layout
   even index  → identity LEFT,  detail RIGHT
   odd index   → identity RIGHT, detail LEFT
   ═══════════════════════════════════════════════════════════ */

const ServiceRow = ({ service, index }: { service: Service; index: number }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: '-100px' });
  const isReversed = index % 2 !== 0; // odd rows flip

  /* Identity panel — label + large tagline + icon */
  const IdentityPanel = (
    <motion.div
      initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className="flex flex-col justify-between rounded-[28px] p-8 md:p-12 relative overflow-hidden min-h-[340px] md:min-h-[420px]"
      style={{ backgroundColor: service.tint }}
    >
      {/* Soft blob accents */}
      <div
        className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-[70px] opacity-50 pointer-events-none"
        style={{ backgroundColor: service.iconBg }}
      />
      <div
        className="absolute bottom-0 left-8 h-32 w-32 rounded-full blur-[50px] opacity-25 pointer-events-none"
        style={{ backgroundColor: service.iconBg }}
      />

      {/* Icon */}
      <div className="relative z-10">
        <div
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
          style={{ backgroundColor: service.iconBg }}
        >
          <service.Icon size={30} className="text-primary-900" strokeWidth={1.5} />
        </div>

        {/* Service label */}
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-900/40">
          {service.label}
        </p>

        {/* Large serif tagline */}
        <h3 className="font-display text-2xl md:text-3xl lg:text-[2rem] font-medium leading-[1.25] tracking-tight text-primary-900 max-w-xs">
          {service.tagline}
        </h3>
      </div>

      {/* "Ideal for" tags — anchored to bottom */}
      <div className="relative z-10 mt-8 flex flex-wrap gap-2">
        {service.idealFor.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-primary-900/10 bg-white/60 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-semibold text-primary-900/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );

  /* Detail panel — description, duties, facts, CTA */
  const DetailPanel = (
    <motion.div
      initial={{ opacity: 0, x: isReversed ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="flex flex-col justify-between rounded-[28px] bg-white p-8 md:p-12 min-h-[340px] md:min-h-[420px]"
      style={{ boxShadow: '0 4px 28px rgba(30, 58, 95, 0.07), 0 1px 4px rgba(30, 58, 95, 0.04)' }}
    >
      <div>
        {/* Description */}
        <p className="mb-7 text-[15px] leading-relaxed text-stone-500">
          {service.description}
        </p>

        {/* Duties */}
        <ul className="mb-7 flex flex-col gap-3">
          {service.duties.map((duty, i) => (
            <motion.li
              key={duty}
              initial={{ opacity: 0, x: 10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.3 + i * 0.07,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-3"
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: service.iconBg }}
              >
                <Check size={11} className="text-primary-900/70" strokeWidth={3} />
              </span>
              <span className="text-sm leading-relaxed text-primary-900/70">{duty}</span>
            </motion.li>
          ))}
        </ul>

        {/* Quick facts */}
        <div className="mb-7 flex flex-col divide-y divide-stone-100">
          {service.facts.map((fact) => (
            <div key={fact.label} className="flex items-baseline justify-between gap-4 py-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
                {fact.label}
              </span>
              <span className="text-sm font-semibold text-primary-900/80 text-right">
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto">
        {isWaitlist ? (
          <a href="#waitlist" className="inline-block">
            <button className="group/btn flex items-center gap-2 rounded-full bg-primary-900 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-800 shadow-md shadow-primary-900/15 cursor-pointer">
              Join the waitlist
              <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </a>
        ) : (
          <Link href="/auth/signup">
            <button className="group/btn flex items-center gap-2 rounded-full bg-primary-900 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-800 shadow-md shadow-primary-900/15 cursor-pointer">
              Find {service.label.toLowerCase()} near you
              <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );

  return (
    <div
      ref={rowRef}
      id={`service-card-${service.id}`}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
    >
      {isReversed ? (
        <>
          {DetailPanel}
          {IdentityPanel}
        </>
      ) : (
        <>
          {IdentityPanel}
          {DetailPanel}
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */

export const ServicesShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.25], ['28px', '0px']);

  // Allow ExpertiseScroll wheel to scroll to a matching card
  React.useEffect(() => {
    const handleSelect = (e: Event) => {
      const serviceId = (e as CustomEvent<string>).detail;
      const el = document.getElementById(`service-card-${serviceId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('keel:select-service', handleSelect);
    return () => window.removeEventListener('keel:select-service', handleSelect);
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 md:py-36 px-4 md:px-8 overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)',
      }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full blur-[160px] opacity-[0.05]"
          style={{ background: 'hsl(200, 70%, 70%)' }}
        />
        <div
          className="absolute bottom-0 -left-32 h-[500px] w-[500px] rounded-full blur-[140px] opacity-[0.04]"
          style={{ background: 'hsl(38, 80%, 70%)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          style={{ y: headerY }}
          className="mb-20 md:mb-28 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700/70">
              <span className="inline-block h-px w-5 bg-sky-600/50" />
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-900 leading-[1.05] tracking-tight max-w-xl">
              Know exactly what{' '}
              <span className="italic text-sky-700/80">you're getting.</span>
            </h2>
          </div>
          <p className="text-base text-stone-500 leading-relaxed max-w-xs md:text-right">
            Every type of care, explained honestly. Pick the one that fits — we'll handle the rest.
          </p>
        </motion.div>

        {/* Z-pattern service rows */}
        <div className="flex flex-col gap-6 md:gap-8">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
};
