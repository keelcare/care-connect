'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Baby,
  BookOpen,
  HeartPulse,
  HandHeart,
  Check,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Service = {
  id: string;
  label: string;
  Icon: LucideIcon;
  tagline: string;
  description: string;
  duties: string[];
  idealFor: string[];
  facts: { label: string; value: string }[];
  gradient: string;
};

const services: Service[] = [
  {
    id: 'child-care',
    label: 'Child Care',
    Icon: Baby,
    tagline: 'Trusted nannies & sitters, for every age and schedule.',
    description:
      'A nanny is far more than a babysitter. Keel nannies handle your child’s daily routine end-to-end — feeding, nap schedules, play, homework help, and school pickups — while keeping you in the loop. Whether you need full-time, part-time, or occasional evenings, every nanny is verified before they ever step into your home.',
    duties: [
      'Daily routines: meals, naps, hygiene, and age-appropriate play',
      'School runs, homework supervision, and activity drop-offs',
      'Developmental engagement — reading, games, and outdoor time',
      'Regular updates so you always know how the day went',
    ],
    idealFor: [
      'Working parents',
      'Newborns to teens',
      'Full-time or part-time',
      'Date nights & backup care',
    ],
    facts: [
      { label: 'Engagement', value: 'Hourly, daily, or live-out full-time' },
      { label: 'Vetting', value: 'ID, background & reference checked' },
      { label: 'Payment', value: 'Only after care is delivered' },
    ],
    gradient:
      'linear-gradient(135deg, hsl(200, 70%, 92%) 0%, hsl(210, 75%, 88%) 60%, hsl(195, 65%, 90%) 100%)',
  },
  {
    id: 'shadow-teacher',
    label: 'Shadow Teacher',
    Icon: BookOpen,
    tagline: 'One-on-one classroom support so your child never falls behind.',
    description:
      'A shadow teacher accompanies your child to school and works alongside their classroom teacher, providing the individual attention mainstream classrooms can’t always give. They help your child stay focused, understand lessons, manage transitions, and build the confidence to participate — academically and socially.',
    duties: [
      'In-classroom support tailored to your child’s learning style',
      'Bridging communication between teachers, therapists, and parents',
      'Helping with focus, transitions, and classroom routines',
      'Building social skills and independence, step by step',
    ],
    idealFor: [
      'Learning differences',
      'ADHD & autism spectrum',
      'School integration',
      'Exam & study support',
    ],
    facts: [
      { label: 'Engagement', value: 'School hours, term-long placements' },
      { label: 'Vetting', value: 'Education background verified' },
      { label: 'Approach', value: 'Works with your school & therapists' },
    ],
    gradient:
      'linear-gradient(135deg, hsl(45, 80%, 92%) 0%, hsl(38, 70%, 88%) 60%, hsl(30, 60%, 90%) 100%)',
  },
  {
    id: 'special-needs',
    label: 'Special Needs',
    Icon: HeartPulse,
    tagline: 'Specialised caregivers trained for unique requirements.',
    description:
      'Special needs care requires more than kindness — it requires training. Keel connects you with caregivers experienced in supporting children and adults with developmental, physical, or behavioural needs, following the routines and therapy plans your family has built.',
    duties: [
      'Following therapy and behavioural plans set by your specialists',
      'Assistance with mobility, feeding, and daily living activities',
      'Sensory-aware engagement and structured routines',
      'Calm, trained response to behavioural episodes',
    ],
    idealFor: [
      'Developmental delays',
      'Physical disabilities',
      'Behavioural support',
      'Respite for family caregivers',
    ],
    facts: [
      { label: 'Engagement', value: 'Flexible — hourly to full-time' },
      { label: 'Vetting', value: 'Experience & references confirmed' },
      { label: 'Approach', value: 'Aligned with your care plan' },
    ],
    gradient:
      'linear-gradient(135deg, hsl(350, 60%, 94%) 0%, hsl(15, 65%, 90%) 60%, hsl(30, 55%, 92%) 100%)',
  },
  {
    id: 'elder-care',
    label: 'Elder Care',
    Icon: HandHeart,
    tagline: 'Compassionate companionship and support for ageing parents.',
    description:
      'Elder care on Keel means a trusted companion for your parents or grandparents — someone who helps with daily activities, medication reminders, and mobility, while offering the conversation and company that matter just as much. Ideal when you can’t be there every day but want someone dependable who is.',
    duties: [
      'Companionship, conversation, and daily engagement',
      'Medication reminders and appointment accompaniment',
      'Mobility assistance and fall-risk awareness at home',
      'Meal support, light errands, and family updates',
    ],
    idealFor: [
      'Ageing parents living alone',
      'Post-surgery recovery',
      'Daily check-ins',
      'Families living apart',
    ],
    facts: [
      { label: 'Engagement', value: 'Daily visits to full-day care' },
      { label: 'Vetting', value: 'ID, background & reference checked' },
      { label: 'Approach', value: 'Non-medical companion care' },
    ],
    gradient:
      'linear-gradient(135deg, hsl(150, 40%, 92%) 0%, hsl(170, 45%, 89%) 60%, hsl(190, 50%, 91%) 100%)',
  },
];

