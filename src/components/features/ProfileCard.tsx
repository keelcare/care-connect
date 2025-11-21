"use client";

import React from 'react';
import Image from 'next/image';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './ProfileCard.module.css';

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
    onViewProfile?: () => void;
    onMessage?: () => void;
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
    onViewProfile,
    onMessage,
}) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {isVerified && (
                    <div className={styles.badge}>
                        <ShieldCheck size={14} fill="currentColor" />
                        Verified
                    </div>
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h3 className={styles.name}>{name}</h3>
                        <div className={styles.location}>
                            <MapPin size={14} />
                            {location}
                        </div>
                    </div>
                    <div className={styles.rating}>
                        <Star size={16} fill="currentColor" />
                        <span>{rating}</span>
                        <span style={{ color: 'var(--color-gray-500)' }}>({reviewCount})</span>
                    </div>
                </div>

                <p className={styles.description}>{description}</p>

                <div className={styles.meta}>
                    <div className={styles.rate}>
                        ₹{hourlyRate}<span>/hr</span>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
                        {experience} exp
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button variant="secondary" size="sm" onClick={onViewProfile} style={{ flex: 1 }}>
                        View Profile
                    </Button>
                    <Button variant="primary" size="sm" onClick={onMessage} style={{ flex: 1 }}>
                        Message
                    </Button>
                </div>
            </div>
        </div>
    );
};
