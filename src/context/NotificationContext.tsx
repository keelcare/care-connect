'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSSE, SSE_EVENT_TYPES, ServerEvent } from '@/context/SSEProvider';
import { useSocket } from '@/context/SocketProvider';
import { api } from '@/lib/api';
import { Notification } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addLocalNotification: (notif: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { subscribe } = useSSE();
  const { onNotification, offNotification } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.enhancedNotifications.list();
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Add individual notification dynamically (e.g. from Socket or SSE)
  const addLocalNotification = useCallback((notifRaw: any) => {
    const newNotif: Notification = {
      id: notifRaw.id || `local-${Math.random().toString(36).substring(2, 9)}`,
      title: notifRaw.title || 'Notification',
      message: notifRaw.message || '',
      type: notifRaw.type || 'info',
      category: notifRaw.category || 'general',
      is_read: false,
      created_at: notifRaw.created_at || new Date().toISOString(),
      user_id: notifRaw.user_id || user?.id || '',
      related_id: notifRaw.related_id,
    };
    
    setNotifications((prev) => {
      // Prevent duplicates by ID comparison
      if (prev.some(n => n.id === newNotif.id)) return prev;
      return [newNotif, ...prev];
    });
  }, [user]);

  // Sync with WebSockets
  useEffect(() => {
    const handleSocketNotification = (data: any) => {
      addLocalNotification(data);
    };

    onNotification(handleSocketNotification);
    return () => {
      offNotification(handleSocketNotification);
    };
  }, [onNotification, offNotification, addLocalNotification]);

  // Sync with SSE
  useEffect(() => {
    const handleSseNotification = (data: any) => {
      addLocalNotification(data);
    };

    // Generic refresh triggers that don't pass the full notification payload,
    // so we just reload from the DB.
    const handleRefresh = () => {
      fetchNotifications();
    };

    const unsubscribers = [
      subscribe(SSE_EVENT_TYPES.NOTIFICATION, handleSseNotification),
      subscribe(SSE_EVENT_TYPES.BOOKING_CREATED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_UPDATED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_STARTED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_COMPLETED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_CANCELLED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.ASSIGNMENT_ACCEPTED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.REQUEST_MATCHED, handleRefresh),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [subscribe, fetchNotifications, addLocalNotification]);

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      await api.enhancedNotifications.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Fallback
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      await api.enhancedNotifications.markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      // Fallback
      fetchNotifications();
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      addLocalNotification,
    }),
    [
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      addLocalNotification,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