const isWaitlist = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';

export const ServicesShowcase = () => {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId)!;

  // Allow other sections (e.g. the ExpertiseScroll wheel) to activate a service tab
  useEffect(() => {
    const handleSelect = (e: Event) => {
      const serviceId = (e as CustomEvent<string>).detail;
      if (services.some((s) => s.id === serviceId)) {
        setActiveId(serviceId);
      }
    };
    window.addEventListener('keel:select-service', handleSelect);
    return () => window.removeEventListener('keel:select-service', handleSelect);
  }, []);

  return (
    <section
      id="services"
      className="relative py-24 md:py-32 px-4 md:px-8 overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-900 leading-[1.05] tracking-tight max-w-xl">
            Know exactly what{' '}
            <span className="italic text-sky-700/80">you’re getting.</span>
          </h2>
          <p className="text-base text-stone-500 leading-relaxed max-w-xs md:text-right">
            Every type of care, explained. Pick a service to see what it
            includes, who it’s for, and how it works.
          </p>
        </motion.div>

        {/* Service selector */}
        <div
          role="tablist"
          aria-label="Care services"
          className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12"
        >
          {services.map((service) => {
            const isActive = service.id === activeId;
            return (
              <button
                key={service.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`service-panel-${service.id}`}
                onClick={() => setActiveId(service.id)}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-3 rounded-full text-sm md:text-base font-semibold transition-colors duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-primary-900/60 hover:text-primary-900 bg-white/60 border border-stone-200/80'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="service-tab-pill"
                    className="absolute inset-0 rounded-full bg-primary-900 shadow-lg shadow-primary-900/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <service.Icon size={17} strokeWidth={2} className="relative z-10" />
                <span className="relative z-10">{service.label}</span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            id={`service-panel-${active.id}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid lg:grid-cols-[1.1fr_1fr] rounded-3xl overflow-hidden bg-white shadow-premium border border-stone-200/60"
          >
            {/* Left: narrative */}
            <div className="p-8 md:p-12 flex flex-col">
              <p className="text-xs font-bold uppercase tracking-widest text-sky-700/70 mb-3">
                What it entails
              </p>
              <h3 className="text-2xl md:text-3xl font-display font-medium text-primary-900 leading-snug mb-4">
                {active.tagline}
              </h3>
              <p className="text-sm md:text-base text-stone-500 leading-relaxed mb-8">
                {active.description}
              </p>

              <ul className="flex flex-col gap-3 mb-8">
                {active.duties.map((duty, i) => (
                  <motion.li
                    key={duty}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-900 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm md:text-base text-primary-900/80 leading-relaxed">
                      {duty}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto">
                {isWaitlist ? (
                  <a href="#waitlist" className="inline-block">
                    <button className="group flex items-center gap-2 bg-primary-900 text-white px-8 py-4 rounded-full font-semibold text-sm md:text-base hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/20">
                      Join the waitlist for {active.label.toLowerCase()}
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </a>
                ) : (
                  <Link href="/auth/signup" className="inline-block">
                    <button className="group flex items-center gap-2 bg-primary-900 text-white px-8 py-4 rounded-full font-semibold text-sm md:text-base hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/20">
                      Find {active.label.toLowerCase()} near you
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right: at-a-glance card */}
            <div
              className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]"
              style={{ background: active.gradient }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,255,255,0.7)_0%,transparent_60%)] pointer-events-none" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center shadow-md mb-8">
                  <active.Icon size={26} className="text-primary-900" strokeWidth={1.7} />
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-primary-900/50 mb-3">
                  Ideal for
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {active.idealFor.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur text-xs md:text-sm font-semibold text-primary-900 border border-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex flex-col divide-y divide-primary-900/10">
                {active.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-4 py-3"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-900/50 shrink-0">
                      {fact.label}
                    </span>
                    <span className="text-sm font-semibold text-primary-900 text-right">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
