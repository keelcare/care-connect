"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, MessageSquare, Star, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';

interface DashboardStats {
    totalBookings: number;
    unreadMessages: number;
    hoursOfCare: number;
    averageRating: number;
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        unreadMessages: 0,
        hoursOfCare: 0,
        averageRating: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (user) {
            if (user.role === 'nanny') {
                fetchDashboardData();
            } else {
                router.push('/browse');
                setLoading(false);
            }
        }
    }, [user, authLoading]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [bookingsData, userData] = await Promise.all([
                api.bookings.getNannyBookings(),
                user?.id ? api.users.get(user.id) : Promise.resolve(null)
            ]);

            // Enrich bookings with parent details if not already populated
            const enrichedBookings = await Promise.all(
                bookingsData.map(async (booking) => {
                    // If parent profile info is already populated, return as-is
                    if (booking.parent?.profiles?.first_name) {
                        return booking;
                    }
                    // If we have a parent_id, fetch the parent details
                    if (booking.parent_id) {
                        try {
                            const parentDetails = await api.users.get(booking.parent_id);
                            return { ...booking, parent: parentDetails };
                        } catch (err) {
                            console.error(`Failed to fetch parent details for booking ${booking.id}:`, err);
                            return booking;
                        }
                    }
                    return booking;
                })
            );

            setBookings(enrichedBookings);

            const totalBookings = bookingsData.length;
            const completedBookings = bookingsData.filter(b => b.status === 'COMPLETED');

            let totalHours = 0;
            completedBookings.forEach(booking => {
                if (booking.start_time && booking.end_time) {
                    const start = new Date(booking.start_time);
                    const end = new Date(booking.end_time);
                    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    totalHours += hours;
                }
            });

            const averageRating = (userData as any)?.averageRating || 0;

            setStats({
                totalBookings,
                unreadMessages: 0,
                hoursOfCare: Math.round(totalHours),
                averageRating: averageRating,
            });
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate().toString(),
            month: date.toLocaleString('default', { month: 'short' })
        };
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getParentName = (booking: Booking) => {
        return booking.parent?.profiles?.first_name && booking.parent?.profiles?.last_name
            ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name}`
            : booking.parent?.email || 'Parent';
    };

    const handleMessageBooking = async (booking: Booking) => {
        try {
            const chat = await api.chat.create({ bookingId: booking.id });
            router.push(`/messages?chatId=${chat.id}`);
        } catch (err) {
            console.error('Failed to start chat:', err);
        }
    };

    const upcomingBookings = bookings
        .filter(b => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 3);

    const statsDisplay = [
        { label: 'Total Bookings', value: stats.totalBookings.toString(), icon: Calendar, color: 'text-stone-900', bg: 'bg-stone-100' },
        { label: 'Unread Messages', value: stats.unreadMessages.toString(), icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Hours of Care', value: stats.hoursOfCare.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Average Rating', value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', href: '/nanny/reviews' },
    ];

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchDashboardData}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 font-display">Dashboard Overview</h1>
                    <p className="text-stone-500 mt-1">
                        Welcome back, {user?.profiles?.first_name || 'User'}! Here's what's happening today.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsDisplay.map((stat, index) => {
                    const Icon = stat.icon;
                    // @ts-ignore - Adding href to stat object dynamically
                    const href = stat.href;

                    const CardContent = () => (
                        <div className={`bg-white p-6 rounded-[24px] border border-stone-100 shadow-soft hover:shadow-md transition-shadow ${href ? 'cursor-pointer' : ''}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-500">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <Icon size={20} className={stat.color} />
                                </div>
                            </div>
                        </div>
                    );

                    if (href) {
                        return (
                            <Link key={index} href={href}>
                                <CardContent />
                            </Link>
                        );
                    }

                    return <div key={index}><CardContent /></div>;
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Bookings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-stone-900 font-display">Upcoming Bookings</h2>
                        <Link href="/dashboard/bookings">
                            <Button variant="ghost" size="sm" className="text-stone-600 hover:text-stone-900 hover:bg-stone-100">
                                View All <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </Link>
                    </div>

                    {upcomingBookings.length === 0 ? (
                        <div className="bg-white rounded-[24px] border border-stone-100 shadow-soft p-12 text-center">
                            <p className="text-stone-500">No upcoming bookings yet.</p>
                        </div>
                    ) : (
                        <>
                            {/* Next Booking Card with Gradient Border */}
                            <div className="p-[2px] rounded-[26px] bg-gradient-to-r from-stone-900 to-stone-700 shadow-md">
                                <div className="bg-white rounded-[24px] p-6">
                                    <div className="flex items-center gap-2 mb-4 text-stone-900 font-bold text-sm uppercase tracking-wider">
                                        <Star size={14} fill="currentColor" /> Next Booking
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                        <div className="flex-shrink-0 w-20 h-20 bg-stone-100 rounded-2xl flex flex-col items-center justify-center text-stone-900">
                                            <span className="text-xs font-bold uppercase">{formatDate(upcomingBookings[0].start_time).month}</span>
                                            <span className="text-2xl font-bold">{formatDate(upcomingBookings[0].start_time).day}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-stone-900 mb-2">
                                                {upcomingBookings[0].job?.title || 'Booking'}
                                            </h3>
                                            <p className="text-stone-500 text-sm mb-2">
                                                with <span className="font-medium text-stone-700">{getParentName(upcomingBookings[0])}</span>
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-stone-500 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={16} />
                                                    {formatTime(upcomingBookings[0].start_time)}
                                                    {upcomingBookings[0].end_time && ` - ${formatTime(upcomingBookings[0].end_time)}`}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    {upcomingBookings[0].status}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className="rounded-xl"
                                            onClick={() => handleMessageBooking(upcomingBookings[0])}
                                        >
                                            <MessageSquare size={16} className="mr-2" />
                                            Message
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Other Bookings */}
                            {upcomingBookings.length > 1 && (
                                <div className="bg-white rounded-[24px] border border-stone-100 shadow-soft overflow-hidden">
                                    <div className="divide-y divide-stone-100">
                                        {upcomingBookings.slice(1).map((booking) => {
                                            const { day, month } = formatDate(booking.start_time);
                                            return (
                                                <div key={booking.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-stone-50 transition-colors">
                                                    <div className="flex-shrink-0 w-14 h-14 bg-stone-50 rounded-xl flex flex-col items-center justify-center text-stone-600">
                                                        <span className="text-[10px] font-bold uppercase">{month}</span>
                                                        <span className="text-lg font-bold">{day}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-base font-bold text-stone-900 truncate">
                                                            {booking.job?.title || 'Booking'}
                                                        </h4>
                                                        <p className="text-stone-500 text-xs mb-1">
                                                            with {getParentName(booking)}
                                                        </p>
                                                        <p className="text-stone-500 flex items-center gap-2 mt-1 text-sm">
                                                            <Clock size={14} />
                                                            {formatTime(booking.start_time)}
                                                            {booking.end_time && ` - ${formatTime(booking.end_time)}`}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'CONFIRMED'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-stone-100 text-stone-700'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleMessageBooking(booking)}
                                                            className="rounded-xl"
                                                        >
                                                            <MessageSquare size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Recent Activity / Notifications Placeholder */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-stone-900 font-display">Recent Activity</h2>
                    <div className="bg-white rounded-[24px] border border-stone-100 shadow-soft p-6 space-y-6">
                        <p className="text-sm text-stone-500 text-center py-4">
                            Activity feed coming soon
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
