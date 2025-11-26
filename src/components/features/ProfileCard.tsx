"use client";

import React, { useMemo } from 'react';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
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

// Deep Glassmorphic Palette
const colorPalettes = [
    {
        name: 'blue',
        gradient: 'bg-gradient-to-br from-blue-400/30 via-blue-200/20 to-blue-50/10',
        glassBorder: 'border-white/50',
        text: 'text-slate-800',
        subtext: 'text-slate-600',
        accent: 'text-blue-600',
        button: 'bg-slate-900',
        buttonHover: 'hover:bg-slate-800',
        badge: 'bg-blue-100 text-blue-700',
    },
    {
        name: 'purple',
        gradient: 'bg-gradient-to-br from-purple-400/30 via-purple-200/20 to-purple-50/10',
        glassBorder: 'border-white/50',
        text: 'text-slate-800',
        subtext: 'text-slate-600',
        accent: 'text-purple-600',
        button: 'bg-slate-900',
        buttonHover: 'hover:bg-slate-800',
        badge: 'bg-purple-100 text-purple-700',
    },
    {
        name: 'pink',
        gradient: 'bg-gradient-to-br from-pink-400/30 via-pink-200/20 to-pink-50/10',
        glassBorder: 'border-white/50',
        text: 'text-slate-800',
        subtext: 'text-slate-600',
        accent: 'text-pink-600',
        button: 'bg-slate-900',
        buttonHover: 'hover:bg-slate-800',
        badge: 'bg-pink-100 text-pink-700',
    },
    {
        name: 'green',
        gradient: 'bg-gradient-to-br from-emerald-400/30 via-emerald-200/20 to-emerald-50/10',
        glassBorder: 'border-white/50',
        text: 'text-slate-800',
        subtext: 'text-slate-600',
        accent: 'text-emerald-600',
        button: 'bg-slate-900',
        buttonHover: 'hover:bg-slate-800',
        badge: 'bg-emerald-100 text-emerald-700',
    },
    {
        name: 'orange',
        gradient: 'bg-gradient-to-br from-orange-400/30 via-orange-200/20 to-orange-50/10',
        glassBorder: 'border-white/50',
        text: 'text-slate-800',
        subtext: 'text-slate-600',
        accent: 'text-orange-600',
        button: 'bg-slate-900',
        buttonHover: 'hover:bg-slate-800',
        badge: 'bg-orange-100 text-orange-700',
    },
    {
        name: 'teal',
        gradient: 'bg-gradient-to-br from-teal-400/30 via-teal-200/20 to-teal-50/10',
        glassBorder: 'border-white/50',
        text: 'text-slate-800',
        subtext: 'text-slate-600',
        accent: 'text-teal-600',
        button: 'bg-slate-900',
        buttonHover: 'hover:bg-slate-800',
        badge: 'bg-teal-100 text-teal-700',
    },
];

// Simple hash function to get consistent color for same name
const getColorIndex = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % colorPalettes.length;
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
    // Get consistent random color based on name
    const colorIndex = useMemo(() => getColorIndex(name), [name]);
    const theme = colorPalettes[colorIndex];

    return (
        <div className="group relative w-full h-full min-h-[420px] rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 bg-white">
            {/* Full Height Background Gradient (Simulating Image Area) */}
            <div className={`absolute inset-0 ${theme.gradient} transition-transform duration-700 group-hover:scale-105`} />

            {/* Decorative Blobs for extra depth */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/40 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute top-1/3 -left-10 w-40 h-40 bg-white/30 rounded-full blur-2xl opacity-50 pointer-events-none" />

            {/* Main Content Glass Pane */}
            <div className="absolute bottom-2 left-2 right-2 top-[35%] rounded-[24px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg flex flex-col p-5 transition-all duration-300 group-hover:bg-white/50">

                {/* Header: Name & Verification */}
                <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col">
                        <h3 className={`text-2xl font-bold ${theme.text} tracking-tight flex items-center gap-2`}>
                            {name}
                            {isVerified && (
                                <ShieldCheck size={18} className="text-green-500 fill-green-500/20" />
                            )}
                        </h3>
                        <p className={`text-sm ${theme.subtext} font-medium`}>Professional Caregiver</p>
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 bg-white/60 px-2.5 py-1 rounded-full shadow-sm border border-white/50">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-slate-800">{rating}</span>
                    </div>
                </div>

                {/* Description */}
                <p className={`text-sm ${theme.subtext} line-clamp-2 mt-3 mb-4 leading-relaxed`}>
                    {description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="p-1.5 bg-white/60 rounded-full">
                            <MapPin size={14} className={theme.accent} />
                        </div>
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="p-1.5 bg-white/60 rounded-full">
                            <span className={`text-xs font-bold ${theme.accent}`}>Exp</span>
                        </div>
                        <span>{experience}</span>
                    </div>
                </div>

                {/* Footer: Price & Actions */}
                <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-white/30">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rate</span>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-xl font-bold ${theme.text}`}>₹{hourlyRate}</span>
                            <span className="text-xs text-slate-500">/hr</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onViewProfile}
                            className="rounded-full w-10 h-10 bg-white/50 hover:bg-white/80 text-slate-700 border border-white/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        </Button>
                        <Button
                            onClick={onBook}
                            className={`rounded-full px-6 ${theme.button} ${theme.buttonHover} text-white shadow-lg shadow-slate-200/50 border-none`}
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

