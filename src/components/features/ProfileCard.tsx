"use client";

import React, { useMemo } from 'react';
import { MapPin, Star, ShieldCheck, Eye } from 'lucide-react';
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

// Neutral color palettes using stone-based tones
const colorPalettes = [
    {
        name: 'warm',
        gradient: 'bg-gradient-to-br from-amber-100/50 via-stone-100/30 to-stone-50',
        accent: 'bg-amber-100',
        accentText: 'text-amber-700',
    },
    {
        name: 'cool',
        gradient: 'bg-gradient-to-br from-stone-200/50 via-stone-100/30 to-stone-50',
        accent: 'bg-stone-200',
        accentText: 'text-stone-700',
    },
    {
        name: 'sage',
        gradient: 'bg-gradient-to-br from-emerald-100/40 via-stone-100/30 to-stone-50',
        accent: 'bg-emerald-100',
        accentText: 'text-emerald-700',
    },
    {
        name: 'blush',
        gradient: 'bg-gradient-to-br from-rose-100/40 via-stone-100/30 to-stone-50',
        accent: 'bg-rose-100',
        accentText: 'text-rose-700',
    },
    {
        name: 'sky',
        gradient: 'bg-gradient-to-br from-sky-100/40 via-stone-100/30 to-stone-50',
        accent: 'bg-sky-100',
        accentText: 'text-sky-700',
    },
    {
        name: 'lavender',
        gradient: 'bg-gradient-to-br from-violet-100/40 via-stone-100/30 to-stone-50',
        accent: 'bg-violet-100',
        accentText: 'text-violet-700',
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
    const colorIndex = useMemo(() => getColorIndex(name), [name]);
    const theme = colorPalettes[colorIndex];

    // Get initials for avatar
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1">
            {/* Top gradient area with avatar */}
            <div className={`relative h-32 ${theme.gradient}`}>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
                <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
                
                {/* Avatar */}
                <div className="absolute -bottom-10 left-6">
                    <div className={`w-20 h-20 rounded-2xl ${theme.accent} flex items-center justify-center border-4 border-white shadow-lg`}>
                        <span className={`text-2xl font-bold ${theme.accentText}`}>{initials}</span>
                    </div>
                </div>

                {/* Verified badge */}
                {isVerified && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span className="text-xs font-medium text-stone-700">Verified</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="pt-12 pb-5 px-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-stone-900">{name}</h3>
                        <p className="text-sm text-stone-500">{experience} experience</p>
                    </div>
                    <div className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-stone-900">{rating}</span>
                        <span className="text-xs text-stone-500">({reviewCount})</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                    {description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-5">
                    <MapPin size={14} className="text-stone-400" />
                    <span>{location}</span>
                    {distance && (
                        <span className="text-stone-400">• {distance.toFixed(1)} km away</span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div>
                        <span className="text-xs text-stone-400 uppercase tracking-wider">Hourly Rate</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-stone-900">₹{hourlyRate}</span>
                            <span className="text-sm text-stone-500">/hr</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={onViewProfile}
                            className="rounded-xl w-10 h-10 border-stone-200 hover:bg-stone-50 text-stone-600"
                        >
                            <Eye size={18} />
                        </Button>
                        <Button
                            onClick={onBook}
                            className="rounded-xl px-5 bg-stone-900 hover:bg-stone-800 text-white"
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

