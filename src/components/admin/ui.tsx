'use client';

import React from 'react';

/**
 * Shared admin design-system primitives.
 * Codifies the Keel brand theme (deep-navy `primary-900`, sky accents, Lora
 * display headings, soft rounded cards) so every admin screen looks consistent.
 */

/* ─────────────────────────── Page header ─────────────────────────── */

export function AdminPageHeader({
  title,
  subtitle,
  eyebrow,
  icon: Icon,
  actions,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-500/70 mb-2">
            {eyebrow}
          </p>
        )}
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-2xl bg-primary-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Icon size={19} />
            </div>
          )}
          <h1 className="font-display text-3xl md:text-[34px] font-bold text-primary-900 leading-tight truncate">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-neutral-500 mt-2 leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

/* ─────────────────────────── Stat card ──────────────────────────── */

type Tone = 'navy' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet';

const TONES: Record<Tone, { chip: string; ring: string }> = {
  navy: { chip: 'bg-primary-50 text-primary-700', ring: 'ring-primary-100' },
  sky: { chip: 'bg-sky-50 text-sky-600', ring: 'ring-sky-100' },
  emerald: { chip: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-100' },
  amber: { chip: 'bg-amber-50 text-amber-600', ring: 'ring-amber-100' },
  rose: { chip: 'bg-rose-50 text-rose-600', ring: 'ring-rose-100' },
  violet: { chip: 'bg-violet-50 text-violet-600', ring: 'ring-violet-100' },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'navy',
  delta,
  hint,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  tone?: Tone;
  delta?: { value: string; positive?: boolean };
  hint?: string;
  onClick?: () => void;
}) {
  const t = TONES[tone];
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[24px] border border-neutral-100 shadow-soft p-5 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${t.chip}`}>
            <Icon size={20} />
          </div>
        )}
        {delta && (
          <span
            className={`text-[11px] font-bold px-2 py-1 rounded-full ${
              delta.positive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            {delta.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl md:text-[28px] font-bold text-primary-900 font-display leading-none">
          {value}
        </p>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mt-2">
          {label}
        </p>
        {hint && <p className="text-[11px] text-neutral-400 mt-1">{hint}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────── Section card ───────────────────────── */

export function SectionCard({
  title,
  description,
  action,
  icon: Icon,
  className = '',
  bodyClassName = 'p-6',
  children,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`bg-white rounded-[24px] border border-neutral-100 shadow-soft overflow-hidden ${className}`}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && <Icon size={17} className="text-primary-600 shrink-0" />}
            <div className="min-w-0">
              {title && (
                <h2 className="font-display text-lg font-bold text-primary-900 truncate">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-neutral-500 truncate">{description}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/* ─────────────────────────── Status badge ───────────────────────── */

export type BadgeTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'violet';

const BADGE_TONES: Record<BadgeTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-rose-50 text-rose-700 border-rose-100',
  info: 'bg-sky-50 text-sky-700 border-sky-100',
  neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
};

export function StatusBadge({
  tone = 'neutral',
  children,
  dot = false,
  className = '',
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wide ${BADGE_TONES[tone]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

/* ─────────────────────────── Empty state ────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-300 mb-4">
          <Icon size={28} />
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-primary-900">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ─────────────────────────── Table primitives ───────────────────── */

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-neutral-100 bg-neutral-50/60">{children}</tr>
    </thead>
  );
}

export function TH({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-5 py-3 whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
}

export function TR({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-neutral-50 last:border-0 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-neutral-50/70' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
}

export function TD({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-3.5 align-middle ${className}`}>{children}</td>;
}

/* ─────────────────────────── Search input ───────────────────────── */

export function AdminSearch({
  value,
  onChange,
  placeholder = 'Search…',
  icon: Icon,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {Icon && (
        <Icon
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 ${Icon ? 'pl-10' : 'pl-4'} pr-4 rounded-2xl bg-white border border-neutral-200 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-50 outline-none transition-all`}
      />
    </div>
  );
}
