"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import { Button } from '@/components/ui/button';
import { AvailabilityBlock } from '@/types/api';
import { 
    DaySelector, 
    generateRecurrencePattern, 
    formatRecurrencePattern 
} from '@/components/scheduling/DaySelector';
import {
    Calendar,
    Clock,
    Plus,
    Trash2,
    X,
    CalendarOff,
    Repeat,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';

export default function AvailabilityPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: false,
        selectedDays: [] as string[],
        reason: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBlocks();
    }, []);

    const fetchBlocks = async () => {
        try {
            setLoading(true);
            const data = await api.availability.list();
            setBlocks(data);
        } catch (error) {
            console.error('Failed to fetch availability blocks:', error);
            addToast({ message: 'Failed to load availability', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!formData.startDate) {
            addToast({ message: 'Please select a start date', type: 'error' });
            return;
        }

        if (formData.isRecurring && formData.selectedDays.length === 0) {
            addToast({ message: 'Please select at least one day for recurring block', type: 'error' });
            return;
        }

        setSubmitting(true);

        try {
            const startDateTime = `${formData.startDate}T${formData.startTime}:00Z`;
            const endDateTime = formData.endDate 
                ? `${formData.endDate}T${formData.endTime}:00Z`
                : `${formData.startDate}T${formData.endTime}:00Z`;

            const payload = {
                startTime: startDateTime,
                endTime: endDateTime,
                isRecurring: formData.isRecurring,
                recurrencePattern: formData.isRecurring 
                    ? generateRecurrencePattern('weekly', formData.selectedDays)
                    : undefined,
                reason: formData.reason || undefined,
            };

            await api.availability.create(payload);
            addToast({ message: 'Availability block created successfully', type: 'success' });
            setShowModal(false);
            resetForm();
            fetchBlocks();
        } catch (error) {
            console.error('Failed to create availability block:', error);
            addToast({ message: 'Failed to create availability block', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeleting(id);
        try {
            await api.availability.delete(id);
            addToast({ message: 'Availability block removed', type: 'success' });
            setBlocks(blocks.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to delete availability block:', error);
            addToast({ message: 'Failed to remove availability block', type: 'error' });
        } finally {
            setDeleting(null);
        }
    };

    const resetForm = () => {
        setFormData({
            startDate: '',
            endDate: '',
            startTime: '09:00',
            endTime: '17:00',
            isRecurring: false,
            selectedDays: [],
            reason: '',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900">Availability</h1>
                    <p className="text-stone-500 mt-1">Manage your blocked times and recurring unavailability</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus size={18} className="mr-2" />
                    Block Time
                </Button>
            </div>

            {/* Info Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-emerald-800">How it works</p>
                    <p className="text-sm text-emerald-700 mt-1">
                        Blocked times will automatically prevent parents from booking you during those periods. 
                        Use recurring blocks for regular unavailability like weekends.
                    </p>
                </div>
            </div>

            {/* Availability Blocks List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            ) : blocks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                    <CalendarOff className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-stone-900 mb-2">No blocked times</h3>
                    <p className="text-stone-500 mb-6">You haven't blocked any times yet. Block times when you're unavailable.</p>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Plus size={18} className="mr-2" />
                        Block Time
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {blocks.map((block) => {
                        const start = formatDateTime(block.start_time);
                        const end = formatDateTime(block.end_time);
                        
                        return (
                            <div
                                key={block.id}
                                className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                        block.is_recurring 
                                            ? 'bg-purple-100 text-purple-600' 
                                            : 'bg-orange-100 text-orange-600'
                                    }`}>
                                        {block.is_recurring ? <Repeat size={24} /> : <CalendarOff size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-stone-900">
                                                {block.is_recurring 
                                                    ? formatRecurrencePattern(block.recurrence_pattern || '')
                                                    : start.date
                                                }
                                            </h3>
                                            {block.is_recurring && (
                                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                                                    Recurring
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-stone-500">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {start.time} - {end.time}
                                            </span>
                                            {!block.is_recurring && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {start.date} {start.date !== end.date && `- ${end.date}`}
                                                </span>
                                            )}
                                        </div>
                                        {block.reason && (
                                            <p className="text-sm text-stone-400 mt-1">{block.reason}</p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(block.id)}
                                    disabled={deleting === block.id}
                                    className="text-stone-400 hover:text-red-600 hover:bg-red-50"
                                >
                                    {deleting === block.id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                    ) : (
                                        <Trash2 size={18} />
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Block Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-stone-900">Block Time</h2>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
                            >
                                <X size={20} className="text-stone-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Recurring Toggle */}
                            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Repeat size={20} className="text-stone-600" />
                                    <div>
                                        <p className="font-medium text-stone-900">Recurring Block</p>
                                        <p className="text-sm text-stone-500">Repeat on specific days every week</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isRecurring: !formData.isRecurring })}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        formData.isRecurring ? 'bg-emerald-600' : 'bg-stone-300'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                                        formData.isRecurring ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                                </button>
                            </div>

                            {/* Day Selector for Recurring */}
                            {formData.isRecurring && (
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-3">
                                        Select Days
                                    </label>
                                    <DaySelector
                                        selectedDays={formData.selectedDays}
                                        onChange={(days) => setFormData({ ...formData, selectedDays: days })}
                                    />
                                </div>
                            )}

                            {/* Date Selection */}
                            {!formData.isRecurring && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* For recurring, we still need a reference start date */}
                            {formData.isRecurring && (
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Starting From
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                    />
                                </div>
                            )}

                            {/* Time Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Reason (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="e.g., Personal appointment, Weekend off"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className="flex-1 rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {submitting ? 'Creating...' : 'Block Time'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
