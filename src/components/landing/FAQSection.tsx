'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'How are caregivers verified?',
    answer:
      'Every caregiver on Keel completes a three-step verification before their profile goes live: a government-issued photo ID check, a comprehensive background and registry scan, and direct reference calls with past employers. Verification is refreshed regularly, not just once at signup.',
  },
  {
    question: 'What is the difference between a nanny and a babysitter?',
    answer:
      'A babysitter provides occasional, short-term supervision. A nanny is a consistent care professional who manages your child’s full routine (meals, naps, school runs, homework, and development), often on a fixed weekly schedule. Keel supports both, from one-off evenings to full-time placements.',
  },
  {
    question: 'What does a shadow teacher actually do at school?',
    answer:
      'A shadow teacher sits alongside your child in their regular classroom and provides one-on-one support: keeping them focused, breaking down lessons, helping with transitions between activities, and encouraging social participation. They coordinate with the classroom teacher and share regular progress updates with you.',
  },
  {
    question: 'Can I meet a caregiver before booking?',
    answer:
      'Yes. Once you match with a caregiver you can chat directly on the platform, review their verified profile and references, and arrange an introduction before confirming anything.',
  },
];

const FAQItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border-b border-stone-200/70">
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between gap-6 py-6 text-left group"
    >
      <span className="text-base md:text-lg font-semibold text-primary-900 leading-snug">
        {faq.question}
      </span>
      <span
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
          isOpen
            ? 'bg-primary-900 rotate-45'
            : 'bg-white border border-stone-200 group-hover:border-primary-900/30'
        )}
      >
        <Plus
          size={16}
          className={cn('transition-colors', isOpen ? 'text-white' : 'text-primary-900')}
        />
      </span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="pb-6 pr-12 text-sm md:text-base text-stone-500 leading-relaxed max-w-2xl">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-24 md:py-32 px-4 md:px-8"
      style={{
        background:
          'linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-28"
        >
          <h2 className="text-4xl md:text-5xl font-display font-medium text-primary-900 leading-[1.08] tracking-tight mb-5">
            Questions? <br />
            <span className="italic text-sky-700/80">We’ve got answers.</span>
          </h2>
          <p className="text-base text-stone-500 leading-relaxed max-w-sm">
            Everything families usually ask before their first booking. Still
            unsure about something? Reach out, we read every message.
          </p>
        </motion.div>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
