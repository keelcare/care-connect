'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketProvider';
import { api } from '@/lib/api';
import { Chat, Message, Booking, User } from '@/types/api';
import { logger } from '@/lib/logger';

/**
 * Drives a single booking's chat room. Resolves (or lazily creates) the chat
 * tied to `bookingId`, loads its history, and wires realtime send/receive,
 * optimistic updates, and read receipts over the socket.
 */
export function useBookingChat(bookingId: string) {
  const { user } = useAuth();
  const {
    socket,
    connected,
    joinRoom,
    leaveRoom,
    sendMessage: sendSocketMessage,
    onNewMessage,
    offNewMessage,
  } = useSocket();

  const [chat, setChat] = useState<Chat | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [otherParty, setOtherParty] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve chat + booking + the other participant.
  useEffect(() => {
    if (!user || !bookingId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const bookingData = await api.bookings.get(bookingId);
        if (cancelled) return;
        setBooking(bookingData);

        const isNanny = user.role === 'nanny';
        let party = isNanny ? bookingData.parent : bookingData.nanny;
        const targetId = isNanny
          ? bookingData.parent_id
          : bookingData.nanny_id;
        if (!party?.profiles?.first_name && targetId) {
          try {
            party = await api.users.get(targetId);
          } catch (e) {
            logger.error(`Failed to load chat partner ${targetId}`, e);
          }
        }
        if (!cancelled) setOtherParty(party ?? null);

        // Get the chat (auto-created on assignment); create as a fallback.
        let c: Chat;
        try {
          c = await api.chat.getByBooking(bookingId);
        } catch {
          c = await api.chat.create({ bookingId });
        }
        if (cancelled) return;
        setChat(c);

        // API returns newest-first; reverse to oldest-at-top.
        const msgs = await api.chat.getMessages(c.id);
        if (!cancelled) setMessages([...msgs].reverse());
      } catch (err) {
        logger.error('Failed to open booking chat:', err);
        if (!cancelled) setError('Unable to load this conversation.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, bookingId]);

  // Join/leave the room and mark incoming messages read on open.
  useEffect(() => {
    if (!chat) return;
    joinRoom(chat.id);
    socket?.emit('markChatRead', chat.id);
    return () => leaveRoom(chat.id);
  }, [chat, joinRoom, leaveRoom, socket]);

  // Receive new messages, reconciling optimistic sends.
  useEffect(() => {
    if (!chat) return;

    const handleNewMessage = (message: Message) => {
      if (message.chat_id !== chat.id) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        const optimisticIndex = prev.findIndex(
          (m) =>
            m.id.startsWith('temp-') &&
            m.content === message.content &&
            m.sender_id === message.sender_id
        );
        if (optimisticIndex !== -1) {
          const next = [...prev];
          next[optimisticIndex] = message;
          return next;
        }
        return [...prev, message];
      });
      if (message.sender_id !== user?.id) {
        socket?.emit('markChatRead', chat.id);
      }
    };

    onNewMessage(handleNewMessage);
    return () => offNewMessage(handleNewMessage);
  }, [chat, user?.id, onNewMessage, offNewMessage, socket]);

  // Read receipts.
  useEffect(() => {
    if (!socket || !chat) return;

    const handleChatRead = (data: { chatId: string; messageIds: string[] }) => {
      if (data.chatId !== chat.id) return;
      const ids = new Set(data.messageIds);
      setMessages((prev) =>
        prev.map((m) => (ids.has(m.id) ? { ...m, is_read: true } : m))
      );
    };
    const handleMessageRead = (message: Message) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m))
      );
    };

    socket.on('chatRead', handleChatRead);
    socket.on('messageRead', handleMessageRead);
    return () => {
      socket.off('chatRead', handleChatRead);
      socket.off('messageRead', handleMessageRead);
    };
  }, [socket, chat]);

  const sendChatMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !chat || !connected || !user) return;
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        chat_id: chat.id,
        sender_id: user.id,
        content: trimmed,
        is_read: false,
        created_at: new Date().toISOString(),
        sender: user,
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      sendSocketMessage(chat.id, trimmed);
    },
    [chat, connected, user, sendSocketMessage]
  );

  return {
    chat,
    booking,
    otherParty,
    messages,
    loading,
    error,
    connected,
    sendChatMessage,
  };
}
