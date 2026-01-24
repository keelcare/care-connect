'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketProvider';
import { api } from '@/lib/api';
import { Chat, Message, Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import ParentLayout from '@/components/layout/ParentLayout';

interface ChatWithDetails extends Chat {
  booking?: Booking;
  otherPartyName?: string;
  otherPartyImage?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export default function ParentMessagesPage() {
  return (
    <ParentLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 h-[calc(100vh-80px)]">
        <Suspense
          fallback={
            <div className="flex justify-center p-12">
              <Spinner />
            </div>
          }
        >
          <MessagesContent />
        </Suspense>
      </div>
    </ParentLayout>
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
      if (activeChat && message.chat_id === activeChat.id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;

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
            const newMessages = [...prev];
            newMessages[optimisticMatchIndex] = message;
            return newMessages;
          }

          return [...prev, message];
        });
        scrollToBottom();
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

      // Only fetch parent bookings
      if (user?.role !== 'parent') return;

      const allBookings = await api.bookings.getParentBookings();
      const bookings = allBookings.filter(
        (b) => b.status !== 'requested' && b.status !== 'REQUESTED'
      );

      if (bookings.length === 0) {
        setChats([]);
        setLoading(false);
        return;
      }

      const chatPromises = bookings.map(async (booking) => {
        try {
          const chat = await api.chat.getByBooking(booking.id);

          // Enrich booking with details if missing
          let enrichedBooking = booking;
          const targetId = booking.nanny_id;
          const targetProfile = booking.nanny?.profiles;

          if (!targetProfile && targetId) {
            try {
              const userDetails = await api.users.get(targetId);
              enrichedBooking = {
                ...booking,
                nanny: userDetails,
              };
            } catch (e) {
              console.error(`Failed to fetch user details for ${targetId}`, e);
            }
          }

          return { ...chat, booking: enrichedBooking };
        } catch (err) {
          // Chat doesn't exist yet, create it
          try {
            const newChat = await api.chat.create({ bookingId: booking.id });

            let enrichedBooking = booking;
            const targetId = booking.nanny_id;
            const targetProfile = booking.nanny?.profiles;

            if (!targetProfile && targetId) {
              try {
                const userDetails = await api.users.get(targetId);
                enrichedBooking = {
                  ...booking,
                  nanny: userDetails,
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

      const enhancedChats: ChatWithDetails[] = validChats.map((chat) => {
        const otherParty = chat.booking.nanny;

        let otherPartyName = (chat.booking as any).nanny_name || 'Unknown';

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
          otherPartyName,
          otherPartyImage,
          lastMessage: bookingDescription, // Use this field for booking context
        };
      });

      setChats(enhancedChats);

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
    if (!messageInput.trim() || !activeChat || !connected || !user) return;

    const content = messageInput.trim();

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
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-[32px] border border-neutral-100 shadow-soft">
        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
          <Send size={32} />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-neutral-500">Start a booking to begin chatting!</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-[32px] border border-neutral-100 shadow-soft overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-neutral-100 flex flex-col">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 font-display">
            Messages
          </h2>
          {!connected && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Connecting...
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-stone-50 ${activeChat?.id === chat.id
                ? 'bg-stone-100 border-r-2 border-stone-900'
                : ''
                }`}
              onClick={() => setActiveChat(chat)}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100">
                  {chat.otherPartyImage ? (
                    <Image
                      src={chat.otherPartyImage}
                      alt={chat.otherPartyName || 'User'}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold text-lg">
                      {chat.otherPartyName?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                {activeChat?.id === chat.id && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-medium truncate ${activeChat?.id === chat.id ? 'text-stone-900' : 'text-neutral-900'}`}
                  >
                    {chat.otherPartyName}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 truncate">
                  {chat.lastMessage || 'Booking conversation'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-neutral-50/30">
        {activeChat ? (
          <>
            <div className="p-6 bg-white border-b border-neutral-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                {activeChat.otherPartyImage ? (
                  <Image
                    src={activeChat.otherPartyImage}
                    alt={activeChat.otherPartyName || 'User'}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold">
                    {activeChat.otherPartyName?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">
                  {activeChat.otherPartyName}
                </h3>
                <p className="text-xs text-neutral-500">
                  {activeChat.booking?.job?.title}
                </p>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-5 py-3 rounded-2xl ${isMe
                            ? 'bg-white border border-neutral-100 text-neutral-800 rounded-tr-none shadow-sm'
                            : 'bg-white border border-neutral-100 text-neutral-800 rounded-tl-none shadow-sm'
                            }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  {typingUsers.size > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-neutral-100 px-4 py-2 rounded-full text-xs text-neutral-500 animate-pulse">
                        typing...
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <form
              className="p-4 bg-white border-t border-neutral-100 flex gap-3"
              onSubmit={handleSendMessage}
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                value={messageInput}
                onChange={handleInputChange}
                disabled={!connected}
              />
              <Button
                type="submit"
                className="rounded-xl w-12 h-12 p-0 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all"
                disabled={!connected || !messageInput.trim()}
              >
                <Send size={20} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
