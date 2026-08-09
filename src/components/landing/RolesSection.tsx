'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen,
  HeartPulse,
  Check,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════ */

type Role = {
  id: string;
  label: string;
  Icon: LucideIcon;
  tagline: string;
  shortDescription: string;
  duties: string[];
  idealFor: string[];
  facts: { label: string; value: string }[];
  image: string;
  imageAlt: string;
  tint: string;
  iconBg: string;
  accentColor: string;
  /** Clean pricing configuration — only set for Shadow Teacher */
  pricing?: {
    startingAt: string;
    period: string;
  };
};

/** Display order: Shadow Teacher → Special Needs Trainer */
const roles: Role[] = [
  {
    id: 'shadow-teacher',
    label: 'Shadow Teacher',
    Icon: BookOpen,
    tagline: 'A steady hand beside your child in the classroom, every single day.',
    shortDescription:
      'Dedicated school support that keeps your child engaged, on track, and confident, from educators trained in ADHD, autism, and learning differences.',
    duties: [
      'Stay focused during lessons',
      'Classroom routines & transitions',
      'Gentle behavioural guidance',
      'Peer interaction support',
    ],
    idealFor: ['Learning differences', 'ADHD & autism spectrum', 'School integration', 'Exam & study support'],
    facts: [
      { label: 'Engagement', value: 'School hours, term-long' },
      { label: 'Vetting', value: 'Education background verified' },
      { label: 'Approach', value: 'Works with your school & therapists' },
    ],
    image: '/shadow_teacher.png',
    imageAlt: 'Shadow teacher guiding a child with schoolwork in class',
    tint: 'hsl(38, 55%, 96%)',
    iconBg: 'hsl(38, 60%, 89%)',
    accentColor: '#D97706',
    pricing: {
      startingAt: '₹15,000',
      period: '/mo',
    },
  },
  {
    id: 'special-needs',
    label: 'Special Needs Trainer',
    Icon: HeartPulse,
    tagline: "Trained care that follows your family's plan, not a generic one.",
    shortDescription:
      'Structured support for children with developmental or learning differences, matched to your child\'s unique needs and care plan, at home or in school.',
    duties: [
      'ADL & daily living skills (brushing, eating, spoon/pen use, fine motor practice)',
      'Worksheet designing for learning support',
      'Play therapy practice',
      'Dance therapy practice',
      'OT (occupational therapy) practice',
    ],
    idealFor: ['Developmental delays', 'Physical disabilities', 'Behavioural support', 'Respite for caregivers'],
    facts: [
      { label: 'Engagement', value: 'Flexible, hourly to full-time' },
      { label: 'Vetting', value: 'Experience & references confirmed' },
      { label: 'Approach', value: 'Aligned with your care plan' },
    ],
    image: '/special_needs.png',
    imageAlt: 'Caregiver supporting a child during a guided learning activity',
    tint: 'hsl(350, 40%, 96%)',
    iconBg: 'hsl(350, 45%, 91%)',
    accentColor: '#E11D48',
  },
];

/* ═══════════════════════════════════════════════════════════
   Z-LAYOUT ROW ITEM
   ═══════════════════════════════════════════════════════════ */

