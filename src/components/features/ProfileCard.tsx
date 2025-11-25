"use client";

import React from 'react';
import Image from 'next/image';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProfileCardProps {
    name: string;
    image: string;
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

export const ProfileCard: React.FC<ProfileCardProps> = ({
    name,
    image,
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
    return (
        <div className="group bg-white rounded-[24px] border border-neutral-100 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className={`relative ${compact ? 'h-40' : 'h-48'} w-full bg-neutral-100`}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {isVerified && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-primary shadow-sm">
                        <ShieldCheck size={14} fill="currentColor" />
                        Verified
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <h3 className={`text-white font-bold ${compact ? 'text-base' : 'text-lg'} truncate`}>{name}</h3>
                    <div className="flex items-center gap-1 text-white/90 text-sm">
                        <MapPin size={14} />
                        {location}
                        {distance !== undefined && (
                            <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                {distance.toFixed(1)} km
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className={`${compact ? 'p-4' : 'p-5'} flex flex-col flex-1`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={16} className="text-yellow-500" fill="currentColor" />
                        <span className="font-bold text-neutral-900">{rating}</span>
                        <span className="text-neutral-500 text-xs">({reviewCount})</span>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                            ₹{hourlyRate}<span className="text-sm text-neutral-500 font-normal">/hr</span>
                        </div>
                    </div>
                </div>

                <p className="text-neutral-600 text-sm line-clamp-2 mb-4 flex-1">
                    {description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
                        {experience} experience
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Button variant="outline" size="sm" onClick={onViewProfile} className="w-full rounded-xl border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900">
                        View Profile
                    </Button>
                    <Button variant="default" size="sm" onClick={onBook} className="w-full rounded-xl bg-primary hover:bg-primary-600 text-neutral-900 shadow-md hover:shadow-lg">
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
};
