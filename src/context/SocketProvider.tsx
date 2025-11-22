"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message } from '@/types/api';

interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    joinRoom: (chatId: string) => void;
    leaveRoom: (chatId: string) => void;
    sendMessage: (chatId: string, content: string, attachmentUrl?: string) => void;
    sendTyping: (chatId: string, isTyping: boolean) => void;
    markAsRead: (messageId: string) => void;
    onNewMessage: (callback: (message: Message) => void) => void;
    onTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => void;
    offNewMessage: (callback: (message: Message) => void) => void;
    offTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!user) {
            // Disconnect if user logs out
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        // Initialize socket connection
        const newSocket = io(API_URL, {
            auth: {
                token
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const joinRoom = useCallback((chatId: string) => {
        if (socket && connected) {
            socket.emit('joinRoom', chatId);
            console.log('Joined room:', chatId);
        }
    }, [socket, connected]);

    const leaveRoom = useCallback((chatId: string) => {
        if (socket && connected) {
            socket.emit('leaveRoom', chatId);
            console.log('Left room:', chatId);
        }
    }, [socket, connected]);

    const sendMessage = useCallback((chatId: string, content: string, attachmentUrl?: string) => {
        if (socket && connected) {
            socket.emit('sendMessage', {
                chatId,
                content,
                attachmentUrl
            });
        }
    }, [socket, connected]);

    const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
        if (socket && connected) {
            socket.emit('typing', { chatId, isTyping });
        }
    }, [socket, connected]);

    const markAsRead = useCallback((messageId: string) => {
        if (socket && connected) {
            socket.emit('markAsRead', messageId);
        }
    }, [socket, connected]);

    const onNewMessage = useCallback((callback: (message: Message) => void) => {
        if (socket) {
            socket.on('newMessage', callback);
        }
    }, [socket]);

    const onTyping = useCallback((callback: (data: { userId: string; isTyping: boolean }) => void) => {
        if (socket) {
            socket.on('typing', callback);
        }
    }, [socket]);

    const offNewMessage = useCallback((callback: (message: Message) => void) => {
        if (socket) {
            socket.off('newMessage', callback);
        }
    }, [socket]);

    const offTyping = useCallback((callback: (data: { userId: string; isTyping: boolean }) => void) => {
        if (socket) {
            socket.off('typing', callback);
        }
    }, [socket]);

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
                offTyping
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
