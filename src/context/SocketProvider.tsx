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
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    console.log('Initializing socket connection with cookies');
    // Initialize socket connection
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

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    // Debug all incoming events
    newSocket.onAny((event, ...args) => {
      console.log('Socket received event:', event, args);
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
      setConnected(false);
    };
  }, [user]);

  const joinRoom = useCallback(
    (chatId: string) => {
      if (socket && connected) {
        console.log('Emitting joinRoom:', chatId);
        socket.emit('joinRoom', chatId);
      } else {
        console.warn('Cannot join room: Socket not connected');
      }
    },
    [socket, connected]
  );

  const leaveRoom = useCallback(
    (chatId: string) => {
      if (socket && connected) {
        console.log('Emitting leaveRoom:', chatId);
        socket.emit('leaveRoom', chatId);
      }
    },
    [socket, connected]
  );

  const sendMessage = useCallback(
    (chatId: string, content: string, attachmentUrl?: string) => {
      if (socket && connected) {
        console.log('Emitting sendMessage:', { chatId, content });
        socket.emit('sendMessage', {
          chatId,
          content,
          attachmentUrl,
        });
      } else {
        console.error('Cannot send message: Socket not connected');
      }
    },
    [socket, connected]
  );

  const sendTyping = useCallback(
    (chatId: string, isTyping: boolean) => {
      if (socket && connected) {
        socket.emit('typing', { chatId, isTyping });
      }
    },
    [socket, connected]
  );

  const markAsRead = useCallback(
    (messageId: string) => {
      if (socket && connected) {
        socket.emit('markAsRead', messageId);
      }
    },
    [socket, connected]
  );

  const onNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (socket) {
        socket.on('newMessage', callback);
      }
    },
    [socket]
  );

  const onTyping = useCallback(
    (callback: (data: { userId: string; isTyping: boolean }) => void) => {
      if (socket) {
        socket.on('typing', callback);
      }
    },
    [socket]
  );

  const offNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (socket) {
        socket.off('newMessage', callback);
      }
    },
    [socket]
  );

  const offTyping = useCallback(
    (callback: (data: { userId: string; isTyping: boolean }) => void) => {
      if (socket) {
        socket.off('typing', callback);
      }
    },
    [socket]
  );

  // Geofence event handlers
  const onGeofenceAlert = useCallback(
    (callback: (data: GeofenceAlertData) => void) => {
      if (socket) {
        socket.on('geofence:alert', callback);
      }
    },
    [socket]
  );

  const offGeofenceAlert = useCallback(
    (callback: (data: GeofenceAlertData) => void) => {
      if (socket) {
        socket.off('geofence:alert', callback);
      }
    },
    [socket]
  );

  const subscribeToGeofence = useCallback(
    (bookingId: string) => {
      if (socket && connected) {
        console.log('Subscribing to geofence alerts for booking:', bookingId);
        socket.emit('geofence:subscribe', { bookingId });
      }
    },
    [socket, connected]
  );

  const unsubscribeFromGeofence = useCallback(
    (bookingId: string) => {
      if (socket && connected) {
        console.log(
          'Unsubscribing from geofence alerts for booking:',
          bookingId
        );
        socket.emit('geofence:unsubscribe', { bookingId });
      }
    },
    [socket, connected]
  );

  return (
    <SocketContext.Provider
      value={{
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
