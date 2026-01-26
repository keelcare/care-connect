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
import { ChevronLeft, Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { ParentSidebar } from '@/components/layout/ParentSidebar';
import { Footer } from '@/components/layout/Footer';

type FilterType = 'all' | NotificationCategory;

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Bookings', value: 'booking' },
    { label: 'Messages', value: 'message' },
    { label: 'Reviews', value: 'review' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area with Footer */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}
      >
        <main className="flex-1 pb-8">
          <div className="min-h-screen bg-neutral-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
              {/* Filters & Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setActiveFilter(filter.value)}
                      className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${activeFilter === filter.value
                        ? 'bg-primary text-black shadow-md'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={notifications.every((n) => n.is_read)}
                  className="text-neutral-500 hover:text-primary whitespace-nowrap"
                >
                  Mark all as read
                </Button>
              </div>

              {/* Content */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2
                    size={40}
                    className="text-primary animate-spin mb-4"
                  />
                  <p className="text-neutral-500">Loading notifications...</p>
                </div>
              ) : groupedNotifications.length === 0 ? (
                <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-neutral-100">
                  <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={32} className="text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    No notifications yet
                  </h3>
                  <p className="text-neutral-600">
                    {activeFilter === 'all'
                      ? "You're all caught up! New notifications will appear here."
                      : `No ${activeFilter} notifications to show.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {groupedNotifications.map((group) => (
                    <div key={group.date}>
                      <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wide mb-3 px-1">
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
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
