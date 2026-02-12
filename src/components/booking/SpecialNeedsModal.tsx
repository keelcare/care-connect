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

            const payload = {
                category: 'SN',
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: selectedChildIds.length > 0 ? selectedChildIds.length : Number(formData.numPeople),
                child_ids: selectedChildIds,
                children_ages: [],
                required_skills: ['special_needs_care', 'compassionate_care'],
                special_requirements: requirements,
                service_type: 'SPECIAL_NEEDS' as const,
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

    return (
        <>
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
                <div className="sticky top-0 bg-gradient-to-r from-[#CC7A68] to-[#b06a5b] text-white p-8 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2">Special Needs Care</h2>
                            <p className="text-red-100 font-body">Professional support for unique requirements</p>
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
                            <Calendar className="w-5 h-5 text-[#CC7A68]" />
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
                                        className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[80px] ${isSelected ? 'bg-[#CC7A68] text-white border-[#CC7A68]' : 'bg-white border-gray-200 hover:border-[#CC7A68] hover:bg-[#FDF3F1]'
                                            }`}
                                    >
                                        <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-red-100' : 'text-gray-500'}`}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className={`text-2xl font-bold ${isToday(date) && !isSelected ? 'text-[#CC7A68]' : ''}`}>{date.getDate()}</span>
                                        <span className={`text-xs ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#CC7A68]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Start Time</h3>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                            {TIME_SLOTS.map((time) => {
                                const isSelected = formData.startTime === time;
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, startTime: time })}
                                        className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${isSelected ? 'bg-[#CC7A68] text-white border-[#CC7A68]' : 'bg-white border-gray-200 hover:border-[#CC7A68] hover:bg-[#FDF3F1]'
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
                            <Clock className="w-5 h-5 text-[#CC7A68]" />
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
                                        className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${isSelected ? 'bg-[#CC7A68] text-white border-[#CC7A68]' : 'bg-white border-gray-200 hover:border-[#CC7A68] hover:bg-[#FDF3F1]'
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
                            <Users className="w-5 h-5 text-[#CC7A68]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Who is this for?</h3>
                        </div>

                         {/* Fallback Manual Counter */}
                         {children.length === 0 && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-sm text-gray-600 mb-3">
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
                                                className={`w-14 h-14 rounded-xl font-semibold border-2 transition-all ${isSelected ? 'bg-[#CC7A68] text-white border-[#CC7A68]' : 'bg-white border-gray-200 hover:border-[#CC7A68]'
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

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <HeartHandshake className="w-5 h-5 text-[#CC7A68]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Specific Requirements</h3>
                        </div>
                        <textarea
                            value={formData.medicalConditions}
                            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                            placeholder="Please describe any specific needs, conditions, or routines we should know about..."
                            className="w-full h-24 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#CC7A68] focus:ring-2 focus:ring-[#CC7A68]/20 focus:outline-none resize-none"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.mobilityAssistance}
                                onChange={(e) => setFormData({ ...formData, mobilityAssistance: e.target.checked })}
                                className="w-5 h-5 rounded border-2 border-gray-300 text-[#CC7A68] focus:ring-[#CC7A68]"
                            />
                            <span className="text-gray-700 font-medium">Mobility assistance required</span>
                        </label>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-[#CC7A68]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Additional Notes (Optional)</h3>
                        </div>
                        <textarea
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                            placeholder="Any other preferences or special instructions..."
                            className="w-full h-24 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#CC7A68] focus:ring-2 focus:ring-[#CC7A68]/20 focus:outline-none resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || missingLocation}
                        className="w-full bg-[#CC7A68] hover:bg-[#b06a5b] text-white py-5 rounded-full font-bold text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Finding Caregivers...' : 'Find My Caregiver'}
                    </button>
                </form>
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
