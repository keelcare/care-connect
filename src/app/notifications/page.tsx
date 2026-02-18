'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Notification, NotificationCategory } from '@/types/notification';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import {
  groupNotificationsByDate,
} from '@/lib/notificationHelpers';
import { Bell, Loader2, CheckCheck } from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import { motion } from 'framer-motion';
import { useSocket } from '@/context/SocketProvider';

type FilterType = 'all' | NotificationCategory;

export default function NotificationsPage() {
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
    try {
      const data = await api.enhancedNotifications.list();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const { onRefresh, offRefresh } = useSocket();

  useEffect(() => {
    const handleRefresh = (data: any) => {
      console.log('Real-time refresh triggered in Notifications Page:', data);
      // Refresh notifications for ANY refresh event (new message, new booking etc)
      fetchNotifications();
    };

    onRefresh(handleRefresh);
    return () => offRefresh(handleRefresh);
  }, [onRefresh, offRefresh]);

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

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Bookings', value: 'booking' },
    { label: 'Messages', value: 'message' },
    { label: 'Reviews', value: 'review' },
  ];

  return (
    <ParentLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] font-display">
              Notifications
            </h1>
            <p className="text-gray-600 mt-1 font-body">
              Stay updated with your bookings and messages
            </p>
          </div>

          <button
            onClick={handleMarkAllAsRead}
            disabled={notifications.every((n) => n.is_read)}
            className="flex items-center gap-2 text-primary hover:text-primary-800 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-5 h-5" />
            Mark all as read
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${activeFilter === filter.value
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-body">Loading notifications...</p>
          </div>
        ) : groupedNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-display">
              No notifications yet
            </h3>
            <p className="text-gray-600 font-body">
              {activeFilter === 'all'
                ? "You're all caught up! New notifications will appear here."
                : `No ${activeFilter} notifications to show.`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {groupedNotifications.map((group) => (
              <motion.div
                key={group.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                  {group.date}
                </h2>
                <div className="space-y-4">
                  {group.notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
