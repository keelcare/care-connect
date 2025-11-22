"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { CreateServiceRequestDto } from '@/types/api';
import styles from './page.module.css';

export default function CreateRequestPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateServiceRequestDto>({
        date: '',
        start_time: '',
        duration_hours: 4,
        num_children: 1,
        children_ages: [0],
        special_requirements: '',
        address: ''
    });

    useEffect(() => {
        if (user?.profiles?.address) {
            setFormData(prev => ({ ...prev, address: user.profiles!.address! }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'num_children') {
            const num = parseInt(value);
            setFormData(prev => ({
                ...prev,
                num_children: num,
                children_ages: Array(num).fill(0).map((_, i) => prev.children_ages[i] || 0)
            }));
        } else if (name === 'duration_hours') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAgeChange = (index: number, value: string) => {
        const newAges = [...formData.children_ages];
        newAges[index] = parseInt(value);
        setFormData(prev => ({ ...prev, children_ages: newAges }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            await api.requests.create(formData);
            router.push('/dashboard/requests');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
                <ChevronLeft size={20} className="mr-1" /> Back to Requests
            </Button>

            <div className="bg-white rounded-[32px] shadow-soft border border-neutral-100 overflow-hidden">
                <div className="p-8 md:p-10 border-b border-neutral-100 bg-neutral-50/50">
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">Create Service Request</h1>
                    <p className="text-neutral-500 mt-2 text-lg">Tell us what you need and we'll match you with the best nanny.</p>
                </div>

                {error && (
                    <div className="mx-8 mt-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 text-red-600">
                        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
                    {/* Date & Time Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                                <Calendar size={18} />
                            </div>
                            Date & Time
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="rounded-xl"
                            />
                            <Input
                                label="Start Time"
                                name="start_time"
                                type="time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                                className="rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Duration (Hours)</label>
                            <select
                                name="duration_hours"
                                value={formData.duration_hours}
                                onChange={handleChange}
                                className="w-full rounded-xl border-neutral-200 focus:border-primary focus:ring-primary"
                            >
                                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map(h => (
                                    <option key={h} value={h}>{h} hours</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className="border-neutral-100" />

                    {/* Children Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center text-secondary">
                                <Users size={18} />
                            </div>
                            Children
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Number of Children</label>
                            <select
                                name="num_children"
                                value={formData.num_children}
                                onChange={handleChange}
                                className="w-full rounded-xl border-neutral-200 focus:border-primary focus:ring-primary"
                            >
                                {[1, 2, 3, 4, 5].map(n => (
                                    <option key={n} value={n}>{n} Child{n > 1 ? 'ren' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {formData.children_ages.map((age, index) => (
                                <Input
                                    key={index}
                                    label={`Child ${index + 1} Age`}
                                    type="number"
                                    min="0"
                                    max="17"
                                    value={age.toString()}
                                    onChange={(e) => handleAgeChange(index, e.target.value)}
                                    required
                                    className="rounded-xl"
                                />
                            ))}
                        </div>
                    </div>

                    <hr className="border-neutral-100" />

                    {/* Location Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-accent">
                                <MapPin size={18} />
                            </div>
                            Location & Details
                        </h2>
                        <Input
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter full address"
                            required
                            className="rounded-xl"
                        />
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Special Requirements / Notes</label>
                            <textarea
                                name="special_requirements"
                                value={formData.special_requirements}
                                onChange={handleChange}
                                className="w-full rounded-xl border-neutral-200 focus:border-primary focus:ring-primary min-h-[120px] p-3"
                                placeholder="Any allergies, pets, or specific instructions..."
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-100">
                        <Button type="button" variant="ghost" onClick={() => router.back()} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-xl px-8 shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Request'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
