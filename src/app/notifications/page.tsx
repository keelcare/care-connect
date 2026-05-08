'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { NotificationCategory } from '@/types/notification';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import {
  groupNotificationsByDate,
} from '@/lib/notificationHelpers';
import { Bell, Loader2, CheckCheck } from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import { motion } from 'framer-motion';
import { useNotificationContext } from '@/context/NotificationContext';

type FilterType = 'all' | NotificationCategory;

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotificationContext();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const isAllRead = notifications.length > 0 && notifications.every((n) => n.is_read);

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
            onClick={markAllAsRead}
            disabled={isAllRead || notifications.length === 0}
            className={`flex items-center gap-2 font-semibold transition-all ${
              isAllRead || notifications.length === 0
                ? 'text-gray-400 cursor-default'
                : 'text-primary hover:text-primary-800 cursor-pointer'
            }`}
          >
            <CheckCheck className="w-5 h-5" />
            {isAllRead ? 'All caught up' : 'Mark all as read'}
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
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-primary/5 rounded-full ring-8 ring-primary/5"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Bell className="w-8 h-8 text-primary" />
              </div>
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
                      onMarkAsRead={markAsRead}
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
