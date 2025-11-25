"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import styles from './page.module.css';

export default function AdminBookingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.admin.getBookings();
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError(err instanceof Error ? err.message : 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-primary-100 text-primary-700';
            case 'IN_PROGRESS': return 'bg-purple-100 text-purple-700';
            case 'COMPLETED': return 'bg-green-100 text-green-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-neutral-100 text-neutral-700';
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-120px)] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchBookings}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/admin')}
                    className="rounded-xl"
                >
                    ← Back to Dashboard
                </Button>
                <h1 className="text-3xl font-bold text-neutral-900 font-display">Booking Management</h1>
            </div>

            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Parent</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Nanny</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Start Time</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">{booking.job?.title || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                                        {booking.parent?.profiles?.first_name && booking.parent?.profiles?.last_name
                                            ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name}`
                                            : booking.parent?.email || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                                        {booking.nanny?.profiles?.first_name && booking.nanny?.profiles?.last_name
                                            ? `${booking.nanny.profiles.first_name} ${booking.nanny.profiles.last_name}`
                                            : booking.nanny?.email || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-neutral-500">{new Date(booking.start_time).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusClass(booking.status)}`}>
                                            {booking.status.toLowerCase().replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                                            className="rounded-lg hover:bg-neutral-50"
                                        >
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
