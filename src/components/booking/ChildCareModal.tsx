'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChildSelector } from './ChildSelector';
import { ChildProfileModal } from '@/components/dashboard/ChildProfileModal';
import { Child } from '@/types/api';
import { HorizDial } from './HorizDial';

interface ChildCareModalProps {
    onClose: () => void;
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Time: 7:00 AM – 9:00 PM in 30-min steps
const START_HOUR = 7;
const END_HOUR = 21;
const STEP_MINS = 30;
const TIME_SLOTS = ((END_HOUR - START_HOUR) * 60) / STEP_MINS; // 28 slots

function slotToLabel(i: number): string {
    const mins = START_HOUR * 60 + i * STEP_MINS;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function slotToTime24(i: number): string {
    const mins = START_HOUR * 60 + i * STEP_MINS;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function endTimeLabel(startSlot: number, durationHrs: number): string {
    const totalMins = START_HOUR * 60 + startSlot * STEP_MINS + durationHrs * 60;
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h > 23) return "—";
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function getDaysInMonth(y: number, m: number): number {
    return new Date(y, m + 1, 0).getDate();
}

function getFirstDay(y: number, m: number): number {
    return new Date(y, m, 1).getDay();
}

export default function ChildCareModal({ onClose }: ChildCareModalProps) {
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

    // Calendar state
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    // Time and duration state
    const [timeSlot, setTimeSlot] = useState(8); // default 11:00 AM
    const [durationIdx, setDurationIdx] = useState(3); // default 2h

    const [specialRequirements, setSpecialRequirements] = useState('');

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
            } else {
                setMissingLocation(false);
            }
        }
    }, [user]);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingPrice(true);
            try {
                const services = await api.services.list();
                const ccService = services.find(s => s.name === 'CC' || s.name === 'Child Care');
                if (ccService) {
                    // setHourlyRate(Number(ccService.hourly_rate));
                    setHourlyRate(200); // Explicitly set to 200 as requested
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
    };

    const handleChildSave = async (childData: Partial<Child>) => {
        try {
            const newChild = await api.family.create(childData);
            setChildren(prev => [...prev, newChild]);
            setSelectedChildIds(prev => [...prev, newChild.id]);
            setIsAddChildModalOpen(false);
            addToast({ message: 'Child profile added successfully!', type: 'success' });
        } catch (error) {
            console.error('Failed to create child:', error);
            addToast({ message: 'Failed to add child profile', type: 'error' });
        }
    };

    // Time slots generation
    const timeSlots = Array.from({ length: 28 }, (_, i) => {
        const mins = START_HOUR * 60 + i * STEP_MINS;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        const ampm = h < 12 ? "AM" : "PM";
        const h12 = h % 12 === 0 ? 12 : h % 12;
        
        const timeString = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
        
        // Dynamic labeling: Only show label every 2 hours (4 slots) to prevent cramping
        // Slot 0 (7am), 4 (9am), 8 (11am)...
        const showLabel = i % 4 === 0;
        
        return {
            value: i,
            // Main big display text
            display: timeString, 
            // Small tick label
            label: showLabel ? `${h12} ${ampm}` : '', 
            mins: mins
        };
    });

    // Duration options
    const durationOptions = [
        { label: '2 hours', value: 2 },
        { label: '4 hours', value: 4 },
        { label: '6 hours', value: 6 },
        { label: '8 hours', value: 8 },
        { label: '12 hours', value: 12 },
    ];

    const durValues = durationOptions.map(d => d.value);
    const durationHrs = durationOptions[Math.max(0, Math.min(durationIdx, durationOptions.length - 1))]?.value ?? 2;
    const duration = durationHrs;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({
                message: 'Please set your location in your profile first',
                type: 'error',
            });
            return;
        }

        // Validate profile selection
        if (selectedChildIds.length === 0) {
            addToast({
                message: 'Please select at least one child profile',
                type: 'error',
            });
            return;
        }

        // Validate date selection
        if (!selectedDate) {
            addToast({
                message: 'Please select a date for the booking',
                type: 'error',
            });
            return;
        }

        // Validate time and duration
        if (timeSlot === null || timeSlot === undefined || !durationHrs) {
            addToast({
                message: 'Please select start time and duration',
                type: 'error',
            });
            return;
        }

        setLoading(true);

        try {
            const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
            const startTime = slotToTime24(timeSlot);

            const payload = {
                category: 'CC',
                date: dateStr,
                start_time: startTime,
                duration_hours: durationHrs,
                num_children: selectedChildIds.length,
                child_ids: selectedChildIds,
                children_ages: [],
                max_hourly_rate: hourlyRate || undefined,
                required_skills: [],
                special_requirements: specialRequirements,
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

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDay(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
        setSelectedDate(null);
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
        setSelectedDate(null);
    };

    const formattedDate = selectedDate
        ? `${MONTH_NAMES[currentMonth].slice(0, 3)} ${selectedDate}, ${currentYear}`
        : "—";
    
    // Calculate end time
    const getEndTime = () => {
        if (timeSlot === null) return "—";
        const totalMins = START_HOUR * 60 + timeSlot * STEP_MINS + duration * 60;
        let h = Math.floor(totalMins / 60);
        const nextDay = h >= 24 ? " (Next Day)" : "";
        h = h % 24; // Normalize to 24-hour format
        const m = totalMins % 60;
        const ampm = h < 12 ? "AM" : "PM";
        const h12 = h % 12 === 0 ? 12 : h % 12;
        return `${h12}:${m.toString().padStart(2, "0")} ${ampm}${nextDay}`;
    };

    const endTime = getEndTime();

    const selectedChild = selectedChildIds.length > 0 ? children.find(c => c.id === selectedChildIds[0]) : null;

    // Check if form is complete
    const isFormComplete = selectedChildIds.length > 0 && selectedDate !== null && timeSlot !== null && duration > 0;

    const calCells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calCells.push(d);

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
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 font-display">Service Summary</h3>

            {/* Service & Profile */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[#E8F2EC] flex items-center justify-center text-xl">
                    👶
                </div>
                <div>
                    <div className="font-bold text-gray-900 text-sm">Child Care</div>
                    <div className="text-xs text-gray-500">
                         {selectedChildIds.length > 0 
                            ? `For ${selectedChildIds.map(id => children.find(c => c.id === id)?.first_name).join(', ')}`
                            : 'Select a child'}
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium text-gray-900">
                        {timeSlot !== null ? timeSlots.find(t => t.value === timeSlot)?.display : '—'} 
                        {' - '} 
                        {endTime}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">{durationHrs} hours</span>
                </div>
            </div>

            {/* Price */}
            <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold tracking-wider text-gray-500">ESTIMATED TOTAL</span>
                    <span className={`text-xl font-bold ${hourlyRate ? 'text-primary-900' : 'text-gray-300'}`}>
                        {hourlyRate ? `₹${(hourlyRate * durationHrs).toFixed(0)}` : '—'}
                    </span>
                </div>
                <div className="text-right text-[10px] text-gray-400">
                    {hourlyRate ? `Based on ₹${hourlyRate}/hr` : 'Pricing TBD'}
                </div>
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
                    className="bg-white sm:rounded-[32px] w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={onClose}
                                className="w-8 h-8 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors sm:hidden"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19L8 12L15 5" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                                
                                {/* 1. Title */}
                                <h1 className="text-fluid-3xl font-display font-medium text-primary-900">
                                    Book a Child Care
                                </h1>

                                {/* 2. Profiles */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Who is this booking for?
                                    </div>
                                    <ChildSelector
                                        childrenMap={children}
                                        selectedIds={selectedChildIds}
                                        onChange={handleChildSelect}
                                        onAddNew={() => setIsAddChildModalOpen(true)}
                                    />
                                    {selectedChildIds.length === 0 && (
                                         <p className="text-xs text-amber-600 mt-2 font-medium">Please select a child profile</p>
                                    )}
                                </div>

                                {/* 3. Calendar */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-display font-medium text-xl text-gray-800">
                                            {MONTH_NAMES[currentMonth]} {currentYear}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={prevMonth}
                                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
                                            >
                                                ‹
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextMonth}
                                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 mb-2">
                                        {DAYS.map(d => (
                                            <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-y-2">
                                        {calCells.map((day, idx) => {
                                            if (!day) return <div key={`e${idx}`} />;
                                            const isSel = day === selectedDate;
                                            
                                            const dateObj = new Date(currentYear, currentMonth, day);
                                            const todayStart = new Date();
                                            todayStart.setHours(0, 0, 0, 0);
                                            const isPast = dateObj < todayStart;

                                            return (
                                                <div key={day} className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        disabled={isPast}
                                                        onClick={() => !isPast && setSelectedDate(day)}
                                                        className={`w-10 h-10 rounded-full text-sm font-medium transition flex items-center justify-center ${
                                                            isPast 
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : isSel
                                                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {day}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 4. Time Slots */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Available Time Slots
                                    </div>
                                    <div className="py-2">
                                        <HorizDial
                                            label="START TIME"
                                            ticks={timeSlots}
                                            current={timeSlot ?? 0}
                                            onChange={(val) => setTimeSlot(val)}
                                        />
                                    </div>
                                </div>

                                {/* 5. Duration */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Duration
                                    </div>
                                    <div className="py-2">
                                        <HorizDial
                                            label="DURATION"
                                            ticks={durationOptions.map((opt, i) => ({
                                                value: i,
                                                label: opt.value + 'h',
                                                display: opt.label,
                                            }))}
                                            current={durationIdx}
                                            onChange={(idx) => setDurationIdx(idx)}
                                            accent="#6b5b3d"
                                        />
                                    </div>
                                </div>

                                {/* 6. Special Requirements */}
                                <div>
                                     <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Additional Notes
                                    </div>
                                    <textarea
                                        value={specialRequirements}
                                        onChange={(e) => setSpecialRequirements(e.target.value)}
                                        placeholder="Any specific needs, allergies, preferences..."
                                        className="w-full h-24 px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary-900 focus:ring-1 focus:ring-primary-900 focus:outline-none resize-none text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/50"
                                    />
                                </div>

                                {/* Mobile Only: Service Summary at Bottom */}
                                <div className="lg:hidden mt-8 pt-8 border-t border-gray-100">
                                    <ServiceSummary />
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            disabled={loading || missingLocation || !isFormComplete}
                                            className="w-full bg-primary-900 hover:bg-primary-800 text-white py-4 rounded-full text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-900/20"
                                        >
                                            {loading ? 'Processing...' : 'Confirm Booking'} 
                                            <span className="ml-2">→</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT Panel (Desktop Only) */}
                        <div className="hidden lg:flex w-[380px] border-l border-gray-100 bg-white flex-col p-8 shrink-0">
                             <div className="sticky top-0">
                                <ServiceSummary />
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                                        disabled={loading || missingLocation || !isFormComplete}
                                        className="w-full bg-primary-900 hover:bg-primary-800 text-white py-4 rounded-full text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-900/20"
                                    >
                                        {loading ? 'Processing...' : 'Confirm Booking'} 
                                        <span className="ml-2">→</span>
                                    </button>
                                    
                                     {!isFormComplete && (
                                        <p className="text-xs text-amber-600 mt-3 text-center font-medium opacity-80">
                                            Please complete all required fields
                                        </p>
                                    )}
                                </div>
                             </div>
                        </div>

                    </div>
                </motion.div>
            </motion.div>

            {/* Child Profile Modal */}
            <ChildProfileModal
                isOpen={isAddChildModalOpen}
                onClose={() => setIsAddChildModalOpen(false)}
                onSave={handleChildSave}
            />
        </>
    );
}
