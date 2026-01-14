"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, ServiceRequest, User } from '@/types/api';
import { Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import ParentLayout from '@/components/layout/ParentLayout';

import { ReviewModal } from '@/components/reviews/ReviewModal';

export default function ParentBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'requests' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');

    // Review Modal State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Only fetch parent data
            if (user?.role === 'parent') {
                const [bookingsData, requestsData] = await Promise.all([
                    api.bookings.getParentBookings(),
                    api.requests.getParentRequests()
                ]);
                
                // Fetch nanny details for bookings that don't have profile info
                const enrichedBookings = await Promise.all(
                    bookingsData.map(async (booking) => {
                        // If nanny profile already exists, use it
                        if (booking.nanny?.profiles?.first_name) {
                            return booking;
                        }
                        
                        // Otherwise fetch the nanny details
                        if (booking.nanny_id) {
                            try {
                                const nannyDetails = await api.users.get(booking.nanny_id);
                                return {
                                    ...booking,
                                    nanny: nannyDetails
                                };
                            } catch (err) {
                                console.error(`Failed to fetch nanny details for booking ${booking.id}:`, err);
                                return booking;
                            }
                        }
                        return booking;
                    })
                );
                
                // Enrich requests with nanny details if assigned
                const enrichedRequests = await Promise.all(
                    requestsData.map(async (request) => {
                        if (request.nanny_id && !request.nanny) {
                            try {
                                const nannyDetails = await api.users.get(request.nanny_id);
                                console.log(`Fetched details for nanny ${request.nanny_id}:`, nannyDetails);
                                return { ...request, nanny: nannyDetails };
                            } catch (err) {
                                console.error(`Failed to fetch nanny details for request ${request.id}:`, err);
                                return request;
                            }
                        }
                        return request;
                    })
                );
                
                setBookings(enrichedBookings);
                setRequests(enrichedRequests);
                console.log('Fetched Requests:', enrichedRequests);
                console.log('Fetched Bookings:', enrichedBookings);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
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

    const handleOpenReview = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setIsReviewModalOpen(true);
    };

    const getStatusBadgeStyles = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700';
            case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700';
            case 'COMPLETED': return 'bg-stone-100 text-stone-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            case 'PENDING': return 'bg-amber-50 text-amber-600';
            default: return 'bg-stone-100 text-stone-700';
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

    const getNannyName = (nanny?: User) => {
        if (!nanny) return 'Nanny';
        // Handle various potential structures (singular, plural, array)
        const profile = nanny.profiles || (nanny as any).profile || (Array.isArray((nanny as any).profiles) ? (nanny as any).profiles[0] : null);
        
        if (profile?.first_name) {
            return `${profile.first_name} ${profile.last_name || ''}`.trim();
        }
        return nanny.email || 'Nanny';
    };

    const getOtherPartyName = (booking: Booking) => {
        return getNannyName(booking.nanny);
    };

    const renderActionButtons = (booking: Booking) => {
        if (actionLoading === booking.id) {
            return <Spinner />;
        }

        const buttons = [];

        if (booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS') {
            buttons.push(
                <Button
                    key="cancel"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="rounded-xl border-stone-200 hover:bg-stone-50 text-stone-700"
                >
                    Cancel
                </Button>
            );
        }

        if (booking.status === 'COMPLETED') {
            buttons.push(
                <Button
                    key="review"
                    size="sm"
                    onClick={() => handleOpenReview(booking.id)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                >
                    Leave Review
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

    return (
        <ParentLayout>
            <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">My Bookings</h1>
                        <p className="text-stone-500 mt-1">Manage your appointments and requests</p>
                    </div>

                </div>

                {/* Tabs */}
                <div className="flex border-b border-stone-200 overflow-x-auto">
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'requests' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        Requests
                        {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"></div>}
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'upcoming' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming
                        {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"></div>}
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'completed' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed
                        {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"></div>}
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'cancelled' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                        onClick={() => setActiveTab('cancelled')}
                    >
                        Cancelled
                        {activeTab === 'cancelled' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchData} className="bg-emerald-600 hover:bg-emerald-700">Retry</Button>
                    </div>
                ) : activeTab === 'requests' ? (
                    <div className="space-y-6">
                        {requests.filter(r => r.status === 'PENDING').length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50">
                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-600">
                                    <Plus size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">No Requests Yet</h3>
                                <p className="text-stone-500 mb-6 max-w-md mx-auto">You haven't created any service requests yet.</p>

                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {requests.filter(r => r.status === 'PENDING').map((request) => (
                                    <div key={request.id} className="group block bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50 transition-all duration-200 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadgeStyles(request.status)}`}>
                                                    {request.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs text-stone-400 font-medium">
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-stone-900 mb-4 transition-colors">
                                                Care for {request.num_children} Child{request.num_children !== 1 ? 'ren' : ''}
                                            </h3>

                                            <div className="space-y-3 text-sm text-stone-600">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <span>{new Date(request.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                                                        <Clock size={16} />
                                                    </div>
                                                    <span>
                                                        {new Date(request.start_time.includes('T') ? request.start_time : `1970-01-01T${request.start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} ({request.duration_hours} hrs)
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                                                        <MapPin size={16} />
                                                    </div>
                                                    <span className="truncate">{request.location?.address || user?.profiles?.address || 'No location specified'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Bookings List (Upcoming, Completed, Cancelled)
                    // Bookings List (Upcoming, Completed, Cancelled)
                    (() => {
                        const assignedRequests = activeTab === 'upcoming' 
                            ? requests.filter(r => r.status === 'assigned') 
                            : [];
                        
                        const hasItems = filteredBookings.length > 0 || assignedRequests.length > 0;

                        if (!hasItems) {
                            return (
                                <div className="text-center py-16 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50">
                                    <p className="text-stone-500 mb-6">No {activeTab} bookings found.</p>
                                    <Button
                                        onClick={() => window.location.href = '/search'}
                                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Find Care
                                    </Button>
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-4">
                                {/* Assigned Requests Section */}
                                {assignedRequests.map((request) => (
                                    <Link key={request.id} href={`/requests/${request.id}`} className="block group">
                                        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-xl shadow-emerald-100/50 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-2xl transition-shadow relative overflow-hidden">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex-shrink-0 w-16 h-16 bg-emerald-50 rounded-xl flex flex-col items-center justify-center text-emerald-700">
                                                    <span className="text-xs font-bold uppercase">{new Date(request.date).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-xl font-bold">{new Date(request.date).getDate()}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                                                        Care for {request.num_children} Child{request.num_children !== 1 ? 'ren' : ''}
                                                    </h3>
                                                    <p className="text-stone-500 text-sm mb-1">
                                                        Nanny Assigned: <span className="font-bold text-stone-900">
                                                            {getNannyName(request.nanny)}
                                                        </span>
                                                    </p>
                                                    <p className="text-stone-400 text-xs">
                                                        {new Date(request.start_time.includes('T') ? request.start_time : `1970-01-01T${request.start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} ({request.duration_hours} hrs)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {filteredBookings.map((booking) => {
                                    const { day, month } = formatDate(booking.start_time);
                                    return (
                                        <div key={booking.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-2xl transition-shadow">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex-shrink-0 w-16 h-16 bg-stone-100 rounded-xl flex flex-col items-center justify-center text-stone-700">
                                                    <span className="text-xs font-bold uppercase">{month}</span>
                                                    <span className="text-xl font-bold">{day}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-stone-900">
                                                        {booking.job?.title || 'Booking'}
                                                    </h3>
                                                    <p className="text-stone-500 text-sm mb-1">
                                                        with {getOtherPartyName(booking)}
                                                    </p>
                                                    <p className="text-stone-400 text-xs">
                                                        {formatTime(booking.start_time)}
                                                        {booking.end_time && ` - ${formatTime(booking.end_time)}`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyles(booking.status)}`}>
                                                    {booking.status.toLowerCase().replace('_', ' ')}
                                                </span>
                                                {renderActionButtons(booking)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()
                )}

                {selectedBookingId && (
                    <ReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                        bookingId={selectedBookingId}
                        onSuccess={() => {
                            // Optional: Refresh data or show success message
                            fetchData();
                        }}
                    />
                )}
            </div>
        </ParentLayout>
    );
}
