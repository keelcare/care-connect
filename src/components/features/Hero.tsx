"use client";

import React from 'react';
import Link from 'next/link';
import { Search, MapPin, ShieldCheck, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <h1 className={styles.heading}>
                    Find Trusted Care <br />
                    for Your Loved Ones
                </h1>

                <p className={styles.subheading}>
                    Connect with background-checked caregivers for child care, senior care, pet care, and housekeeping. Book trusted care in your neighborhood.
                </p>

                <div className={styles.searchContainer}>
                    <div style={{ flex: 1 }}>
                        <Input
                            placeholder="What care do you need?"
                            leftIcon={<Search size={20} />}
                            className="border-none shadow-none"
                            style={{ border: 'none', boxShadow: 'none', height: '48px' }}
                        />
                    </div>
                    <div style={{ width: '1px', background: 'var(--color-gray-200)', margin: '8px 0' }} className="hidden md:block" />
                    <div style={{ flex: 1 }}>
                        <Input
                            placeholder="Zip code or city"
                            leftIcon={<MapPin size={20} />}
                            className="border-none shadow-none"
                            style={{ border: 'none', boxShadow: 'none', height: '48px' }}
                        />
                    </div>
                    <Button size="lg" style={{ borderRadius: '9999px', paddingLeft: '32px', paddingRight: '32px' }}>
                        Search
                    </Button>
                </div>

                <div className={styles.ctaGroup}>
                    <Link href="/search">
                        <Button variant="secondary" size="lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'white', backdropFilter: 'blur(4px)' }}>
                            Browse Caregivers
                        </Button>
                    </Link>
                    <Link href="/jobs">
                        <Button variant="text" size="lg" style={{ color: 'white' }}>
                            Become a Caregiver
                        </Button>
                    </Link>
                </div>

                <div className={styles.trustIndicators}>
                    <div className={styles.trustItem}>
                        <ShieldCheck size={20} />
                        <span>Background Checked</span>
                    </div>
                    <div className={styles.trustItem}>
                        <Star size={20} />
                        <span>4.8/5 Average Rating</span>
                    </div>
                    <div className={styles.trustItem}>
                        <Users size={20} />
                        <span>10k+ Active Caregivers</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
