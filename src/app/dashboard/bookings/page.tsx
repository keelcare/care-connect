"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import styles from './page.module.css';

export default function BookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);

            let data: Booking[];
            if (user?.role === 'nanny') {
                data = await api.bookings.getNannyBookings();
            } else {
                data = await api.bookings.getParentBookings();
            }

            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError(err instanceof Error ? err.message : 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStartBooking = async (bookingId: string) => {
        try {
            setActionLoading(bookingId);
            const updated = await api.bookings.start(bookingId);
            setBookings(bookings.map(b => b.id === bookingId ? updated : b));
        } catch (err) {
            console.error('Failed to start booking:', err);
            alert(err instanceof Error ? err.message : 'Failed to start booking');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCompleteBooking = async (bookingId: string) => {
        try {
            setActionLoading(bookingId);
            const updated = await api.bookings.complete(bookingId);
            setBookings(bookings.map(b => b.id === bookingId ? updated : b));
        } catch (err) {
            console.error('Failed to complete booking:', err);
            alert(err instanceof Error ? err.message : 'Failed to complete booking');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        try {
            setActionLoading(bookingId);
            const updated = await api.bookings.cancel(bookingId, { reason });
            setBookings(bookings.map(b => b.id === bookingId ? updated : b));
        } catch (err) {
            console.error('Failed to cancel booking:', err);
            alert(err instanceof Error ? err.message : 'Failed to cancel booking');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadgeStyles = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
            case 'COMPLETED': return 'bg-neutral-100 text-neutral-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-neutral-100 text-neutral-700';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' })
        };
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getOtherPartyName = (booking: Booking) => {
        if (user?.role === 'nanny') {
            return booking.parent?.profiles?.first_name && booking.parent?.profiles?.last_name
                ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name}`
                : booking.parent?.email || 'Parent';
        } else {
            return booking.nanny?.profiles?.first_name && booking.nanny?.profiles?.last_name
                ? `${booking.nanny.profiles.first_name} ${booking.nanny.profiles.last_name}`
                : booking.nanny?.email || 'Nanny';
        }
    };

    const renderActionButtons = (booking: Booking) => {
        if (actionLoading === booking.id) {
            return <Spinner />;
        }

        const buttons = [];

        if (booking.status === 'CONFIRMED' && user?.role === 'nanny') {
            buttons.push(
                <Button
                    key="start"
                    size="sm"
                    onClick={() => handleStartBooking(booking.id)}
                    className="rounded-xl"
                >
                    Start
                </Button>
            );
        }

        if (booking.status === 'IN_PROGRESS') {
            buttons.push(
                <Button
                    key="complete"
                    size="sm"
                    onClick={() => handleCompleteBooking(booking.id)}
                    className="rounded-xl"
                >
                    Complete
                </Button>
            );
        }

        if (booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS') {
            buttons.push(
                <Button
                    key="cancel"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="rounded-xl border-neutral-200"
                >
                    Cancel
                </Button>
            );
        }

        return buttons.length > 0 ? <div className="flex gap-2">{buttons}</div> : null;
    };

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'upcoming') return ['CONFIRMED', 'IN_PROGRESS', 'PENDING'].includes(booking.status);
        if (activeTab === 'completed') return booking.status === 'COMPLETED';
        if (activeTab === 'cancelled') return booking.status === 'CANCELLED';
        return true;
    });

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">My Bookings</h1>
                </div>
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">My Bookings</h1>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchBookings}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 font-display">My Bookings</h1>
                <p className="text-neutral-500 mt-1">Manage your upcoming and past appointments</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200">
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'upcoming' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                    {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                </button>
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'completed' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed
                    {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                </button>
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'cancelled' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                    onClick={() => setActiveTab('cancelled')}
                >
                    Cancelled
                    {activeTab === 'cancelled' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                </button>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[24px] border border-neutral-100 shadow-soft">
                    <p className="text-neutral-500 mb-6">No {activeTab} bookings found.</p>
                    <Button
                        onClick={() => window.location.href = user?.role === 'nanny' ? '/dashboard' : '/search'}
                        className="rounded-xl"
                    >
                        {user?.role === 'nanny' ? 'View Jobs' : 'Find Care'}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                        const { day, month } = formatDate(booking.start_time);
                        return (
                            <div key={booking.id} className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex-shrink-0 w-16 h-16 bg-primary-50 rounded-2xl flex flex-col items-center justify-center text-primary">
                                        <span className="text-xs font-bold uppercase">{month}</span>
                                        <span className="text-xl font-bold">{day}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-900">
                                            {booking.job?.title || 'Booking'}
                                        </h3>
                                        <p className="text-neutral-500 text-sm mb-1">
                                            with {getOtherPartyName(booking)}
                                        </p>
                                        <p className="text-neutral-400 text-xs">
                                            {formatTime(booking.start_time)}
                                            {booking.end_time && ` - ${formatTime(booking.end_time)}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-neutral-100 pt-4 md:pt-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyles(booking.status)}`}>
                                        {booking.status.toLowerCase().replace('_', ' ')}
                                    </span>
                                    {renderActionButtons(booking)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
