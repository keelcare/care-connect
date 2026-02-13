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

    // Build time ticks: show label every 2 hours (every 4 slots)
    const timeTicks = Array.from({ length: TIME_SLOTS }, (_, i) => {
        const totalMins = START_HOUR * 60 + i * STEP_MINS;
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        const showLabel = m === 0 && (h - START_HOUR) % 2 === 0;
        const ampm = h < 12 ? "AM" : "PM";
        const h12 = h % 12 === 0 ? 12 : h % 12;
        const display = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
        return { value: i, label: showLabel ? `${h12}${ampm.toLowerCase()}` : "", display };
    });

    // Duration: 0.5h steps from 0.5 to 8 hrs = 16 values
    const durValues: number[] = [];
    for (let v = 0.5; v <= 8; v += 0.5) durValues.push(v);
    const durationTicks = durValues.map((v, i) => ({
        value: i,
        label: Number.isInteger(v) ? `${v}h` : "",
        display: `${v} ${v === 1 ? "hour" : "hours"}`,
    }));
    const durationHrs = durValues[durationIdx];

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
    const endTime = endTimeLabel(timeSlot, durationHrs);

    const selectedChild = selectedChildIds.length > 0 ? children.find(c => c.id === selectedChildIds[0]) : null;

    // Check if form is complete
    const isFormComplete = selectedChildIds.length > 0 && selectedDate !== null && timeSlot !== null && durationHrs > 0;

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
                    className="bg-[#faf9f7] rounded-[28px] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1B3022] to-[#15231b] text-white px-6 py-5 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold font-display mb-1">Book Child Care</h2>
                            <p className="text-green-100 text-xs">Complete the details below to schedule your care.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-lg"
                        >
                            ✕
                        </button>
                    </div>

                    {missingLocation && (
                        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
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

                    {/* Two Panel Layout */}
                    <div className="flex overflow-hidden" style={{ height: 'calc(90vh - 140px)' }}>
                        {/* LEFT Panel */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Profiles */}
                                <div className={`${selectedChildIds.length === 0 ? 'p-3 border-2 border-amber-200 bg-amber-50/30 rounded-xl' : ''}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-xs font-bold tracking-wider text-gray-600">
                                            WHO IS THIS BOOKING FOR?
                                        </div>
                                        {selectedChildIds.length === 0 && (
                                            <span className="text-xs text-amber-600 font-semibold">Required *</span>
                                        )}
                                    </div>
                                    <ChildSelector
                                        childrenMap={children}
                                        selectedIds={selectedChildIds}
                                        onChange={handleChildSelect}
                                        onAddNew={() => setIsAddChildModalOpen(true)}
                                    />
                                </div>

                                {/* Calendar */}
                                <div className="bg-white rounded-2xl p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-gray-800 text-base">
                                            {MONTH_NAMES[currentMonth]} {currentYear}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={prevMonth}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
                                            >
                                                ‹
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextMonth}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {DAYS.map(d => (
                                            <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
                                                {d}
                                            </div>
                                        ))}
                                        {calCells.map((day, idx) => {
                                            if (!day) return <div key={`e${idx}`} />;
                                            const isSel = day === selectedDate;
                                            return (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => setSelectedDate(day)}
                                                    className={`aspect-square rounded-full text-sm font-medium transition ${isSel
                                                        ? 'bg-[#3d6b55] text-white'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time & Duration Dials */}
                                <div className="bg-white rounded-2xl p-5 shadow-sm space-y-6">
                                    <HorizDial
                                        label="Start Time"
                                        ticks={timeTicks}
                                        current={timeSlot}
                                        onChange={setTimeSlot}
                                        accent="#3d6b55"
                                    />

                                    <div className="border-t border-gray-100" />

                                    <HorizDial
                                        label="Duration"
                                        subLabel={`Ends at ${endTime}`}
                                        ticks={durationTicks}
                                        current={durationIdx}
                                        onChange={setDurationIdx}
                                        accent="#6b5b3d"
                                    />
                                </div>

                                {/* Special Requirements */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-[#1B3022]" />
                                        <h3 className="text-xs font-bold text-gray-800">Special Requirements (Optional)</h3>
                                    </div>
                                    <textarea
                                        value={specialRequirements}
                                        onChange={(e) => setSpecialRequirements(e.target.value)}
                                        placeholder="Any specific needs, allergies, preferences, or instructions..."
                                        className="w-full h-20 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-[#1B3022] focus:ring-2 focus:ring-[#1B3022]/20 focus:outline-none resize-none text-xs text-gray-900 placeholder:text-gray-400"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* RIGHT Panel */}
                        <div className="w-[38%] bg-white border-l border-gray-200 overflow-y-auto px-5 py-5">
                            <h3 className="text-sm font-bold text-gray-800 mb-4">Service Summary</h3>

                            {/* Service Card */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#e8f2ec] flex items-center justify-center text-2xl">
                                    👶
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">Child Care</div>
                                    <div className="text-xs text-gray-500">Standard Care</div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-semibold text-gray-900">
                                        {durationHrs} {durationHrs === 1 ? "hour" : "hours"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">For Profile</span>
                                    <span className="font-semibold text-gray-900">
                                        {selectedChild ? selectedChild.first_name : "—"}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 my-3" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-semibold text-gray-900">{formattedDate}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Start Time</span>
                                    <span className="font-semibold text-gray-900">{slotToLabel(timeSlot)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">End Time</span>
                                    <span className="font-semibold text-gray-900">{endTime}</span>
                                </div>
                            </div>

                            {/* Price - Empty */}
                            <div className="mb-4">
                                <div className="text-xs font-bold tracking-wider text-gray-500 mb-1">
                                    TOTAL ESTIMATE
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className={`text-2xl font-bold ${hourlyRate ? 'text-[#1B3022]' : 'text-gray-300'}`}>
                                        {hourlyRate ? `₹${(hourlyRate * durationHrs).toFixed(0)}` : '—'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {hourlyRate ? `Based on ${durationHrs} hrs @ ₹${hourlyRate}/hr` : 'Pricing TBD'}
                                    </span>
                                </div>
                            </div>

                            {!isFormComplete && (
                                <p className="text-xs text-amber-600 mb-2 text-center font-medium">
                                    {selectedChildIds.length === 0 && '⚠️ Select a profile'}
                                    {selectedChildIds.length > 0 && !selectedDate && '⚠️ Select a date'}
                                    {selectedChildIds.length > 0 && selectedDate && '⚠️ Complete all fields'}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={loading || missingLocation || !isFormComplete}
                                onClick={handleSubmit}
                                className="w-full bg-[#1B3022] hover:bg-[#15231b] text-white py-3 rounded-full text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? 'Finding Caregivers...' : 'Confirm Booking →'}
                            </button>
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
