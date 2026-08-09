'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'What is a Shadow Teacher, and how are they different from a regular nanny?',
    answer:
      'A Shadow Teacher is a trained professional who accompanies a child, usually in a school or learning environment, to support their academic, social, and behavioral needs one-on-one. Unlike a nanny who handles general care, a Shadow Teacher focuses on helping your child keep pace in class, follow instructions, manage transitions, and build independence over time, often working closely with the school\'s teachers and counselors.',
  },
  {
    question: 'What is a Special Needs Trainer, and what do they help with?',
    answer:
      'A Special Needs Trainer works with children who need more targeted developmental support, such as sensory regulation, speech and communication, motor skills, or behavioral therapy goals. They typically follow a plan (often set by a therapist or doctor) and focus on skill-building at home or in dedicated sessions, rather than classroom support.',
  },
  {
    question: 'How do I know whether my child needs a Shadow Teacher or a Special Needs Trainer?',
    answer:
      'It depends on the setting and goal. If your child needs support inside the classroom to keep up academically and socially, a Shadow Teacher is the right fit. If the focus is on therapeutic or developmental goals, like speech, motor skills, or behavior, outside a school setting, a Special Needs Trainer is better suited. Not sure which one fits? Reach out and we\'ll help you figure it out based on your child\'s needs.',
  },
  {
    question: 'Are Keel\'s Shadow Teachers and Special Needs Trainers background-verified?',
    answer:
      'Yes. Every caregiver on Keel goes through background checks and a vetting process before they\'re listed on the platform, so you can book with confidence.',
  },
  {
    question: 'Can I meet a caregiver before booking?',
    answer:
      'Absolutely, we want you to feel completely comfortable before committing. You can request a free home visit, where the caregiver comes to meet your family and child in person at no cost. Prefer something quicker? You can also do a video call introduction first, and decide from there whether you\'d like to take it further.',
  },
  {
    question: 'What qualifications do Keel\'s caregivers have?',
    answer:
      'Our Shadow Teachers and Special Needs Trainers come with relevant training, certifications, and hands-on experience depending on their specialization, ranging from special education backgrounds to therapy-support certifications. All caregivers are also trained by Keel\'s CEO, Mannat Mitra, to ensure a consistent standard of care across the platform. Each profile lists their specific experience so you can match them to your child\'s needs.',
  },
  {
    question: 'Can a Shadow Teacher or Trainer work with children with specific conditions (like autism, ADHD, or learning disabilities)?',
    answer:
      'Yes. Many of our caregivers specialize in working with children with autism spectrum disorder, ADHD, sensory processing differences, learning disabilities, and other developmental needs. You can filter or ask us to match you with someone experienced in your child\'s specific requirement.',
  },
  {
    question: 'How does the matching process work?',
    answer:
      'Tell us about your child: their age, needs, school setting (if relevant), and what kind of support you\'re looking for. We\'ll shortlist caregivers who fit, and you can review profiles, chat, do a video call, or arrange a free home visit before making your decision.',
  },
  {
    question: 'What if the caregiver isn\'t the right fit for my child?',
    answer:
      'That\'s completely okay, it happens. If it\'s not clicking, let us know and we\'ll help you find a better match. Your child\'s comfort and progress matter more than any single booking.',
  },
  {
    question: 'Do Shadow Teachers coordinate with my child\'s school?',
    answer:
      'Yes, where needed. Shadow Teachers often liaise with class teachers and school staff to stay aligned on your child\'s academic plan and classroom behavior goals, so support at school and at home stays consistent.',
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
