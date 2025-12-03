"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Notification, NotificationCategory } from '@/types/notification';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { bookingToNotification, reviewToNotification, groupNotificationsByDate } from '@/lib/notificationHelpers';
import { Bell, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types/api';

type FilterType = 'all' | NotificationCategory;

export default function NannyNotificationsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const allNotifications: Notification[] = [];

            // Fetch nanny bookings and enrich with parent details
            const bookings = await api.bookings.getNannyBookings();
            
            // Enrich bookings with parent details if not already populated
            const enrichedBookings = await Promise.all(
                bookings.map(async (booking) => {
                    // If parent profile already exists, use it
                    if (booking.parent?.profiles?.first_name) {
                        return booking;
                    }
                    // Otherwise fetch the parent details
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

            const bookingNotifs = enrichedBookings
                .filter(b => b.status !== 'REQUESTED')
                .map(b => bookingToNotification(b, user!.id));
            allNotifications.push(...bookingNotifs);

            // Fetch reviews for the nanny
            if (user?.id) {
                try {
                    const reviews = await api.reviews.getByUser(user.id);
                    const reviewNotifs = reviews.map(r => reviewToNotification(r));
                    allNotifications.push(...reviewNotifs);
                } catch (error) {
                    console.log('No reviews found or error fetching reviews');
                }
            }

            // Sort by timestamp (newest first)
            allNotifications.sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            setNotifications(allNotifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, isRead: true }))
        );
    };

    const filteredNotifications = activeFilter === 'all'
        ? notifications
        : notifications.filter(n => n.category === activeFilter);

    const groupedNotifications = groupNotificationsByDate(filteredNotifications);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Bookings', value: 'booking' },
        { label: 'Messages', value: 'message' },
        { label: 'Reviews', value: 'review' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 font-display">Notifications</h1>
                    <p className="text-stone-500 mt-1">
                        Stay updated on your bookings, messages, and reviews
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        onClick={handleMarkAllAsRead}
                        variant="outline"
                        className="rounded-xl border-stone-200 hover:bg-stone-50 text-stone-700"
                    >
                        <CheckCircle2 size={16} className="mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Info Card */}
            {unreadCount > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                    <Bell className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-emerald-800">
                            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-emerald-700 mt-1">
                            Click on a notification to view details or mark it as read.
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {filters.map(filter => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                            activeFilter === filter.value
                                ? 'bg-stone-900 text-white shadow-md'
                                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={40} className="text-emerald-600 animate-spin mb-4" />
                    <p className="text-stone-500">Loading notifications...</p>
                </div>
            ) : groupedNotifications.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-soft border border-stone-100">
                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell size={32} className="text-stone-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">No notifications yet</h3>
                    <p className="text-stone-500">
                        {activeFilter === 'all'
                            ? "You're all caught up! New notifications will appear here."
                            : `No ${activeFilter} notifications to show.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {groupedNotifications.map(group => (
                        <div key={group.date}>
                            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3 px-1">
                                {group.date}
                            </h2>
                            <div className="space-y-3">
                                {group.notifications.map(notification => (
                                    <NotificationCard
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
