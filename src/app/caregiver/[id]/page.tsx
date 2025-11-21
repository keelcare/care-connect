"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { MapPin, Star, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import styles from './page.module.css';

// Mock data for demo
const MOCK_USERS = {
    '1': {
        id: '1',
        email: 'sarah@example.com',
        role: 'nanny',
        is_verified: true,
        profiles: {
            first_name: 'Sarah',
            last_name: 'Jenkins',
            address: 'Brooklyn, NY',
            profile_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        },
        nanny_details: {
            hourly_rate: '25.00',
            experience_years: 5,
            bio: 'Experienced nanny with a passion for child development. I have worked with children of all ages and love creating fun, educational activities.',
            skills: ['CPR Certified', 'First Aid', 'Early Childhood Education'],
            availability_schedule: { monday: ['9:00-17:00'], tuesday: ['9:00-17:00'] }
        }
    },
    '2': {
        id: '2',
        email: 'michael@example.com',
        role: 'nanny',
        is_verified: false,
        profiles: {
            first_name: 'Michael',
            last_name: 'Chen',
            address: 'Queens, NY',
            profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
        },
        nanny_details: {
            hourly_rate: '20.00',
            experience_years: 3,
            bio: 'Energetic and responsible caregiver. I specialize in active play and can help with homework and tutoring.',
            skills: ['Math Tutoring', 'Sports', 'Homework Help'],
            availability_schedule: { wednesday: ['14:00-18:00'], thursday: ['14:00-18:00'] }
        }
    },
    '3': {
        id: '3',
        email: 'emily@example.com',
        role: 'nanny',
        is_verified: true,
        profiles: {
            first_name: 'Emily',
            last_name: 'Davis',
            address: 'Manhattan, NY',
            profile_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
        },
        nanny_details: {
            hourly_rate: '35.00',
            experience_years: 8,
            bio: 'Professional nanny with extensive experience in newborn care. I am patient, reliable, and dedicated to providing the best care for your little ones.',
            skills: ['Newborn Care', 'Sleep Training', 'Organic Cooking'],
            availability_schedule: { friday: ['8:00-16:00'] }
        }
    }
};

export default function CaregiverProfilePage() {
    const params = useParams();
    const [caregiver, setCaregiver] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCaregiver = async () => {
            if (!params.id) return;

            try {
                setLoading(true);
                // Cast params.id to string as useParams can return string | string[]
                const id = Array.isArray(params.id) ? params.id[0] : params.id;

                // Mock data check for demo IDs
                if (['1', '2', '3'].includes(id)) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const mockUser = MOCK_USERS[id as keyof typeof MOCK_USERS];
                    setCaregiver(mockUser as unknown as User);
                    setLoading(false);
                    return;
                }

                const data = await api.users.get(id);
                setCaregiver(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load caregiver profile');
            } finally {
                setLoading(false);
            }
        };

        fetchCaregiver();
    }, [params.id]);



    if (loading) return <div className={styles.loading}>Loading profile...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!caregiver) return <div className={styles.error}>Caregiver not found</div>;

    const { profiles, nanny_details } = caregiver;

    return (
        <div className={styles.container}>
            <div className={styles.profileHeader}>
                <div className={styles.imageContainer}>
                    <Image
                        src={profiles?.profile_image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
                        alt={`${profiles?.first_name} ${profiles?.last_name}`}
                        fill
                        className={styles.profileImage}
                    />
                </div>

                <div className={styles.headerContent}>
                    <div className={styles.nameRow}>
                        <div>
                            <h1 className={styles.name}>{profiles?.first_name} {profiles?.last_name}</h1>
                            <div className={styles.badges}>
                                <span className={`${styles.badge} ${styles.roleBadge}`}>Caregiver</span>
                                {caregiver.is_verified && (
                                    <span className={`${styles.badge} ${styles.verifiedBadge}`}>
                                        <ShieldCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={styles.rate}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary-600)' }}>
                                ₹{nanny_details?.hourly_rate || 20}
                            </span>
                            <span style={{ color: 'var(--color-neutral-500)' }}>/hr</span>
                        </div>
                    </div>

                    <div className={styles.statsRow}>
                        <div className={styles.statItem}>
                            <MapPin size={18} />
                            <span>{profiles?.address || 'Location hidden'}</span>
                        </div>
                        <div className={styles.statItem}>
                            <Star size={18} fill="currentColor" color="var(--color-semantic-warning)" />
                            <span>4.9 (12 reviews)</span>
                        </div>
                        <div className={styles.statItem}>
                            <Clock size={18} />
                            <span>{nanny_details?.experience_years || 0} Years Exp.</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button variant="primary" size="lg" style={{ flex: 1 }}>
                            Request Booking
                        </Button>
                        <Button variant="secondary" size="lg" style={{ flex: 1 }}>
                            Message
                        </Button>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>About Me</h2>
                <p className={styles.bio}>
                    {nanny_details?.bio || "No bio provided."}
                </p>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Skills & Certifications</h2>
                <div className={styles.skillsList}>
                    {nanny_details?.skills?.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                            {skill}
                        </span>
                    )) || <span style={{ color: 'var(--color-neutral-500)' }}>No skills listed</span>}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Availability</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {nanny_details?.availability_schedule ? (
                        Object.entries(nanny_details.availability_schedule).map(([day, slots]) => (
                            <div key={day} style={{ padding: '0.5rem', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.25rem' }}>{day}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                                    {Array.isArray(slots) && slots.length > 0 ? slots.join(', ') : 'Unavailable'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--color-neutral-500)' }}>Contact for availability</p>
                    )}
                </div>
            </div>
        </div>
    );
}
