'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Send, MessageSquare, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketProvider';
import { api } from '@/lib/api';
import { Chat, Message, Booking, User } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { EnhancedChatWindow } from '@/components/features/EnhancedChatWindow';
import { ChatSidebar } from '@/components/features/ChatSidebar';
import styles from './page.module.css';

interface ChatWithDetails extends Chat {
  booking?: Booking;
  otherParty?: User;
  otherPartyName?: string;
  otherPartyImage?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-12">
          <Spinner />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const { user } = useAuth();
  const {
    connected,
    joinRoom,
    leaveRoom,
    sendMessage: sendSocketMessage,
    onNewMessage,
    offNewMessage,
    onTyping,
    offTyping,
  } = useSocket();
  const searchParams = useSearchParams();
  const bookingIdParam = searchParams.get('booking');

  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [activeChat, setActiveChat] = useState<ChatWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (bookingIdParam && chats.length > 0) {
      const chat = chats.find((c) => c.booking_id === bookingIdParam);
      if (chat) {
        setActiveChat(chat);
      }
    }
  }, [bookingIdParam, chats]);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
      joinRoom(activeChat.id);

      return () => {
        leaveRoom(activeChat.id);
      };
    }
  }, [activeChat]);

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      console.log('Handling new message:', message);
      if (activeChat && message.chat_id === activeChat.id) {
        setMessages((prev) => {
          console.log('Current messages count:', prev.length);
          // Check if message already exists (by ID or temp ID)
          const exists = prev.some((m) => m.id === message.id);
          if (exists) {
            console.log('Message already exists, skipping');
            return prev;
          }

          // Check for optimistic message match (same content, sender)
          // Relaxed timestamp check to 60 seconds to account for clock skew
          const optimisticMatchIndex = prev.findIndex(
            (m) =>
              m.id.startsWith('temp-') &&
              m.content === message.content &&
              m.sender_id === message.sender_id &&
              Math.abs(
                new Date(message.created_at).getTime() -
                new Date(m.created_at).getTime()
              ) < 60000
          );

          if (optimisticMatchIndex !== -1) {
            console.log(
              'Replacing optimistic message at index:',
              optimisticMatchIndex
            );
            // Replace optimistic message with real one
            const newMessages = [...prev];
            newMessages[optimisticMatchIndex] = message;
            return newMessages;
          }

          console.log('Appending new message');
          return [...prev, message];
        });
        scrollToBottom();
      } else {
        console.log(
          'Message not for active chat:',
          message.chat_id,
          activeChat?.id
        );
      }
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    };

    onNewMessage(handleNewMessage);
    onTyping(handleTyping);

    return () => {
      offNewMessage(handleNewMessage);
      offTyping(handleTyping);
    };
  }, [activeChat, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      console.log('Fetching chats for user:', user?.id, 'Role:', user?.role);

      // Get all bookings for nanny
      const allBookings =
        user?.role === 'nanny'
          ? await api.bookings.getNannyBookings()
          : await api.bookings.getParentBookings();

      const bookings = allBookings.filter(
        (b) => b.status !== 'requested' && b.status !== 'REQUESTED'
      );

      console.log('Bookings fetched:', bookings.length, bookings);

      if (bookings.length === 0) {
        console.log('No bookings found, so no chats to fetch.');
        setChats([]);
        setLoading(false);
        return;
      }

      // Get or create chats for each booking
      const chatPromises = bookings.map(async (booking) => {
        try {
          console.log(`Fetching chat for booking ${booking.id}`);
          const chat = await api.chat.getByBooking(booking.id);
          console.log(
            `Found existing chat for booking ${booking.id}:`,
            chat.id
          );

          // Enrich booking with details if missing
          let enrichedBooking = booking;
          const targetId =
            user?.role === 'nanny' ? booking.parent_id : booking.nanny_id;
          const targetProfile =
            user?.role === 'nanny'
              ? booking.parent?.profiles?.first_name
              : booking.nanny?.profiles?.first_name;

          if (!targetProfile && targetId) {
            try {
              console.log(`Fetching missing user details for ${targetId}`);
              const userDetails = await api.users.get(targetId);
              enrichedBooking = {
                ...booking,
                [user?.role === 'nanny' ? 'parent' : 'nanny']: userDetails,
              };
            } catch (e) {
              console.error(`Failed to fetch user details for ${targetId}`, e);
            }
          }

          return { ...chat, booking: enrichedBooking };
        } catch (err) {
          console.log(
            `Chat not found for booking ${booking.id}, creating new one...`
          );
          // Chat doesn't exist yet, create it
          try {
            const newChat = await api.chat.create({ bookingId: booking.id });
            console.log(
              `Created new chat for booking ${booking.id}:`,
              newChat.id
            );

            // Enrich booking here too
            let enrichedBooking = booking;
            const targetId =
              user?.role === 'nanny' ? booking.parent_id : booking.nanny_id;
            const targetProfile =
              user?.role === 'nanny'
                ? booking.parent?.profiles?.first_name
                : booking.nanny?.profiles?.first_name;

            if (!targetProfile && targetId) {
              try {
                const userDetails = await api.users.get(targetId);
                enrichedBooking = {
                  ...booking,
                  [user?.role === 'nanny' ? 'parent' : 'nanny']: userDetails,
                };
              } catch (e) {
                console.error(
                  `Failed to fetch user details for ${targetId}`,
                  e
                );
              }
            }

            return { ...newChat, booking: enrichedBooking };
          } catch (createErr) {
            console.error(
              `Failed to create chat for booking ${booking.id}:`,
              createErr
            );
            return null;
          }
        }
      });

      const chatResults = await Promise.all(chatPromises);
      const validChats = chatResults.filter(
        (c): c is Chat & { booking: Booking } => c !== null
      );
      console.log(`Valid chats found: ${validChats.length}`);

      // Enhance chats with display info
      const enhancedChats: ChatWithDetails[] = validChats.map((chat) => {
        const otherParty =
          user?.role === 'nanny' ? chat.booking.parent : chat.booking.nanny;

        // Try multiple ways to get the name
        let otherPartyName = (chat.booking as any)[user?.role === 'nanny' ? 'parent_name' : 'nanny_name'] || 'Unknown';

        if (otherPartyName === 'Unknown') {
          if (
            otherParty?.profiles?.first_name &&
            otherParty?.profiles?.last_name
          ) {
            otherPartyName = `${otherParty.profiles.first_name} ${otherParty.profiles.last_name}`;
          } else if (otherParty?.profiles?.first_name) {
            otherPartyName = otherParty.profiles.first_name;
          } else if (otherParty?.email) {
            otherPartyName = otherParty.email.split('@')[0];
          }
        }

        const otherPartyImage = otherParty?.profiles?.profile_image_url || '';

        // Create descriptive subtitle with booking details
        let bookingDescription = 'Booking conversation';
        if (chat.booking) {
          const bookingDate = new Date(chat.booking.start_time).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const serviceType = chat.booking.job?.title || 'Care service';
          bookingDescription = `${serviceType} • ${bookingDate}`;
        }

        return {
          ...chat,
          booking: chat.booking,
          otherParty: otherParty || undefined,
          otherPartyName,
          otherPartyImage,
          lastMessage: bookingDescription, // Use this for subtitle context
        };
      });

      console.log('Final enhanced chats:', enhancedChats);
      setChats(enhancedChats);

      // Set first chat as active if none selected
      if (!activeChat && enhancedChats.length > 0) {
        setActiveChat(enhancedChats[0]);
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      setMessagesLoading(true);
      const msgs = await api.chat.getMessages(chatId);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat || !connected || !user) {
      console.log('Cannot send message:', {
        hasInput: !!messageInput.trim(),
        hasActiveChat: !!activeChat,
        connected,
        hasUser: !!user,
      });
      return;
    }

    const content = messageInput.trim();
    console.log('Sending message:', {
      chatId: activeChat.id,
      content,
      connected,
    });

    // Optimistically add message to UI
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: activeChat.id,
      sender_id: user.id,
      content: content,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: user,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    scrollToBottom();

    sendSocketMessage(activeChat.id, content);
    setMessageInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    // TODO: Implement typing indicator
  };

  // Handle sending message from enhanced chat window
  const handleSendMessageFromWindow = (content: string) => {
    if (!activeChat || !connected || !user) return;

    // Optimistically add message to UI
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: activeChat.id,
      sender_id: user.id,
      content: content,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: user,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    sendSocketMessage(activeChat.id, content);
  };

  // Mobile view state
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const handleSelectChat = (chat: ChatWithDetails) => {
    setActiveChat(chat);
    setShowChatOnMobile(true);
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-8 bg-white rounded-[32px] border border-neutral-100 shadow-soft">
        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
          <MessageSquare size={32} />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-neutral-500">Start a booking to begin chatting!</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-[32px] border border-neutral-100 shadow-soft overflow-hidden flex">
      {/* Sidebar - Hidden on mobile when chat is open */}
      <div
        className={`w-full lg:w-80 lg:flex-shrink-0 ${showChatOnMobile ? 'hidden lg:block' : 'block'}`}
      >
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          isConnected={connected}
          isLoading={loading}
          currentUserId={user?.id}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 ${!showChatOnMobile && !activeChat ? 'hidden lg:flex' : 'flex'} flex-col`}
      >
        {activeChat ? (
          <EnhancedChatWindow
            chat={activeChat}
            otherParty={activeChat.otherParty || null}
            messages={messages}
            onSendMessage={handleSendMessageFromWindow}
            onBack={handleBackToList}
            isLoading={messagesLoading}
            showBackButton={true}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400 bg-stone-50/50">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={24} className="text-stone-300" />
              </div>
              <p className="text-stone-500">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
