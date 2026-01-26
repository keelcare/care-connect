'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Notification, NotificationCategory } from '@/types/notification';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import {
  bookingToNotification,
  reviewToNotification,
  groupNotificationsByDate,
} from '@/lib/notificationHelpers';
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
      const data = await api.enhancedNotifications.list();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.enhancedNotifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.enhancedNotifications.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.category === activeFilter);

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
          <h1 className="text-3xl font-bold text-stone-900 font-display">
            Notifications
          </h1>
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
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-emerald-700 mt-1">
              Click on a notification to view details or mark it as read.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeFilter === filter.value
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
          <h3 className="text-xl font-bold text-stone-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-stone-500">
            {activeFilter === 'all'
              ? "You're all caught up! New notifications will appear here."
              : `No ${activeFilter} notifications to show.`}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedNotifications.map((group) => (
            <div key={group.date}>
              <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3 px-1">
                {group.date}
              </h2>
              <div className="space-y-3">
                {group.notifications.map((notification) => (
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
