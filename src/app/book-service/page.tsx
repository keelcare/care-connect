"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Calendar, Clock, Users, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import ParentLayout from '@/components/layout/ParentLayout';

const SKILLS_LIST = [
    "CPR",
    "First Aid",
    "Special Needs Care",
    "Homework Help",
    "Pet Care",
    "Cooking/Meal Prep",
    "Driving",
    "Infant Care"
];

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
        childrenAges: '',
        maxHourlyRate: '',
        requiredSkills: [] as string[],
        specialRequirements: ''
    });

    useEffect(() => {
        if (user?.profiles) {
            // Check if user has location coordinates set
            if (!user.profiles.lat || !user.profiles.lng) {
                setMissingLocation(true);
            } else {
                setMissingLocation(false);
            }
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillToggle = (skill: string) => {
        setFormData(prev => {
            const skills = prev.requiredSkills.includes(skill)
                ? prev.requiredSkills.filter(s => s !== skill)
                : [...prev.requiredSkills, skill];
            return { ...prev, requiredSkills: skills };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({ message: 'Please set your location in your profile first', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            // Validate required fields
            if (!formData.date || !formData.startTime || !formData.duration || !formData.numChildren) {
                addToast({ message: 'Please fill in all required fields', type: 'error' });
                setLoading(false);
                return;
            }

            const payload = {
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: Number(formData.numChildren),
                children_ages: formData.childrenAges.split(',').map(age => Number(age.trim())).filter(age => !isNaN(age)),
                max_hourly_rate: formData.maxHourlyRate ? Number(formData.maxHourlyRate) : undefined,
                required_skills: formData.requiredSkills,
                special_requirements: formData.specialRequirements,
            };

            await api.requests.create(payload);

            addToast({ message: 'Service request submitted! We are finding the best match for you...', type: 'success' });

            // Redirect to requests page or dashboard
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
            <div className="min-h-screen bg-neutral-50 pb-12 pt-8">
                <div className="max-w-3xl mx-auto px-4 md:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/browse">
                            <Button variant="ghost" className="mb-4 -ml-2">
                                <ChevronLeft size={20} className="mr-1" />
                                Back
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                <Sparkles size={24} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900">Book a Service</h1>
                                <p className="text-neutral-600">We'll find the perfect caregiver for you</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Warning */}
                    {missingLocation && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
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
                    )}

                    {/* Form */}
                    <div className="bg-white rounded-[24px] border border-neutral-100 shadow-soft p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Date & Time */}
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                    <Calendar size={20} className="text-primary" />
                                    When do you need care?
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Date *</label>
                                        <Input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Start Time *</label>
                                        <Input
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Duration & Children */}
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                    <Users size={20} className="text-primary" />
                                    Care Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Duration (Hours) *</label>
                                        <Input
                                            type="number"
                                            name="duration"
                                            min="1"
                                            max="24"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            required
                                            className="w-full"
                                            placeholder="e.g. 4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Number of Children *</label>
                                        <Input
                                            type="number"
                                            name="numChildren"
                                            min="1"
                                            value={formData.numChildren}
                                            onChange={handleChange}
                                            required
                                            className="w-full"
                                            placeholder="e.g. 2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Children Ages (comma separated)</label>
                                    <Input
                                        type="text"
                                        name="childrenAges"
                                        value={formData.childrenAges}
                                        onChange={handleChange}
                                        className="w-full"
                                        placeholder="e.g. 2, 5, 8"
                                    />
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Max Hourly Rate (₹/hr)</label>
                                <Input
                                    type="number"
                                    name="maxHourlyRate"
                                    min="1"
                                    value={formData.maxHourlyRate}
                                    onChange={handleChange}
                                    className="w-full"
                                    placeholder="Optional - leave blank for any rate"
                                />
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-3">Required Skills</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {SKILLS_LIST.map(skill => (
                                        <label key={skill} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                                            <Checkbox
                                                checked={formData.requiredSkills.includes(skill)}
                                                onChange={() => handleSkillToggle(skill)}
                                            />
                                            <span className="text-sm text-neutral-700">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Special Requirements */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Special Requirements</label>
                                <textarea
                                    name="specialRequirements"
                                    value={formData.specialRequirements}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
                                    placeholder="Any allergies, specific instructions, preferences, etc."
                                />
                            </div>

                            {/* Submit */}
                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || missingLocation}
                                    className="flex-1 bg-primary hover:bg-primary-600"
                                >
                                    {loading ? 'Finding Match...' : 'Find Caregiver'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
