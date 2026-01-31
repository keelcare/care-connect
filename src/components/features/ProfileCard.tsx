'use client';

import React, { useMemo } from 'react';
import {
  MapPin,
  Star,
  ShieldCheck,
  UserRound,
  Sparkles,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProfileCardProps {
  name: string;
  image?: string; // Keep for backward compatibility but won't be used
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  hourlyRate: number;
  experience: string;
  isVerified?: boolean;
  distance?: number; // Distance in kilometers
  onViewProfile?: () => void;
  onBook?: () => void;
  compact?: boolean; // Compact mode for smaller cards
  hideBookButton?: boolean;
}

// iOS 26-inspired color themes with vibrant yet sophisticated palettes
const colorThemes = [
  {
    name: 'primary',
    bg: 'from-primary-500/20 via-primary-300/15 to-primary-600/20',
    glow: 'bg-primary-500/30',
    accent: 'from-primary-600 to-primary-400',
    avatarBg: 'bg-gradient-to-br from-primary-100 to-primary-200',
    avatarText: 'text-primary-800',
    pill: 'bg-primary-500/10 text-primary-800',
  },
  {
    name: 'accent',
    bg: 'from-accent-500/20 via-accent-300/15 to-accent-600/20',
    glow: 'bg-accent-500/30',
    accent: 'from-accent-600 to-accent-400',
    avatarBg: 'bg-gradient-to-br from-accent-100 to-accent-200',
    avatarText: 'text-accent-800',
    pill: 'bg-accent-500/10 text-accent-800',
  },
  {
    name: 'sky',
    bg: 'from-sky-500/20 via-blue-300/15 to-sky-600/20',
    glow: 'bg-sky-500/30',
    accent: 'from-sky-600 to-sky-400',
    avatarBg: 'bg-gradient-to-br from-sky-100 to-sky-200',
    avatarText: 'text-sky-800',
    pill: 'bg-sky-500/10 text-sky-800',
  },
  {
    name: 'slate',
    bg: 'from-slate-500/20 via-gray-300/15 to-slate-600/20',
    glow: 'bg-slate-500/30',
    accent: 'from-slate-600 to-slate-400',
    avatarBg: 'bg-gradient-to-br from-slate-100 to-slate-200',
    avatarText: 'text-slate-800',
    pill: 'bg-slate-500/10 text-slate-800',
  },
  {
    name: 'indigo',
    bg: 'from-indigo-500/20 via-violet-300/15 to-indigo-600/20',
    glow: 'bg-indigo-500/30',
    accent: 'from-indigo-600 to-indigo-400',
    avatarBg: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
    avatarText: 'text-indigo-800',
    pill: 'bg-indigo-500/10 text-indigo-800',
  },
  {
    name: 'ocean',
    bg: 'from-cyan-500/20 via-teal-300/15 to-cyan-600/20',
    glow: 'bg-cyan-500/30',
    accent: 'from-cyan-600 to-cyan-400',
    avatarBg: 'bg-gradient-to-br from-cyan-100 to-cyan-200',
    avatarText: 'text-cyan-800',
    pill: 'bg-cyan-500/10 text-cyan-800',
  },
];

const getThemeIndex = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % colorThemes.length;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  rating,
  reviewCount,
  location,
  description,
  hourlyRate,
  experience,
  isVerified,
  distance,
  onViewProfile,
  onBook,
  compact = false,
  hideBookButton = false,
}) => {
  const themeIndex = useMemo(() => getThemeIndex(name), [name]);
  const theme = colorThemes[themeIndex];
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group relative p-1">
      {/* Ambient glow effect */}
      <div
        className={`absolute inset-0 ${theme.glow} rounded-[28px] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
      />

      {/* Main card with glassmorphism */}
      <div className="relative overflow-hidden rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] group-hover:-translate-y-1 h-full flex flex-col">
        {/* Gradient mesh background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-60`}
        />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

        {/* Content layer */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Header section */}
          <div className="p-5 pb-4">
            <div className="flex items-start gap-4">
              {/* Avatar with glass effect */}
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-2xl ${theme.avatarBg} flex items-center justify-center shadow-lg ring-2 ring-white/60`}
                >
                  <UserRound
                    size={32}
                    className={`${theme.avatarText} opacity-80`}
                  />
                </div>
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center ring-2 ring-white">
                    <ShieldCheck size={14} className="text-gold" />
                  </div>
                )}
              </div>

              {/* Name and meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-heading font-semibold text-navy truncate">
                    {name}
                  </h3>
                </div>

                {/* Rating pill */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                    <Star size={12} className={`text-amber-500 ${rating > 0 ? 'fill-amber-500' : ''}`} />
                    <span className="text-sm font-semibold text-navy">
                      {rating > 0 ? rating.toFixed(1) : 'New'}
                    </span>
                    {reviewCount > 0 && (
                      <span className="text-xs text-neutral-600">
                        ({reviewCount})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-600">
                    <Clock size={11} />
                    <span>{experience}</span>
                  </div>
                </div>
              </div>

              {/* Price - Subtle placement */}
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold text-navy">
                  ₹{hourlyRate}
                </div>
                <div className="text-xs text-neutral-600 font-medium">/hr</div>
              </div>
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="mx-5 h-px bg-gradient-to-r from-transparent via-neutral-200/60 to-transparent" />

          {/* Description section */}
          <div className="p-5 pt-4 flex-1 flex flex-col">
            <p className="text-sm text-neutral-700 leading-relaxed line-clamp-2 mb-4">
              {description}
            </p>

            {/* Location with frosted pill */}
            <div className="flex items-center gap-2 mb-5 mt-auto">
              <div className="inline-flex items-center gap-1.5 bg-stone-100/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <MapPin size={12} className="text-neutral-600" />
                <span className="text-xs font-medium text-neutral-700">
                  {location}
                </span>
              </div>
              {distance && (
                <div className="inline-flex items-center gap-1 text-xs text-neutral-600">
                  <Sparkles size={11} className="text-neutral-500" />
                  <span>{distance.toFixed(1)} km</span>
                </div>
              )}
            </div>

            <Button
              onClick={onViewProfile}
              className={`flex-1 h-11 rounded-xl bg-gradient-to-r ${theme.accent} hover:opacity-90 text-white font-semibold shadow-lg shadow-stone-900/10 transition-all group/btn`}
            >
              <span>View Profile</span>
              <ArrowRight
                size={16}
                className="ml-1.5 group-hover/btn:translate-x-0.5 transition-transform"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
