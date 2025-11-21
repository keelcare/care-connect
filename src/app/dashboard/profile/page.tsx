"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShieldCheck, Edit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;
    if (!user) return <div style={{ padding: '2rem' }}>Please log in to view your profile.</div>;

    const { profiles, nanny_details } = user;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Profile</h1>
                <Link href="/dashboard/settings">
                    <Button variant="secondary" size="sm">
                        <Edit size={16} style={{ marginRight: 8 }} /> Edit Profile
                    </Button>
                </Link>
            </div>

            <div className={styles.profileCard}>
                <div className={styles.imageSection}>
                    <div className={styles.imageContainer}>
                        <Image
                            src={profiles?.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                            alt="Profile"
                            fill
                            className={styles.profileImage}
                        />
                    </div>
                    <div className={styles.roleTag}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <h2 className={styles.name}>{profiles?.first_name} {profiles?.last_name}</h2>

                    <div className={styles.metaRow}>
                        <div className={styles.metaItem}>
                            <MapPin size={16} />
                            <span>{profiles?.address || 'No address set'}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <ShieldCheck size={16} color={user.is_verified ? "var(--color-semantic-success)" : "var(--color-neutral-400)"} />
                            <span>{user.is_verified ? 'Verified Account' : 'Unverified'}</span>
                        </div>
                    </div>

                    {user.role === 'nanny' && (
                        <>
                            <div className={styles.statsRow}>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>₹{nanny_details?.hourly_rate || 0}</span>
                                    <span className={styles.statLabel}>/hr</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>{nanny_details?.experience_years || 0}</span>
                                    <span className={styles.statLabel}>Years Exp.</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>4.9</span>
                                    <span className={styles.statLabel}>Rating</span>
                                </div>
                            </div>

                            <div className={styles.bioSection}>
                                <h3>About</h3>
                                <p>{nanny_details?.bio || 'No bio provided yet.'}</p>
                            </div>

                            <div className={styles.skillsSection}>
                                <h3>Skills</h3>
                                <div className={styles.skillsList}>
                                    {nanny_details?.skills?.map((skill, i) => (
                                        <span key={i} className={styles.skillTag}>{skill}</span>
                                    )) || <span style={{ color: 'var(--color-neutral-500)' }}>No skills listed</span>}
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <Link href={`/caregiver/${user.id}`}>
                                    <Button variant="primary" style={{ width: '100%' }}>
                                        View Public Profile
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
