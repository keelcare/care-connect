"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { Button } from '@/components/ui/Button';
import styles from './FeaturedCaregivers.module.css';

export const FeaturedCaregivers: React.FC = () => {
    const caregivers = [
        {
            name: "Sarah Johnson",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            rating: 4.9,
            reviewCount: 124,
            location: "Brooklyn, NY",
            description: "Experienced nanny with 5+ years of experience. Certified in CPR and First Aid. I love organizing creative activities for kids.",
            hourlyRate: 25,
            experience: "5 years",
            isVerified: true,
        },
        {
            name: "Michael Chen",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            rating: 4.8,
            reviewCount: 89,
            location: "San Francisco, CA",
            description: "Compassionate senior caregiver specializing in dementia care. Patient, reliable, and dedicated to improving quality of life.",
            hourlyRate: 30,
            experience: "8 years",
            isVerified: true,
        },
        {
            name: "Emily Davis",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            rating: 5.0,
            reviewCount: 56,
            location: "Austin, TX",
            description: "University student and pet lover. I have experience with dogs of all sizes and cats. Available for walks and sitting.",
            hourlyRate: 18,
            experience: "3 years",
            isVerified: true,
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Top Rated Caregivers</h2>
                        <p className={styles.subtitle}>
                            Meet some of our most trusted and highly-rated caregivers in your area.
                        </p>
                    </div>
                    <Link href="/search" className="hidden lg:block">
                        <Button variant="text">
                            View All <ArrowRight size={16} style={{ marginLeft: 8 }} />
                        </Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {caregivers.map((caregiver, index) => (
                        <ProfileCard
                            key={index}
                            {...caregiver}
                            onViewProfile={() => console.log(`View profile: ${caregiver.name}`)}
                            onMessage={() => console.log(`Message: ${caregiver.name}`)}
                        />
                    ))}
                </div>

                <div className={styles.viewAll}>
                    <Link href="/search" className="lg:hidden">
                        <Button variant="secondary" style={{ width: '100%' }}>
                            View All Caregivers
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
