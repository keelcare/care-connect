'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectableCardProps {
  label: string;
  description?: string;
  /** discount % — renders a green badge if > 0 */
  discount?: number;
  popular?: boolean;
  selected: boolean;
  onClick: () => void;
  className?: string;
  id?: string;
}

export function SelectableCard({
  label,
  description,
  discount,
  popular,
  selected,
  onClick,
  className,
  id,
}: SelectableCardProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'relative w-full text-left rounded-2xl border p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
        selected
          ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))] shadow-md'
          : 'bg-white border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:shadow-sm',
        className
      )}
    >
      {/* Popular tag — top-right corner, no overlap */}
      {popular && !selected && (
        <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-widest bg-[hsl(var(--primary-50))] text-[hsl(var(--primary))] px-1.5 py-0.5 rounded-full">
          Popular
        </span>
      )}
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <Check size={11} className="text-white" />
        </span>
      )}

      {/* Plan name */}
      <p className={cn('font-semibold text-sm font-heading leading-tight', selected ? 'text-white' : 'text-[hsl(var(--foreground))]')}>
        {label}
      </p>

      {/* Description */}
      {description && (
        <p className={cn('text-[11px] mt-0.5 leading-snug', selected ? 'text-white/75' : 'text-[hsl(var(--muted-foreground))]')}>
          {description}
        </p>
      )}

      {/* Discount badge */}
      {discount !== undefined && discount > 0 && (
        <span
          className={cn(
            'inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full',
            selected
              ? 'bg-white/20 text-white'
              : 'bg-emerald-50 text-emerald-700'
          )}
        >
          Save {discount}%
        </span>
      )}
    </button>
  );
}
