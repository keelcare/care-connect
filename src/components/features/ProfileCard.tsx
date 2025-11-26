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

// Light, bright color palette with transparency
const lightBrightColors = [
    'bg-blue-100/60',
    'bg-purple-100/60',
    'bg-pink-100/60',
    'bg-green-100/60',
    'bg-yellow-100/60',
    'bg-orange-100/60',
    'bg-teal-100/60',
    'bg-cyan-100/60',
    'bg-indigo-100/60',
    'bg-rose-100/60',
    'bg-lime-100/60',
    'bg-emerald-100/60',
];

// Corresponding darker shades for header
const headerColors = [
    'bg-blue-200/80',
    'bg-purple-200/80',
    'bg-pink-200/80',
    'bg-green-200/80',
    'bg-yellow-200/80',
    'bg-orange-200/80',
    'bg-teal-200/80',
    'bg-cyan-200/80',
    'bg-indigo-200/80',
    'bg-rose-200/80',
    'bg-lime-200/80',
    'bg-emerald-200/80',
];

// Text colors for better contrast on light backgrounds
const textColors = [
    'text-blue-900',
    'text-purple-900',
    'text-pink-900',
    'text-green-900',
    'text-yellow-900',
    'text-orange-900',
    'text-teal-900',
    'text-cyan-900',
    'text-indigo-900',
    'text-rose-900',
    'text-lime-900',
    'text-emerald-900',
];

// Simple hash function to get consistent color for same name
const getColorIndex = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % lightBrightColors.length;
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
    const headerBgColor = headerColors[colorIndex];
    const contentBgColor = lightBrightColors[colorIndex];
    const textColor = textColors[colorIndex];

    return (
        <div className="group bg-white rounded-[24px] shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full border border-neutral-100">
            {/* Colored Header Section - No Image */}
            <div className={`relative ${compact ? 'p-5' : 'p-6'} ${headerBgColor} backdrop-blur-sm`}>
                {/* Verified Badge */}
                {isVerified && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-primary shadow-sm">
                        <ShieldCheck size={14} fill="currentColor" />
                        Verified
                    </div>
                )}

                {/* Name */}
                <h3 className={`${textColor} font-bold ${compact ? 'text-lg' : 'text-xl'} mb-2 pr-16`}>
                    {name}
                </h3>

                {/* Location */}
                <div className={`flex items-center gap-1 ${textColor} opacity-80 text-sm mb-3`}>
                    <MapPin size={14} />
                    <span className="truncate">{location}</span>
                    {distance !== undefined && (
                        <span className="ml-1 text-xs bg-white/40 px-2 py-0.5 rounded-full">
                            {distance.toFixed(1)} km
                        </span>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-flex">
                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                    <span className={`font-bold ${textColor}`}>{rating}</span>
                    <span className={`text-xs ${textColor} opacity-70`}>({reviewCount} reviews)</span>
                </div>
            </div>

            {/* White Content Section */}
            <div className={`${compact ? 'p-4' : 'p-5'} flex flex-col flex-1 bg-white`}>
                {/* Hourly Rate */}
                <div className="mb-3">
                    <div className="text-2xl font-bold text-neutral-900">
                        ₹{hourlyRate}<span className="text-sm text-neutral-500 font-normal">/hr</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-neutral-600 text-sm line-clamp-2 mb-4 flex-1">
                    {description}
                </p>

                {/* Experience Badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${contentBgColor} ${textColor}`}>
                        {experience} experience
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onViewProfile}
                        className="w-full rounded-xl border-neutral-200 hover:bg-neutral-50 text-neutral-900"
                    >
                        View Profile
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={onBook}
                        className="w-full rounded-xl bg-primary hover:bg-primary-600 text-neutral-900 border border-neutral-200 shadow-md hover:shadow-lg"
                    >
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
};
