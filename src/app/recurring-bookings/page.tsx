"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import { RecurringBooking } from '@/types/api';
import { formatRecurrencePattern } from '@/components/scheduling/DaySelector';
import {
    Calendar,
    Clock,
    Plus,
    Trash2,
    Pause,
    Play,
    Repeat,
    User,
    CalendarDays,
    AlertCircle,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function RecurringBookingsPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [bookings, setBookings] = useState<RecurringBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchRecurringBookings();
    }, []);

    const fetchRecurringBookings = async () => {
        try {
            setLoading(true);
            const data = await api.recurringBookings.list();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch recurring bookings:', error);
            addToast({ message: 'Failed to load recurring bookings', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        setActionLoading(id);
        try {
            await api.recurringBookings.update(id, { isActive: !currentStatus });
            addToast({ 
                message: currentStatus ? 'Recurring booking paused' : 'Recurring booking resumed', 
                type: 'success' 
            });
            fetchRecurringBookings();
        } catch (error) {
            console.error('Failed to update recurring booking:', error);
            addToast({ message: 'Failed to update recurring booking', type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this recurring booking? Future bookings will not be generated.')) {
            return;
        }

        setActionLoading(id);
        try {
            await api.recurringBookings.delete(id);
            addToast({ message: 'Recurring booking deleted', type: 'success' });
            setBookings(bookings.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to delete recurring booking:', error);
            addToast({ message: 'Failed to delete recurring booking', type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getNannyName = (booking: RecurringBooking) => {
        const nanny = booking.nanny;
        if (nanny?.profiles?.first_name && nanny?.profiles?.last_name) {
            return `${nanny.profiles.first_name} ${nanny.profiles.last_name}`;
        }
        return nanny?.email || 'Caregiver';
    };

    return (
        <ParentLayout>
            <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50 pb-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <Repeat className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-stone-900">Recurring Bookings</h1>
                                </div>
                                <p className="text-stone-500 mt-1">Manage your scheduled recurring care</p>
                            </div>
                            <Link href="/browse">
                                <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Plus size={18} className="mr-2" />
                                    New Recurring
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3 mb-8">
                        <CalendarDays className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-purple-800">How recurring bookings work</p>
                            <p className="text-sm text-purple-700 mt-1">
                                Recurring bookings automatically generate individual bookings based on your schedule. 
                                Bookings are created 1 day in advance. You can pause or cancel anytime.
                            </p>
                        </div>
                    </div>

                    {/* Recurring Bookings List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                            <Repeat className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-stone-900 mb-2">No recurring bookings</h3>
                            <p className="text-stone-500 mb-6">
                                Set up recurring bookings for regular care needs like weekly babysitting.
                            </p>
                            <Link href="/browse">
                                <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Plus size={18} className="mr-2" />
                                    Find a Caregiver
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className={`bg-white rounded-2xl border p-6 transition-all ${
                                        booking.is_active 
                                            ? 'border-stone-200 hover:shadow-md' 
                                            : 'border-stone-200 bg-stone-50 opacity-75'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                booking.is_active 
                                                    ? 'bg-purple-100 text-purple-600' 
                                                    : 'bg-stone-200 text-stone-500'
                                            }`}>
                                                <Repeat size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-stone-900">
                                                        {formatRecurrencePattern(booking.recurrence_pattern)}
                                                    </h3>
                                                    {booking.is_active ? (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
                                                            <CheckCircle2 size={12} />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-xs font-medium flex items-center gap-1">
                                                            <XCircle size={12} />
                                                            Paused
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-sm text-stone-500">
                                                    <User size={14} />
                                                    <span>{getNannyName(booking)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleActive(booking.id, booking.is_active)}
                                                disabled={actionLoading === booking.id}
                                                className={`rounded-xl ${
                                                    booking.is_active 
                                                        ? 'text-amber-600 hover:bg-amber-50' 
                                                        : 'text-emerald-600 hover:bg-emerald-50'
                                                }`}
                                                title={booking.is_active ? 'Pause' : 'Resume'}
                                            >
                                                {actionLoading === booking.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                ) : booking.is_active ? (
                                                    <Pause size={18} />
                                                ) : (
                                                    <Play size={18} />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(booking.id)}
                                                disabled={actionLoading === booking.id}
                                                className="text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
                                        <div>
                                            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Start Time</p>
                                            <p className="text-sm font-medium text-stone-900 flex items-center gap-1">
                                                <Clock size={14} className="text-stone-400" />
                                                {booking.start_time}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Duration</p>
                                            <p className="text-sm font-medium text-stone-900">
                                                {booking.duration_hours} hour{booking.duration_hours > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Started</p>
                                            <p className="text-sm font-medium text-stone-900 flex items-center gap-1">
                                                <Calendar size={14} className="text-stone-400" />
                                                {formatDate(booking.start_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Ends</p>
                                            <p className="text-sm font-medium text-stone-900">
                                                {booking.end_date ? formatDate(booking.end_date) : 'No end date'}
                                            </p>
                                        </div>
                                    </div>

                                    {booking.special_requirements && (
                                        <div className="mt-4 pt-4 border-t border-stone-100">
                                            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Notes</p>
                                            <p className="text-sm text-stone-600">{booking.special_requirements}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ParentLayout>
    );
}
