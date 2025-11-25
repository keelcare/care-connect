"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import { User } from 'lucide-react';

interface DirectBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    nannyId: string;
    nannyName: string;
    hourlyRate: number;
}

export const DirectBookingModal: React.FC<DirectBookingModalProps> = ({
    isOpen,
    onClose,
    nannyId,
    nannyName,
    hourlyRate
}) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        duration: '',
        numChildren: '',
        specialRequirements: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.date || !formData.startTime || !formData.duration || !formData.numChildren) {
                addToast({ message: 'Please fill in all required fields', type: 'error' });
                setLoading(false);
                return;
            }

            // Calculate end time
            const [hours, minutes] = formData.startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);
            const endDate = new Date(startDate.getTime() + Number(formData.duration) * 60 * 60 * 1000);
            const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

            const payload = {
                nannyId: nannyId,
                date: formData.date,
                startTime: formData.startTime,
                endTime: endTime,
                numChildren: Number(formData.numChildren),
                notes: formData.specialRequirements || undefined,
            };


            await api.bookings.create(payload);

            addToast({ message: `Booking request sent to ${nannyName}!`, type: 'success' });

            // Reset form
            setFormData({
                date: '',
                startTime: '',
                duration: '',
                numChildren: '',
                specialRequirements: ''
            });

            onClose();

            // Redirect to bookings page
            window.location.href = '/bookings';

        } catch (error) {
            console.error("Direct booking failed:", error);
            addToast({ message: 'Failed to create booking. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const estimatedCost = formData.duration ? (Number(formData.duration) * hourlyRate).toFixed(2) : '0.00';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Book Caregiver">
            <div className="mb-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-neutral-900">{nannyName}</h3>
                        <p className="text-sm text-neutral-600">₹{hourlyRate}/hr</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Date *</label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Start Time *</label>
                        <Input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Duration (Hours) *</label>
                        <Input
                            type="number"
                            name="duration"
                            min="1"
                            max="24"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                            className="w-full"
                            placeholder="e.g. 4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Number of Children *</label>
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
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Special Requirements</label>
                    <textarea
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-20"
                        placeholder="Any specific needs or instructions..."
                    />
                </div>

                {formData.duration && (
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">Estimated Cost:</span>
                            <span className="text-lg font-bold text-primary">₹{estimatedCost}</span>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-600 text-white">
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
