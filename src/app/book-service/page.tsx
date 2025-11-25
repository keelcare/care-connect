"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Calendar, Clock, Users, AlertCircle, Sparkles, Baby, Heart, Home, GraduationCap, DollarSign, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import ParentLayout from '@/components/layout/ParentLayout';

const SERVICE_TYPES = [
    { id: 'child-care', label: 'Child Care', icon: Baby, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'senior-care', label: 'Senior Care', icon: Heart, color: 'bg-teal-100 text-teal-600' },
    { id: 'housekeeping', label: 'Housekeeping', icon: Home, color: 'bg-blue-100 text-blue-600' },
    { id: 'tutoring', label: 'Tutoring', icon: GraduationCap, color: 'bg-purple-100 text-purple-600' },
];

const DURATION_OPTIONS = [
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours (Full day)' },
    { value: '12', label: '12 hours' },
];

const SKILLS_LIST = [
    { id: "cpr", label: "CPR", icon: "❤️" },
    { id: "first-aid", label: "First Aid", icon: "🏥" },
    { id: "special-needs", label: "Special Needs Care", icon: "🤝" },
    { id: "homework", label: "Homework Help", icon: "📚" },
    { id: "pet-care", label: "Pet Care", icon: "🐾" },
    { id: "cooking", label: "Cooking/Meal Prep", icon: "🍳" },
    { id: "driving", label: "Driving", icon: "🚗" },
    { id: "infant", label: "Infant Care", icon: "👶" }
];

export default function BookServicePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);
    const [selectedService, setSelectedService] = useState('');

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
            if (!user.profiles.lat || !user.profiles.lng) {
                setMissingLocation(true);
            } else {
                setMissingLocation(false);
            }
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillToggle = (skillId: string) => {
        setFormData(prev => {
            const skills = prev.requiredSkills.includes(skillId)
                ? prev.requiredSkills.filter(s => s !== skillId)
                : [...prev.requiredSkills, skillId];
            return { ...prev, requiredSkills: skills };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({ message: 'Please set your location in your profile first', type: 'error' });
            return;
        }

        if (!selectedService) {
            addToast({ message: 'Please select a service type', type: 'error' });
            return;
        }

        setLoading(true);

        try {
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
            <div className="min-h-screen bg-neutral-50 pb-12">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/browse">
                            <Button variant="ghost" className="mb-4 -ml-2">
                                <ChevronLeft size={20} className="mr-1" />
                                Back
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center">
                                <Sparkles size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900">Book a Service</h1>
                                <p className="text-neutral-600">We'll find the perfect caregiver for you</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Warning */}
                    {missingLocation && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3">
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Service Type Selection */}
                        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-neutral-900 mb-4">What type of service do you need?</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {SERVICE_TYPES.map((service) => {
                                    const Icon = service.icon;
                                    const isSelected = selectedService === service.id;
                                    return (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={() => setSelectedService(service.id)}
                                            className={`relative p-4 rounded-2xl border-2 transition-all ${isSelected
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            )}
                                            <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-2 mx-auto`}>
                                                <Icon size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-neutral-900 text-center">{service.label}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-primary" />
                                When do you need care?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Date *</label>
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
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Start Time *</label>
                                    <Input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Duration *</label>
                                    <select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                    >
                                        <option value="">Select duration</option>
                                        {DURATION_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Care Details */}
                        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <Users size={20} className="text-primary" />
                                Care Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Number of Children *</label>
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
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Children Ages</label>
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
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                                    <DollarSign size={16} className="text-neutral-500" />
                                    Max Hourly Rate (₹/hr)
                                </label>
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
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
                            <label className="block text-sm font-bold text-neutral-900 mb-4">Required Skills (Optional)</label>
                            <div className="flex flex-wrap gap-2">
                                {SKILLS_LIST.map(skill => {
                                    const isSelected = formData.requiredSkills.includes(skill.id);
                                    return (
                                        <button
                                            key={skill.id}
                                            type="button"
                                            onClick={() => handleSkillToggle(skill.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                }`}
                                        >
                                            <span className="mr-1">{skill.icon}</span>
                                            {skill.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Special Requirements */}
                        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
                            <label className="block text-sm font-bold text-neutral-900 mb-2">Special Requirements</label>
                            <textarea
                                name="specialRequirements"
                                value={formData.specialRequirements}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                rows={4}
                                placeholder="Any allergies, specific instructions, preferences, etc."
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 bg-white rounded-2xl border border-neutral-200 shadow-sm p-4">
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
                                className="flex-1"
                            >
                                {loading ? 'Finding Match...' : 'Find Caregiver'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </ParentLayout>
    );
}
