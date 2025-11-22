"use client";

import React, { useState } from 'react';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { CreateBookingDto } from '@/types/api';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    caregiverId: string;
    caregiverName: string;
    hourlyRate: number;
    onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    caregiverId,
    caregiverName,
    hourlyRate,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        notes: ''
    });

    if (!isOpen) return null;

    const calculateTotal = () => {
        if (!formData.startTime || !formData.endTime) return 0;

        const start = new Date(`2000-01-01T${formData.startTime}`);
        const end = new Date(`2000-01-01T${formData.endTime}`);

        let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60; // hours
        if (diff < 0) diff += 24; // Handle overnight

        return Math.max(0, diff * hourlyRate);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Combine date and time
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            // Handle overnight bookings (end time is next day)
            if (endDateTime <= startDateTime) {
                endDateTime.setDate(endDateTime.getDate() + 1);
            }

            const bookingData: CreateBookingDto = {
                nannyId: caregiverId,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                notes: formData.notes
            };

            await api.bookings.create(bookingData);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Booking failed:', err);
            setError(err.message || 'Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <h3 className="text-lg font-bold text-neutral-900">Book {caregiverName}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <Calendar size={18} className="absolute left-3.5 top-3.5 text-neutral-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Start Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <Clock size={18} className="absolute left-3.5 top-3.5 text-neutral-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">End Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <Clock size={18} className="absolute left-3.5 top-3.5 text-neutral-400" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Notes (Optional)</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any special requirements or details..."
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px] resize-none"
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm text-neutral-600">
                            <span>Rate</span>
                            <span>₹{hourlyRate}/hr</span>
                        </div>
                        <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                            <span>Estimated Total</span>
                            <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl h-12"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-xl h-12 bg-primary hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
