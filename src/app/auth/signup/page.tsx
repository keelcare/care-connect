"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { api } from '@/lib/api';
import styles from './page.module.css';
import layoutStyles from '../layout.module.css';

type Role = 'family' | 'caregiver';

export default function SignupPage() {
    const [role, setRole] = useState<Role>('family');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.auth.signup({
                ...formData,
                role, // Include role in signup
            });
            // Auto login or redirect to login
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Signup failed:', error);
            alert('Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={layoutStyles.header}>
                <h1 className={layoutStyles.title}>Create Account</h1>
                <p className={layoutStyles.subtitle}>Join our community of care</p>
            </div>

            <div className={styles.roleSelection}>
                <div
                    className={`${styles.roleCard} ${role === 'family' ? styles.selected : ''}`}
                    onClick={() => setRole('family')}
                >
                    <User size={32} className={styles.roleIcon} />
                    <span className={styles.roleTitle}>I need care</span>
                    <span className={styles.roleDescription}>Find trusted caregivers for your family</span>
                </div>
                <div
                    className={`${styles.roleCard} ${role === 'caregiver' ? styles.selected : ''}`}
                    onClick={() => setRole('caregiver')}
                >
                    <Heart size={32} className={styles.roleIcon} />
                    <span className={styles.roleTitle}>I want to care</span>
                    <span className={styles.roleDescription}>Find jobs and connect with families</span>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <Input
                        label="First Name"
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                    />
                    <Input
                        label="Last Name"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                    />
                </div>

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={<Mail size={18} />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    leftIcon={<Lock size={18} />}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <div className={styles.terms}>
                    <Checkbox
                        label={
                            <span>
                                I agree to the <Link href="/terms" className={styles.link}>Terms of Service</Link> and <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                            </span>
                        }
                        checked={formData.agreeToTerms}
                        onChange={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
                    />
                </div>

                <Button type="submit" size="lg" isLoading={isLoading} disabled={!formData.agreeToTerms} style={{ width: '100%' }}>
                    Create Account <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </Button>
            </form>

            <div className={styles.footer}>
                Already have an account?{' '}
                <Link href="/auth/login" className={styles.link}>
                    Sign in
                </Link>
            </div>
        </>
    );
}
