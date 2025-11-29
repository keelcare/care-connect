"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import ParentLayout from '@/components/layout/ParentLayout';
import { BookingInterface } from '@/components/bookings/BookingInterface';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BookServicePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        duration: '',
        numChildren: '',
        childrenAges: '', // Not in new form yet, might need to add back if critical
        maxHourlyRate: '', // Not in new form yet
        requiredSkills: [] as string[], // Not in new form yet
        specialRequirements: '',
        serviceType: ''
    });

    useEffect(() => {
        if (user?.profiles) {
            if (!user.profiles.lat || !user.profiles.lng) {
                setMissingLocation(true);
            } else {
                setMissingLocation(false);
            }
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({ message: 'Please set your location in your profile first', type: 'error' });
            return;
        }

        if (!formData.serviceType) {
            addToast({ message: 'Please select a service type', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: Number(formData.numChildren),
                children_ages: [], // Simplified for now
                max_hourly_rate: undefined,
                required_skills: [],
                special_requirements: formData.specialRequirements,
            };

            await api.requests.create(payload);

            addToast({ message: 'Service request submitted! We are finding the best match for you...', type: 'success' });
            router.push('/dashboard/requests');

        } catch (error) {
            console.error("Service request failed:", error);
            addToast({ message: 'Failed to create service request. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ParentLayout>
            {missingLocation && (
                <div className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-yellow-800">Location Required</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Please set your location in your{' '}
                                <Link href="/dashboard/profile" className="underline font-medium">
                                    profile settings
                                </Link>
                                {' '}to use auto-matching.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <BookingInterface
                nanny={null}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                loading={loading}
                title="Book a Service"
            />
        </ParentLayout>
    );
}
