"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UpdateUserDto } from '@/types/api';
import styles from './page.module.css';


export default function SettingsPage() {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState<UpdateUserDto>({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        profileImageUrl: '',
        bio: '',
        hourlyRate: 0,
        experienceYears: 0,
        skills: [],
    });

    useEffect(() => {
        if (user) {
            // Initialize form data
            setFormData({
                firstName: user.profiles?.first_name || '',
                lastName: user.profiles?.last_name || '',
                phone: user.profiles?.phone || '',
                address: user.profiles?.address || '',
                profileImageUrl: user.profiles?.profile_image_url || '',
                bio: user.nanny_details?.bio || '',
                hourlyRate: user.nanny_details?.hourly_rate ? Number(user.nanny_details.hourly_rate) : 0,
                experienceYears: user.nanny_details?.experience_years || 0,
                skills: user.nanny_details?.skills || [],
            });
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'hourlyRate' || name === 'experienceYears' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setSaving(true);
            setMessage(null);

            // Filter out empty values or only send changed values ideally
            // For now sending all form data
            await api.users.update(user.id, formData);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Refresh user data to ensure sync
            await refreshUser();
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading settings...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Account Settings</h1>
                <p className={styles.subtitle}>Manage your profile and account preferences</p>
            </div>

            {message && (
                <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                    <div className={styles.formGrid}>
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <div className={styles.fullWidth}>
                            <Input
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                helperText="This will be used to calculate distances for search results."
                            />
                        </div>
                        <div className={styles.fullWidth}>
                            <Input
                                label="Profile Image URL"
                                name="profileImageUrl"
                                value={formData.profileImageUrl || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>
                </div>

                {user?.role === 'nanny' && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Caregiver Profile</h2>
                        <div className={styles.formGrid}>
                            <Input
                                label="Hourly Rate (₹)"
                                name="hourlyRate"
                                type="number"
                                value={formData.hourlyRate?.toString()}
                                onChange={handleChange}
                            />
                            <Input
                                label="Years of Experience"
                                name="experienceYears"
                                type="number"
                                value={formData.experienceYears?.toString()}
                                onChange={handleChange}
                            />
                            <div className={styles.fullWidth}>
                                <Input
                                    label="Skills (comma separated)"
                                    name="skills"
                                    value={formData.skills?.join(', ') || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                                    placeholder="CPR, First Aid, Cooking"
                                />
                            </div>
                            <div className={styles.fullWidth}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Bio</label>
                                <textarea
                                    name="bio"
                                    className="input" // Reusing global input class if available, or inline styles
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-neutral-300)',
                                        minHeight: '120px',
                                        fontFamily: 'inherit'
                                    }}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell parents about yourself..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.actions}>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={saving}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
