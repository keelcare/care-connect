"use client";

import React, { useMemo } from 'react';
import { MapPin, Star, ShieldCheck, Eye, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
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
}

// iOS 26-inspired color themes with vibrant yet sophisticated palettes
const colorThemes = [
    {
        name: 'aurora',
        bg: 'from-violet-500/20 via-fuchsia-500/15 to-pink-500/20',
        glow: 'bg-violet-500/30',
        accent: 'from-violet-500 to-fuchsia-500',
        avatarBg: 'bg-gradient-to-br from-violet-100 to-fuchsia-100',
        avatarText: 'text-violet-600',
        pill: 'bg-violet-500/10 text-violet-700',
    },
    {
        name: 'ocean',
        bg: 'from-cyan-500/20 via-blue-500/15 to-indigo-500/20',
        glow: 'bg-cyan-500/30',
        accent: 'from-cyan-500 to-blue-500',
        avatarBg: 'bg-gradient-to-br from-cyan-100 to-blue-100',
        avatarText: 'text-cyan-600',
        pill: 'bg-cyan-500/10 text-cyan-700',
    },
    {
        name: 'sunset',
        bg: 'from-orange-500/20 via-rose-500/15 to-pink-500/20',
        glow: 'bg-orange-500/30',
        accent: 'from-orange-500 to-rose-500',
        avatarBg: 'bg-gradient-to-br from-orange-100 to-rose-100',
        avatarText: 'text-orange-600',
        pill: 'bg-orange-500/10 text-orange-700',
    },
    {
        name: 'forest',
        bg: 'from-emerald-500/20 via-teal-500/15 to-cyan-500/20',
        glow: 'bg-emerald-500/30',
        accent: 'from-emerald-500 to-teal-500',
        avatarBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
        avatarText: 'text-emerald-600',
        pill: 'bg-emerald-500/10 text-emerald-700',
    },
    {
        name: 'midnight',
        bg: 'from-slate-500/20 via-zinc-500/15 to-stone-500/20',
        glow: 'bg-slate-500/30',
        accent: 'from-slate-600 to-zinc-600',
        avatarBg: 'bg-gradient-to-br from-slate-100 to-zinc-100',
        avatarText: 'text-slate-600',
        pill: 'bg-slate-500/10 text-slate-700',
    },
    {
        name: 'blossom',
        bg: 'from-pink-500/20 via-rose-500/15 to-red-500/20',
        glow: 'bg-pink-500/30',
        accent: 'from-pink-500 to-rose-500',
        avatarBg: 'bg-gradient-to-br from-pink-100 to-rose-100',
        avatarText: 'text-pink-600',
        pill: 'bg-pink-500/10 text-pink-700',
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
}) => {
    const themeIndex = useMemo(() => getThemeIndex(name), [name]);
    const theme = colorThemes[themeIndex];
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="group relative">
            {/* Ambient glow effect */}
            <div className={`absolute -inset-1 ${theme.glow} rounded-[28px] blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
            
            {/* Main card with glassmorphism */}
            <div className="relative overflow-hidden rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
                
                {/* Gradient mesh background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-60`} />
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
                
                {/* Content layer */}
                <div className="relative z-10">
                    {/* Header section */}
                    <div className="p-5 pb-4">
                        <div className="flex items-start gap-4">
                            {/* Avatar with glass effect */}
                            <div className="relative">
                                <div className={`w-16 h-16 rounded-2xl ${theme.avatarBg} flex items-center justify-center shadow-lg ring-2 ring-white/60`}>
                                    <span className={`text-xl font-bold ${theme.avatarText}`}>{initials}</span>
                                </div>
                                {isVerified && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center ring-2 ring-white">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                    </div>
                                )}
                            </div>

                            {/* Name and meta */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-stone-900 truncate">{name}</h3>
                                </div>
                                
                                {/* Rating pill */}
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                                        <Star size={12} className="text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-semibold text-stone-800">{rating}</span>
                                        <span className="text-xs text-stone-500">({reviewCount})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-stone-500">
                                        <Clock size={11} />
                                        <span>{experience}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price badge - floating glass style */}
                            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg border border-white/60">
                                <div className="text-xs text-stone-500 font-medium">per hour</div>
                                <div className="text-lg font-bold text-stone-900">₹{hourlyRate}</div>
                            </div>
                        </div>
                    </div>

                    {/* Divider with gradient */}
                    <div className="mx-5 h-px bg-gradient-to-r from-transparent via-stone-200/60 to-transparent" />

                    {/* Description section */}
                    <div className="p-5 pt-4">
                        <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4">
                            {description}
                        </p>

                        {/* Location with frosted pill */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className="inline-flex items-center gap-1.5 bg-stone-100/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                <MapPin size={12} className="text-stone-500" />
                                <span className="text-xs font-medium text-stone-600">{location}</span>
                            </div>
                            {distance && (
                                <div className="inline-flex items-center gap-1 text-xs text-stone-500">
                                    <Sparkles size={11} className="text-stone-400" />
                                    <span>{distance.toFixed(1)} km</span>
                                </div>
                            )}
                        </div>

                        {/* Action buttons - iOS style */}
                        <div className="flex gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={onViewProfile}
                                className="rounded-xl w-11 h-11 bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm text-stone-600 hover:text-stone-900 transition-all"
                            >
                                <Eye size={18} />
                            </Button>
                            <Button
                                onClick={onBook}
                                className={`flex-1 h-11 rounded-xl bg-gradient-to-r ${theme.accent} hover:opacity-90 text-white font-semibold shadow-lg shadow-stone-900/10 transition-all group/btn`}
                            >
                                <span>Book Now</span>
                                <ArrowUpRight size={16} className="ml-1.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

