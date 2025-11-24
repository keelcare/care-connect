"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Link from 'next/link';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { CancellationModal } from '@/components/features/CancellationModal';
import { BookingDetailsModal } from '@/components/features/BookingDetailsModal';

export default function ParentBookingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

    // Modal States
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.bookings.getParentBookings();

            // Enrich bookings with nanny details if missing
            const enrichedData = await Promise.all(data.map(async (booking) => {
                if (!booking.nanny?.profiles && booking.nanny_id) {
                    try {
                        const nannyUser = await api.users.get(booking.nanny_id);
                        return { ...booking, nanny: nannyUser };
                    } catch (e) {
                        console.error(`Failed to fetch nanny details for ${booking.nanny_id}`, e);
                        return booking;
                    }
                }
                return booking;
            }));

            setBookings(enrichedData);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError(err instanceof Error ? err.message : 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCancelModal = (booking: Booking, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedBooking(booking);
        setIsCancelModalOpen(true);
        // If details modal is open, close it
        setIsDetailsModalOpen(false);
    };

    const handleConfirmCancel = async (reason: string) => {
        if (!selectedBooking) return;

        try {
            setActionLoading(selectedBooking.id);
            const updated = await api.bookings.cancel(selectedBooking.id, { reason });

            // Re-fetch or update local state carefully
            setBookings(prev => prev.map(b => {
                if (b.id === selectedBooking.id) {
                    return { ...b, status: 'CANCELLED', cancellation_reason: reason };
                }
                return b;
            }));

            setIsCancelModalOpen(false);
            setSelectedBooking(null);
        } catch (err) {
            console.error('Failed to cancel booking:', err);
            alert(err instanceof Error ? err.message : 'Failed to cancel booking');
        } finally {
            setActionLoading(null);
        }
    };

    const handleOpenDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDetailsModalOpen(true);
    };

    const handleMessage = async (booking: Booking, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            // Create or get chat
            const chat = await api.chat.create({ bookingId: booking.id });
            router.push(`/messages?chatId=${chat.id}`);
        } catch (err) {
            console.error('Failed to start chat:', err);
            // Fallback to just messages page
            router.push('/messages');
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
        return booking.nanny?.profiles?.first_name && booking.nanny?.profiles?.last_name
            ? `${booking.nanny.profiles.first_name} ${booking.nanny.profiles.last_name}`
            : booking.nanny?.profiles?.first_name
                ? booking.nanny.profiles.first_name
                : booking.nanny?.email?.split('@')[0] || 'Nanny';
    };

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'upcoming') return ['CONFIRMED', 'IN_PROGRESS', 'PENDING'].includes(booking.status);
        if (activeTab === 'completed') return booking.status === 'COMPLETED';
        if (activeTab === 'cancelled') return booking.status === 'CANCELLED';
        return true;
    });

    return (
        <AuthGuard>
            <div className="min-h-screen bg-neutral-50 pt-28 pb-20 px-4 md:px-8">
                <div className="max-w-5xl mx-auto space-y-8">
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

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={fetchBookings}>Retry</Button>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-[24px] border border-neutral-100 shadow-soft">
                            <p className="text-neutral-500 mb-6">No {activeTab} bookings found.</p>
                            <Link href="/browse">
                                <Button className="rounded-xl">
                                    Find Care
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => {
                                const { day, month } = formatDate(booking.start_time);
                                return (
                                    <div
                                        key={booking.id}
                                        onClick={() => handleOpenDetails(booking)}
                                        className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="flex-shrink-0 w-16 h-16 bg-primary-50 rounded-2xl flex flex-col items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <span className="text-xs font-bold uppercase">{month}</span>
                                                <span className="text-xl font-bold">{day}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary transition-colors">
                                                    {booking.job?.title || `Booking with ${getOtherPartyName(booking)}`}
                                                </h3>
                                                <p className="text-neutral-500 text-sm mb-1">
                                                    with <span className="font-medium text-neutral-700">{getOtherPartyName(booking)}</span>
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

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => handleMessage(booking, e)}
                                                    className="rounded-xl text-neutral-500 hover:text-primary hover:bg-primary-50"
                                                >
                                                    <MessageSquare size={18} />
                                                </Button>

                                                {(booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS') && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => handleOpenCancelModal(booking, e)}
                                                        className="rounded-xl border-neutral-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}

                                                <ChevronRight size={20} className="text-neutral-300 group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <CancellationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                loading={!!actionLoading}
            />

            <BookingDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                booking={selectedBooking}
                onMessage={(booking) => handleMessage(booking)}
                onCancel={(booking) => handleOpenCancelModal(booking)}
                loading={!!actionLoading}
            />
        </AuthGuard>
    );
}
