'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Users, FileText, AlertCircle, HeartHandshake } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChildSelector } from './ChildSelector';
import { ChildProfileModal } from '@/components/dashboard/ChildProfileModal';
import { Child } from '@/types/api';

interface SpecialNeedsModalProps {
    onClose: () => void;
}

const DURATION_OPTIONS = [
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
    { value: '12', label: '12 hours' },
];

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00',
];

export default function SpecialNeedsModal({ onClose }: SpecialNeedsModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);
    const [hourlyRate, setHourlyRate] = useState<number | null>(null);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);

    // Family Data
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        duration: '',
        numPeople: '1',
        medicalConditions: '',
        mobilityAssistance: false,
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
        const fetchChildren = async () => {
            try {
                const data = await api.family.list();
                setChildren(data);
            } catch (error) {
                console.error('Failed to fetch children:', error);
            }
        };
        fetchChildren();

        if (user?.profiles) {
            if (!user.profiles.lat || !user.profiles.lng) {
                setMissingLocation(true);
            }
        }
    }, [user]);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingPrice(true);
            try {
                const services = await api.services.list();
                // Match either SN or Special Needs
                const snService = services.find(s => s.name === 'SN' || s.name === 'Special Needs');
                if (snService) {
                    setHourlyRate(Number(snService.hourly_rate));
                }
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setIsLoadingPrice(false);
            }
        };
        fetchServices();
    }, []);

    const handleChildSelect = (ids: string[]) => {
        setSelectedChildIds(ids);
        if (ids.length > 0) {
            setFormData(prev => ({ ...prev, numPeople: ids.length.toString() }));
        }
    };

    const handleChildSave = async (childData: Partial<Child>) => {
        try {
            const newChild = await api.family.create({ ...childData, profile_type: 'SPECIAL_NEEDS' });
            setChildren(prev => [...prev, newChild]);
            setSelectedChildIds(prev => [...prev, newChild.id]);
            setIsAddChildModalOpen(false);
            addToast({ message: 'Child profile added successfully!', type: 'success' });
        } catch (error) {
            console.error('Failed to create child:', error);
            addToast({ message: 'Failed to add child profile', type: 'error' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({ message: 'Please set your location in your profile first', type: 'error' });
            return;
        }

        if (!formData.date || !formData.startTime || !formData.duration) {
            addToast({ message: 'Please fill in all required fields', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const requirements = [
                formData.medicalConditions ? `Medical: ${formData.medicalConditions}` : '',
                formData.mobilityAssistance ? 'Mobility assistance required' : '',
                formData.specialRequirements,
            ].filter(Boolean).join('. ');

            const numChildren = selectedChildIds.length > 0
                ? selectedChildIds.length
                : Math.max(1, Number(formData.numPeople) || 1);

            const payload = {
                category: 'SN',
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: numChildren,
                child_ids: selectedChildIds,
                children_ages: [],
                required_skills: ['special_needs_care', 'compassionate_care'],
                special_requirements: requirements,
                max_hourly_rate: hourlyRate || undefined,
            };

            await api.requests.create(payload);
            addToast({ message: 'Special needs care request submitted! Finding the best match for you...', type: 'success' });
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

    const ServiceSummary = () => (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 font-display">Service Summary</h3>

            {/* Service Info */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-[#FDF3F1] flex items-center justify-center text-2xl">
                    💝
                </div>
                <div>
                    <div className="font-bold text-gray-900 text-sm">Special Needs Care</div>
                    <div className="text-xs text-gray-500">Professional Support</div>
                </div>
            </div>

            <div className="space-y-3">
                {formData.date && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium text-gray-900">
                            {new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                )}
                {formData.startTime && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium text-gray-900">{formData.startTime}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">{formData.duration || 0} hours</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">People</span>
                    <span className="font-medium text-gray-900">
                        {selectedChildIds.length > 0 ? selectedChildIds.length : formData.numPeople}
                    </span>
                </div>

                <div className="border-t border-gray-200 my-4" />

                {(hourlyRate && formData.duration) ? (
                    <>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Hourly Rate</span>
                            <span className="font-medium">₹{hourlyRate.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-gray-200">
                            <span className="text-xs font-bold tracking-wider text-gray-500">TOTAL EST.</span>
                            <span className="text-xl font-bold text-[#CC7A68]">
                                ₹{(hourlyRate * Number(formData.duration)).toLocaleString()}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-sm text-gray-400 py-2">
                        Pricing calculated based on duration
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <motion.div
                variants={overlayVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center sm:p-4"
                onClick={onClose}
            >
                <motion.div
                    variants={modalVars}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white sm:rounded-[32px] w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="w-8 h-8 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors sm:hidden"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19L8 12L15 5" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div>
                                <h2 className="text-xl font-bold font-display text-gray-900">Booking</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClose}
                                className="hidden sm:flex w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center transition-colors text-gray-500"
                            >
                                <X size={18} />
                            </button>
                            <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors sm:hidden">
                                <span className="font-bold text-gray-900 text-xl tracking-widest pb-2">...</span>
                            </button>
                        </div>
                    </div>

                    {/* Location Warning */}
                    {missingLocation && (
                        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shrink-0">
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

                    {/* Responsive Layout Container */}
                    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                        {/* LEFT Panel (Form) */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            <form onSubmit={handleSubmit} className="p-6 space-y-8 pb-32 lg:pb-6">

                                {/* Title */}
                                <h1 className="text-3xl font-display font-medium text-[#CC7A68]">
                                    Special Needs Care
                                </h1>

                                {/* Date Selection */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Select Date
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                                        {availableDates.map((date) => {
                                            const dateStr = formatDate(date);
                                            const isSelected = formData.date === dateStr;
                                            return (
                                                <button
                                                    key={dateStr}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, date: dateStr })}
                                                    className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl border transition-all min-w-[70px] ${isSelected
                                                        ? 'bg-[#CC7A68] text-white border-[#CC7A68] shadow-md'
                                                        : 'bg-white border-gray-200 hover:border-[#CC7A68] hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                    </span>
                                                    <span className="text-xl font-bold mb-1">
                                                        {date.getDate()}
                                                    </span>
                                                    <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                                        {date.toLocaleDateString('en-US', { month: 'short' })}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Start Time
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
                                        {TIME_SLOTS.map((time) => {
                                            const isSelected = formData.startTime === time;
                                            return (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, startTime: time })}
                                                    className={`py-2 px-1 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                        ? 'bg-[#CC7A68] text-white border-[#CC7A68]'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#CC7A68] hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Duration
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {DURATION_OPTIONS.map((option) => {
                                            const isSelected = formData.duration === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, duration: option.value })}
                                                    className={`flex-1 min-w-[80px] py-3 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                        ? 'bg-[#b06a5b] text-white border-[#b06a5b]'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#b06a5b]'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Whom For (Children/People) */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Who is this for?
                                    </div>

                                    {/* Fallback Manual Counter if no children */}
                                    {children.length === 0 && (
                                        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-600 mb-3">
                                                No profiles found. You can select the number of people below, or add a profile for better matching.
                                            </p>
                                            <div className="flex gap-3">
                                                {['1', '2', '3'].map((num) => {
                                                    const isSelected = formData.numPeople === num;
                                                    return (
                                                        <button
                                                            key={num}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, numPeople: num })}
                                                            className={`w-12 h-12 rounded-xl font-bold border transition-all ${isSelected
                                                                ? 'bg-[#CC7A68] text-white border-[#CC7A68]'
                                                                : 'bg-white border-gray-200 text-gray-700 hover:border-[#CC7A68]'
                                                                }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <ChildSelector
                                        childrenMap={children}
                                        selectedIds={selectedChildIds}
                                        onChange={handleChildSelect}
                                        onAddNew={() => setIsAddChildModalOpen(true)}
                                    />
                                </div>

                                {/* Specific Requirements */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Specific Requirements
                                    </div>
                                    <textarea
                                        value={formData.medicalConditions}
                                        onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                                        placeholder="Please describe any specific needs, conditions, or routines we should know about..."
                                        className="w-full h-24 px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#CC7A68] focus:ring-1 focus:ring-[#CC7A68] focus:outline-none resize-none text-sm bg-gray-50/50"
                                    />
                                </div>

                                {/* Mobility */}
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.mobilityAssistance}
                                            onChange={(e) => setFormData({ ...formData, mobilityAssistance: e.target.checked })}
                                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#CC7A68] focus:ring-[#CC7A68]"
                                        />
                                        <span className="text-gray-700 font-medium text-sm">Mobility assistance required</span>
                                    </label>
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Additional Notes (Optional)
                                    </div>
                                    <textarea
                                        value={formData.specialRequirements}
                                        onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                                        placeholder="Any other preferences or special instructions..."
                                        className="w-full h-24 px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#CC7A68] focus:ring-1 focus:ring-[#CC7A68] focus:outline-none resize-none text-sm bg-gray-50/50"
                                    />
                                </div>

                                {/* Mobile Only: Service Summary at Bottom */}
                                <div className="lg:hidden mt-8 pt-8 border-t border-gray-100">
                                    <ServiceSummary />
                                    <button
                                        type="submit"
                                        disabled={loading || missingLocation || !formData.date || !formData.duration}
                                        className="w-full bg-[#CC7A68] hover:bg-[#b06a5b] text-white py-4 rounded-full font-bold text-base mt-6 transition-all disabled:opacity-50 shadow-xl shadow-[#CC7A68]/20"
                                    >
                                        {loading ? 'Finding Caregivers...' : 'Confirm Request →'}
                                    </button>
                                </div>

                            </form>
                        </div>

                        {/* RIGHT Panel (Desktop Only) */}
                        <div className="hidden lg:flex w-[400px] border-l border-gray-100 bg-white flex-col p-8 shrink-0">
                            <div className="sticky top-0">
                                <ServiceSummary />
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={loading || missingLocation || !formData.date || !formData.duration}
                                        className="w-full bg-[#CC7A68] hover:bg-[#b06a5b] text-white py-4 rounded-full font-bold text-base transition-all disabled:opacity-50 shadow-xl shadow-[#CC7A68]/20"
                                    >
                                        {loading ? 'Finding Caregivers...' : 'Confirm Request →'}
                                    </button>
                                    {(!formData.date || !formData.duration) && (
                                        <p className="text-xs text-amber-600 mt-3 text-center font-medium opacity-80">
                                            Please select date and duration
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <ChildProfileModal
                isOpen={isAddChildModalOpen}
                onClose={() => setIsAddChildModalOpen(false)}
                onSave={handleChildSave}
                initialData={{ profile_type: 'SPECIAL_NEEDS' }}
            />
        </>
    );
}
