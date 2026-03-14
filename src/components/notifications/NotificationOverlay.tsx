'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Notification } from '@/types/notification';
import { useSocket } from '@/context/SocketProvider';
import { useSSE, SSE_EVENT_TYPES, ServerEvent } from '@/context/SSEProvider';
import { NotificationCard } from './NotificationCard';

interface OverlayNotification extends Notification {
  _overlayId: string;
}

export function NotificationOverlay() {
  const { onNotification, offNotification } = useSocket();
  const { subscribe } = useSSE();
  const [notifications, setNotifications] = useState<OverlayNotification[]>([]);

  const addNotification = (notif: Partial<Notification>) => {
    // Generate a unique ID for the overlay session
    const _overlayId = Math.random().toString(36).substring(2, 9);
    
    // Map basic properties if missing
    const newNotif: OverlayNotification = {
      id: notif.id || `local-${_overlayId}`,
      _overlayId,
      title: notif.title || 'Notification',
      message: notif.message || '',
      type: notif.type || 'info',
      category: notif.category || 'general',
      is_read: false,
      created_at: notif.created_at || new Date().toISOString(),
      user_id: notif.user_id || '',
      related_id: notif.related_id,
    };

    setNotifications((prev) => [...prev, newNotif]);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      removeNotification(_overlayId);
    }, 6000);
  };

  const removeNotification = (overlayId: string) => {
    setNotifications((prev) => prev.filter((n) => n._overlayId !== overlayId));
  };

  // Listen to WebSocket notifications
  useEffect(() => {
    const handleSocketNotification = (data: any) => {
      addNotification(data);
    };

    onNotification(handleSocketNotification);
    return () => {
      offNotification(handleSocketNotification);
    };
  }, [onNotification, offNotification]);

  // Listen to SSE notifications
  useEffect(() => {
    const unsubscribe = subscribe(
      SSE_EVENT_TYPES.NOTIFICATION,
      (data: any) => {
        addNotification(data);
      }
    );
    return () => unsubscribe();
  }, [subscribe]);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif._overlayId}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto w-full"
          >
            <div className="relative group">
              <NotificationCard 
                notification={notif}
                onMarkAsRead={() => removeNotification(notif._overlayId)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notif._overlayId);
                }}
                className="absolute top-2 right-2 p-1 bg-white/50 hover:bg-white rounded-full text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