const ZRowItem = ({
  role,
  index,
}: {
  role: Role;
  index: number;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: '-60px' });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={rowRef}
      id={`service-card-${role.id}`}
      className="relative py-8 md:py-14 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        {/* ── Visual / Image Panel (With Quote Text overlay, No Logo) ── */}
        <div
          className={`md:col-span-6 lg:col-span-5 ${
            isEven ? 'md:order-1' : 'md:order-2'
          }`}
        >
          <div className="group relative rounded-[32px] overflow-hidden border border-primary-900/10 bg-white shadow-[0_16px_48px_-12px_rgba(13,43,69,0.15)] transition-all duration-500 hover:shadow-[0_24px_64px_-12px_rgba(13,43,69,0.22)]">
            <div
              className="relative aspect-4/3 sm:aspect-16/10 md:aspect-4/5 lg:aspect-4/5 w-full overflow-hidden"
              style={{ backgroundColor: role.tint }}
            >
              <Image
                src={role.image}
                alt={role.imageAlt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 45vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary-900/85 via-primary-900/25 to-transparent pointer-events-none" />

              {/* Quote text on top of image — no logo */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8 text-white">
                <p className="font-display text-lg sm:text-xl font-medium leading-snug tracking-tight text-white/95 drop-shadow-sm italic">
                  &ldquo;{role.tagline}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content / Detail Panel ── */}
        <div
          className={`md:col-span-6 lg:col-span-7 flex flex-col justify-center ${
            isEven ? 'md:order-2' : 'md:order-1'
          }`}
        >
          <h3 className="mb-2 font-display text-2xl sm:text-3xl lg:text-[2rem] font-medium leading-tight text-primary-900 tracking-tight">
            {role.label}
          </h3>

          {/* Clean Standard Pricing Badge — Shadow Teacher only */}
          {role.pricing && (
            <div className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full border border-amber-800/15 bg-amber-50/90 px-3.5 py-1.5 text-amber-900 shadow-2xs">
              <span className="text-xs font-medium uppercase tracking-wider text-amber-800/70">
                Starting at
              </span>
              <span className="font-display text-base font-bold text-amber-950">
                {role.pricing.startingAt}
              </span>
              <span className="text-xs font-medium text-amber-800/70">
                {role.pricing.period}
              </span>
            </div>
          )}

          {/* Short description */}
          <p className="mb-6 text-base leading-relaxed text-primary-900/70 font-body">
            {role.shortDescription}
          </p>

          {/* Key Duties — compact grid */}
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary-900/40">
              What they handle
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {role.duties.map((duty) => (
                <div
                  key={duty}
                  className="flex items-center gap-2.5 rounded-xl border border-primary-900/6 bg-white/80 px-3 py-2.5 shadow-2xs transition-all hover:bg-white hover:border-primary-900/12"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: role.iconBg }}
                  >
                    <Check size={11} className="text-primary-900/80" strokeWidth={3} />
                  </span>
                  <span className="text-xs sm:text-[13px] leading-snug text-primary-900/80 font-medium">
                    {duty}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal-for tags */}
          <div className="mb-7 flex flex-wrap gap-2">
            {role.idealFor.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary-900/10 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-primary-900/75 shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action CTA -> Links to Contact page */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href="/contact">
              <button className="group/btn flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary-900 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-800 shadow-md shadow-primary-900/15 cursor-pointer">
                Find out more
                <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */

export const RolesSection = () => {
  return (
    <section
      id="services"
      className="relative py-20 md:py-28 px-4 md:px-8 overflow-hidden scroll-mt-24"
      style={{
        background:
          'linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)',
      }}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full blur-[160px] opacity-[0.06]"
          style={{ background: 'hsl(200, 70%, 70%)' }}
        />
        <div
          className="absolute top-1/2 -left-40 h-[650px] w-[650px] rounded-full blur-[180px] opacity-[0.05]"
          style={{ background: 'hsl(38, 80%, 70%)' }}
        />
        <div
          className="absolute bottom-0 -right-20 h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.05]"
          style={{ background: 'hsl(350, 60%, 80%)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-primary-900 leading-[1.15] tracking-tight">
              Specialized care tailored to{' '}
              <span className="italic text-sky-700">your child&apos;s exact needs.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-body max-w-2xl mx-auto">
              From dedicated in-school shadow teachers to trained special needs trainers, find the right fit for your family.
            </p>
          </motion.div>
        </div>

        {/* Z-Layout Flow */}
        <div className="relative space-y-4 md:space-y-8">
          {roles.map((role, index) => (
            <ZRowItem
              key={role.id}
              role={role}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
