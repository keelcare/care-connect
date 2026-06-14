'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ServiceCardProps {
  /** Service identifier — used as an accessible label */
  id: string;
  /** Icon element (lucide-react, 24px rendered inside badge) */
  icon: ReactNode;
  /** Service name */
  title: string;
  /** One-line description */
  description: string;
  /** Pricing text, e.g. "Starting ₹200/hr" */
  pricingLabel: string;
  /** Optional sub-label under pricing */
  pricingSublabel?: string;
  /** Optional badge pill text */
  badge?: string;
  /** Animation delay (seconds) */
  delay?: number;
  /** Click handler */
  onClick: () => void;
}

export function ServiceCard({
  id,
  icon,
  title,
  description,
  pricingLabel,
  pricingSublabel,
  badge,
  delay = 0,
  onClick,
}: ServiceCardProps) {
  return (
    <motion.button
      id={`service-card-${id}`}
      type="button"
      aria-label={`Book ${title}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={[
        'group relative w-full text-left',
        'bg-white rounded-2xl',
        'border border-[hsl(var(--border))]',
        'shadow-[var(--shadow-sm)]',
        'hover:border-[hsl(var(--primary))]',
        'hover:shadow-[var(--shadow-lg)]',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
        'cursor-pointer',
        'p-5',
        'flex flex-col gap-4',
      ].join(' ')}
    >
      {/* Top row: icon badge + optional badge pill + chevron */}
      <div className="flex items-start justify-between gap-3">
        {/* Icon Badge */}
        <div
          className={[
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
            'bg-[hsl(var(--primary-50))] text-[hsl(var(--primary))]',
            'group-hover:bg-[hsl(var(--primary))] group-hover:text-white',
            'transition-colors duration-300',
          ].join(' ')}
        >
          {icon}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Optional badge */}
          {badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[hsl(var(--primary-50))] text-[hsl(var(--primary))]">
              {badge}
            </span>
          )}

          {/* Chevron */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[hsl(var(--muted))] group-hover:bg-[hsl(var(--primary))] transition-colors duration-300 shrink-0">
            <ChevronRight
              size={14}
              className="text-[hsl(var(--muted-foreground))] group-hover:text-white transition-colors duration-300"
            />
          </div>
        </div>
      </div>

      {/* Service name + description */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-[hsl(var(--foreground))] font-heading leading-snug">
          {title}
        </h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] font-body leading-relaxed">
          {description}
        </p>
      </div>

      {/* Pricing */}
      <div className="mt-auto pt-3 border-t border-[hsl(var(--border))]">
        <p className="text-sm font-bold text-[hsl(var(--primary))]">{pricingLabel}</p>
        {pricingSublabel && (
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{pricingSublabel}</p>
        )}
      </div>
    </motion.button>
  );
}
