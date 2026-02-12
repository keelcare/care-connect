'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Users, FileText, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChildCareModalProps {
    onClose: () => void;
}

const DURATION_OPTIONS = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '5', label: '5 hours' },
    { value: '6', label: '6 hours' },
    { value: '7', label: '7 hours' },
    { value: '8', label: '8 hours' },
];

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00',
];

export default function ChildCareModal({ onClose }: ChildCareModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        duration: '',
        numChildren: '1',
        specialRequirements: '',
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
            } else {
                setMissingLocation(false);
            }
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({
                message: 'Please set your location in your profile first',
                type: 'error',
            });
            return;
        }

        if (!formData.date || !formData.startTime || !formData.duration) {
            addToast({
                message: 'Please fill in all required fields',
                type: 'error',
            });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                category: 'CC',
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: Number(formData.numChildren),
                children_ages: [],
                max_hourly_rate: undefined,
                required_skills: [],
                special_requirements: formData.specialRequirements,
            };

            await api.requests.create(payload);

            addToast({
                message: 'Child care request submitted! Finding the best match for you...',
                type: 'success',
            });
            router.push('/bookings');
            onClose();
        } catch (error) {
            console.error('Service request failed:', error);
            addToast({
                message: 'Failed to create service request. Please try again.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };


    // Animation Variants
    const overlayVars = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    const modalVars = {
        hidden: { scale: 0.95, opacity: 0, y: 10 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 300 }
        },
        exit: {
            scale: 0.95,
            opacity: 0,
            y: 10,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            variants={overlayVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                variants={modalVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[32px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#1F6F5B] to-[#1a5f4f] text-white p-8 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2">Child Care Booking</h2>
                            <p className="text-green-100 font-body">Book a verified nanny or babysitter</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Location Warning */}
                {missingLocation && (
                    <div className="mx-8 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-800">Location Required</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Please set your location in your{' '}
                                <Link href="/dashboard/profile" className="underline font-medium text-amber-900">
                                    profile settings
                                </Link>{' '}
                                to use auto-matching.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    {/* Date Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[#1F6F5B]" />
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
                                        className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[80px] ${isSelected
                                            ? 'bg-[#1F6F5B] text-white border-[#1F6F5B]'
                                            : 'bg-white border-gray-200 hover:border-[#1F6F5B] hover:bg-[#E5F1EC]'
                                            }`}
                                    >
                                        <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-green-100' : 'text-gray-500'}`}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className={`text-2xl font-bold ${isToday(date) && !isSelected ? 'text-[#1F6F5B]' : ''}`}>
                                            {date.getDate()}
                                        </span>
                                        <span className={`text-xs ${isSelected ? 'text-green-100' : 'text-gray-400'}`}>
                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#1F6F5B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Start Time</h3>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            {TIME_SLOTS.map((time) => {
                                const isSelected = formData.startTime === time;
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, startTime: time })}
                                        className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${isSelected
                                            ? 'bg-[#1F6F5B] text-white border-[#1F6F5B]'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#1F6F5B] hover:bg-[#E5F1EC]'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#1F6F5B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Duration</h3>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {DURATION_OPTIONS.map((option) => {
                                const isSelected = formData.duration === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, duration: option.value })}
                                        className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${isSelected
                                            ? 'bg-[#1F6F5B] text-white border-[#1F6F5B]'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#1F6F5B] hover:bg-[#E5F1EC]'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Number of Children */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-[#1F6F5B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Number of Children</h3>
                        </div>
                        <div className="flex gap-3">
                            {['1', '2', '3', '4', '5+'].map((num) => {
                                const isSelected = formData.numChildren === num;
                                return (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, numChildren: num })}
                                        className={`w-14 h-14 rounded-xl font-semibold border-2 transition-all ${isSelected
                                            ? 'bg-[#1F6F5B] text-white border-[#1F6F5B]'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#1F6F5B]'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Special Requirements */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-[#1F6F5B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Special Requirements (Optional)</h3>
                        </div>
                        <textarea
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                            placeholder="Any specific needs, allergies, preferences, or instructions..."
                            className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#1F6F5B] focus:ring-2 focus:ring-[#1F6F5B]/20 focus:outline-none resize-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || missingLocation}
                        className="w-full bg-[#1F6F5B] hover:bg-[#1a5f4f] text-white py-5 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Finding Caregivers...' : 'Find My Caregiver'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
