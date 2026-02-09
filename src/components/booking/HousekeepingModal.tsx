'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Home, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HousekeepingModalProps {
    onClose: () => void;
}

const DURATION_OPTIONS = [
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
];

const TIME_SLOTS = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

const SERVICE_TYPES = [
    'General Cleaning',
    'Deep Cleaning',
    'Laundry',
    'Organizing',
    'Kitchen Cleaning',
    'Bathroom Cleaning',
];

export default function HousekeepingModal({ onClose }: HousekeepingModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        duration: '',
        serviceTypes: [] as string[],
        specialInstructions: '',
    });

    const getNextDays = () => {
        const days = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const availableDates = getNextDays();

    useEffect(() => {
        if (user?.profiles) {
            if (!user.profiles.lat || !user.profiles.lng) {
                setMissingLocation(true);
            }
        }
    }, [user]);

    const toggleServiceType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            serviceTypes: prev.serviceTypes.includes(type)
                ? prev.serviceTypes.filter(t => t !== type)
                : [...prev.serviceTypes, type]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({ message: 'Please set your location in your profile first', type: 'error' });
            return;
        }

        if (!formData.date || !formData.startTime || !formData.duration || formData.serviceTypes.length === 0) {
            addToast({ message: 'Please fill in all required fields and select at least one service type', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const requirements = `Services: ${formData.serviceTypes.join(', ')}. ${formData.specialInstructions}`;

            const payload = {
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: 1,
                children_ages: [],
                required_skills: ['housekeeping', 'cleaning'],
                special_requirements: requirements,
            };

            await api.requests.create(payload);
            addToast({ message: 'Housekeeping request submitted! Finding the best match for you...', type: 'success' });
            router.push('/bookings');
            onClose();
        } catch (error) {
            addToast({ message: 'Failed to create service request. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[40px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                <div className="sticky top-0 bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white p-8 rounded-t-[40px] z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2">Housekeeping Booking</h2>
                            <p className="text-gray-300 font-body">Professional home cleaning services</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {missingLocation && (
                    <div className="mx-8 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-800">Location Required</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Please set your location in your <Link href="/dashboard/profile" className="underline font-medium text-amber-900">profile settings</Link>.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Home className="w-5 h-5 text-[#0F172A]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Service Types</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {SERVICE_TYPES.map((type) => {
                                const isSelected = formData.serviceTypes.includes(type);
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleServiceType(type)}
                                        className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${isSelected ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white border-gray-200 hover:border-[#0F172A] hover:bg-[#F1F5F9]'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[#0F172A]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Select Date</h3>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {availableDates.map((date) => {
                                const dateStr = formatDate(date);
                                const isSelected = formData.date === dateStr;
                                return (
                                    <button
                                        key={dateStr}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, date: dateStr })}
                                        className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[80px] ${isSelected ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white border-gray-200 hover:border-[#0F172A] hover:bg-[#F1F5F9]'
                                            }`}
                                    >
                                        <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className={`text-2xl font-bold ${isToday(date) && !isSelected ? 'text-[#0F172A]' : ''}`}>{date.getDate()}</span>
                                        <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#0F172A]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Start Time</h3>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {TIME_SLOTS.map((time) => {
                                const isSelected = formData.startTime === time;
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, startTime: time })}
                                        className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${isSelected ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white border-gray-200 hover:border-[#0F172A] hover:bg-[#F1F5F9]'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#0F172A]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Duration</h3>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {DURATION_OPTIONS.map((option) => {
                                const isSelected = formData.duration === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, duration: option.value })}
                                        className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${isSelected ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white border-gray-200 hover:border-[#0F172A] hover:bg-[#F1F5F9]'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-[#0F172A]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Special Instructions (Optional)</h3>
                        </div>
                        <textarea
                            value={formData.specialInstructions}
                            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                            placeholder="Areas to focus on, cleaning products preferences, access instructions..."
                            className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20 focus:outline-none resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || missingLocation}
                        className="w-full bg-[#0F172A] hover:bg-[#1e293b] text-white py-5 rounded-full font-bold text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Finding Housekeepers...' : 'Find My Housekeeper'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
