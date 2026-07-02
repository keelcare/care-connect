'use client';

import React from 'react';
import { SelectablePill } from '@/components/ui/SelectablePill';

export function FieldLabel({
  children,
  required,
  hint,
}: {
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-2.5">
      <label className="block text-sm font-semibold text-primary-900">
        {children}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
    </div>
  );
}

/** A labelled group of toggle chips for choosing several values from a small set. */
export function PillMultiSelect({
  label,
  required,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  return (
    <div>
      <FieldLabel required={required} hint={hint}>
        {label}
      </FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <SelectablePill
            key={opt}
            label={opt}
            selected={value.includes(opt)}
            onClick={() => toggle(opt)}
          />
        ))}
      </div>
    </div>
  );
}

/** A labelled group of toggle chips for choosing exactly one value from a small set. */
export function PillSingleSelect({
  label,
  required,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div>
      <FieldLabel required={required} hint={hint}>
        {label}
      </FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <SelectablePill
            key={opt.value}
            label={opt.label}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
