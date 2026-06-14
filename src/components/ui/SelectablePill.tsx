'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SelectablePillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  /** 'sm' = compact (time/day pills), 'md' = default (duration) */
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export function SelectablePill({
  label,
  selected,
  onClick,
  disabled = false,
  size = 'md',
  className,
  id,
}: SelectablePillProps) {
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl border transition-all duration-150 select-none',
        size === 'sm'
          ? 'px-3 py-1.5 text-xs min-w-[40px]'
          : 'px-4 py-2.5 text-sm min-w-[56px]',
        selected
          ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow-sm'
          : disabled
          ? 'bg-transparent text-[hsl(var(--muted-foreground))]/40 border-[hsl(var(--border))] cursor-not-allowed line-through'
          : 'bg-transparent text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-50))] hover:text-[hsl(var(--primary))]',
        className
      )}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
