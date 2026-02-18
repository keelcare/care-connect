'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message } from '@/types/api';

import { useToast } from '@/components/ui/ToastProvider';

interface GeofenceAlertData {
  bookingId: string;
  nannyName: string;
  message: string;
  distance: number;
  radius: number;
  timestamp: string;
  type: 'left_geofence' | 'returned_geofence' | 'approaching';
}

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinRoom: (chatId: string) => void;
  leaveRoom: (chatId: string) => void;
  sendMessage: (
    chatId: string,
    content: string,
    attachmentUrl?: string
  ) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  markAsRead: (messageId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => void;
  onTyping: (
    callback: (data: { userId: string; isTyping: boolean }) => void
  ) => void;
  offNewMessage: (callback: (message: Message) => void) => void;
  offTyping: (
    callback: (data: { userId: string; isTyping: boolean }) => void
  ) => void;
  // Geofence events
  onGeofenceAlert: (callback: (data: GeofenceAlertData) => void) => void;
  offGeofenceAlert: (callback: (data: GeofenceAlertData) => void) => void;
  subscribeToGeofence: (bookingId: string) => void;
  unsubscribeFromGeofence: (bookingId: string) => void;
  // Refresh events for data re-validation
  onRefresh: (callback: (data: { category: string; relatedId?: string }) => void) => void;
  offRefresh: (callback: (data: { category: string; relatedId?: string }) => void) => void;
  // Notification events
  onNotification: (callback: (data: any) => void) => void;
  offNotification: (callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    console.log('Initializing socket connection');
    const newSocket = io(API_URL, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);
    });

    newSocket.on('notification', (notification: any) => {
      console.log('Socket notification received:', notification);

      // Trigger toast
      addToast({
        type: notification.type || 'info',
        title: notification.title || 'Notification',
        message: notification.message || '',
        duration: 6000,
      });

      // Also trigger refresh if category is present
      if (notification.category) {
        newSocket.emit('local:refresh', {
          category: notification.category,
          relatedId: notification.related_id
        });
      }
    });

    newSocket.on('local:refresh', (data: any) => {
      // This is a local-only event to bridge notifications to refresh listeners
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [user, addToast]);

  const joinRoom = useCallback(
    (chatId: string) => {
      socket?.emit('joinRoom', chatId);
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (chatId: string) => {
      socket?.emit('leaveRoom', chatId);
    },
    [socket]
  );

  const sendMessage = useCallback(
    (chatId: string, content: string, attachmentUrl?: string) => {
      socket?.emit('sendMessage', { chatId, content, attachmentUrl });
    },
    [socket]
  );

  const sendTyping = useCallback(
    (chatId: string, isTyping: boolean) => {
      socket?.emit('typing', { chatId, isTyping });
    },
    [socket]
  );

  const markAsRead = useCallback(
    (messageId: string) => {
      socket?.emit('markAsRead', messageId);
    },
    [socket]
  );

  const onNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      socket?.on('newMessage', callback);
    },
    [socket]
  );

  const offNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      socket?.off('newMessage', callback);
    },
    [socket]
  );

  const onTyping = useCallback(
    (callback: (data: { userId: string; isTyping: boolean }) => void) => {
      socket?.on('typing', callback);
    },
    [socket]
  );

  const offTyping = useCallback(
    (callback: (data: { userId: string; isTyping: boolean }) => void) => {
      socket?.off('typing', callback);
    },
    [socket]
  );

  const onGeofenceAlert = useCallback(
    (callback: (data: GeofenceAlertData) => void) => {
      socket?.on('geofence:alert', callback);
    },
    [socket]
  );

  const offGeofenceAlert = useCallback(
    (callback: (data: GeofenceAlertData) => void) => {
      socket?.off('geofence:alert', callback);
    },
    [socket]
  );

  const subscribeToGeofence = useCallback(
    (bookingId: string) => {
      socket?.emit('geofence:subscribe', { bookingId });
    },
    [socket]
  );

  const unsubscribeFromGeofence = useCallback(
    (bookingId: string) => {
      socket?.emit('geofence:unsubscribe', { bookingId });
    },
    [socket]
  );

  const onNotification = useCallback(
    (callback: (data: any) => void) => {
      socket?.on('notification', callback);
    },
    [socket]
  );

  const offNotification = useCallback(
    (callback: (data: any) => void) => {
      socket?.off('notification', callback);
    },
    [socket]
  );

  const onRefresh = useCallback(
    (callback: (data: any) => void) => {
      socket?.on('local:refresh', callback);
    },
    [socket]
  );

  const offRefresh = useCallback(
    (callback: (data: any) => void) => {
      socket?.off('local:refresh', callback);
    },
    [socket]
  );

  const value = React.useMemo(
    () => ({
      socket,
      connected,
      joinRoom,
      leaveRoom,
      sendMessage,
      sendTyping,
      markAsRead,
      onNewMessage,
      onTyping,
      offNewMessage,
      offTyping,
      onGeofenceAlert,
      offGeofenceAlert,
      subscribeToGeofence,
      unsubscribeFromGeofence,
      onNotification,
      offNotification,
      onRefresh,
      offRefresh,
    }),
    [
      socket,
      connected,
      joinRoom,
      leaveRoom,
      sendMessage,
      sendTyping,
      markAsRead,
      onNewMessage,
      onTyping,
      offNewMessage,
      offTyping,
      onGeofenceAlert,
      offGeofenceAlert,
      subscribeToGeofence,
      unsubscribeFromGeofence,
      onNotification,
      offNotification,
      onRefresh,
      offRefresh,
    ]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
