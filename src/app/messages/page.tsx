"use client";

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
import { AuthGuard } from '@/components/auth/AuthGuard';

interface ChatWithDetails extends Chat {
    booking?: Booking;
    otherPartyName?: string;
    otherPartyImage?: string;
    lastMessage?: string;
    lastMessageTime?: string;
}

export default function ParentMessagesPage() {
    return (
        <AuthGuard>
            <Suspense fallback={<div className="flex justify-center p-12"><Spinner /></div>}>
                <MessagesContent />
            </Suspense>
        </AuthGuard>
    );
}

function MessagesContent() {
    const { user } = useAuth();
    const { connected, joinRoom, leaveRoom, sendMessage: sendSocketMessage, onNewMessage, offNewMessage, onTyping, offTyping } = useSocket();
    const searchParams = useSearchParams();
    const bookingIdParam = searchParams.get('booking');
    const chatIdParam = searchParams.get('chatId');

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
        if (chats.length > 0) {
            if (chatIdParam) {
                const chat = chats.find(c => c.id === chatIdParam);
                if (chat) setActiveChat(chat);
            } else if (bookingIdParam) {
                const chat = chats.find(c => c.booking_id === bookingIdParam);
                if (chat) setActiveChat(chat);
            }
        }
    }, [bookingIdParam, chatIdParam, chats]);

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
                setMessages(prev => {
                    console.log('Current messages count:', prev.length);
                    // Check if message already exists (by ID or temp ID)
                    const exists = prev.some(m => m.id === message.id);
                    if (exists) {
                        console.log('Message already exists, skipping');
                        return prev;
                    }

                    // Check for optimistic message match (same content, sender)
                    // Relaxed timestamp check to 60 seconds to account for clock skew
                    const optimisticMatchIndex = prev.findIndex(m =>
                        m.id.startsWith('temp-') &&
                        m.content === message.content &&
                        m.sender_id === message.sender_id &&
                        Math.abs(new Date(message.created_at).getTime() - new Date(m.created_at).getTime()) < 60000
                    );

                    if (optimisticMatchIndex !== -1) {
                        console.log('Replacing optimistic message at index:', optimisticMatchIndex);
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
                console.log('Message not for active chat:', message.chat_id, activeChat?.id);
            }
        };

        const handleTyping = (data: { userId: string; isTyping: boolean }) => {
            if (data.userId !== user?.id) {
                setTypingUsers(prev => {
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
            // Get all bookings first
            const bookings = await api.bookings.getParentBookings();
            console.log('Parent bookings fetched:', bookings);

            // Get or create chats for each booking
            const chatPromises = bookings.map(async (booking) => {
                try {
                    const chat = await api.chat.getByBooking(booking.id);

                    // Enrich booking with nanny details if missing
                    let enrichedBooking = booking;
                    if (!booking.nanny?.profiles && booking.nanny_id) {
                        try {
                            const nannyUser = await api.users.get(booking.nanny_id);
                            enrichedBooking = { ...booking, nanny: nannyUser };
                        } catch (e) {
                            console.error(`Failed to fetch nanny details for ${booking.nanny_id}`, e);
                        }
                    }

                    return { ...chat, booking: enrichedBooking };
                } catch (err) {
                    // Chat doesn't exist yet, create it
                    try {
                        const newChat = await api.chat.create({ bookingId: booking.id });

                        // Enrich booking here too
                        let enrichedBooking = booking;
                        if (!booking.nanny?.profiles && booking.nanny_id) {
                            try {
                                const nannyUser = await api.users.get(booking.nanny_id);
                                enrichedBooking = { ...booking, nanny: nannyUser };
                            } catch (e) {
                                console.error(`Failed to fetch nanny details for ${booking.nanny_id}`, e);
                            }
                        }

                        return { ...newChat, booking: enrichedBooking };
                    } catch (createErr) {
                        console.error('Failed to create chat:', createErr);
                        return null;
                    }
                }
            });

            const chatResults = await Promise.all(chatPromises);
            const validChats = chatResults.filter((c): c is Chat & { booking: Booking } => c !== null);

            // Enhance chats with display info
            const enhancedChats: ChatWithDetails[] = validChats.map(chat => {
                const otherParty = chat.booking.nanny;
                console.log('Nanny data for chat:', otherParty);

                // Try multiple ways to get the name
                let otherPartyName = 'Unknown';
                if (otherParty?.profiles?.first_name && otherParty?.profiles?.last_name) {
                    otherPartyName = `${otherParty.profiles.first_name} ${otherParty.profiles.last_name}`;
                } else if (otherParty?.profiles?.first_name) {
                    otherPartyName = otherParty.profiles.first_name;
                } else if (otherParty?.email) {
                    otherPartyName = otherParty.email.split('@')[0];
                }

                const otherPartyImage = otherParty?.profiles?.profile_image_url || '';

                console.log('Chat enhanced with name:', otherPartyName);

                return {
                    ...chat,
                    booking: chat.booking,
                    otherPartyName,
                    otherPartyImage,
                };
            });

            console.log('Enhanced chats:', enhancedChats);
            setChats(enhancedChats);

            // Set first chat as active if none selected
            if (!activeChat && !chatIdParam && !bookingIdParam && enhancedChats.length > 0) {
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
                hasUser: !!user
            });
            return;
        }

        const content = messageInput.trim();
        console.log('Sending message:', {
            chatId: activeChat.id,
            content,
            connected
        });

        // Optimistically add message to UI
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            chat_id: activeChat.id,
            sender_id: user.id,
            content: content,
            is_read: false,
            created_at: new Date().toISOString(),
            sender: user
        };

        setMessages(prev => [...prev, optimisticMessage]);
        scrollToBottom();

        sendSocketMessage(activeChat.id, content);
        setMessageInput('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
    };

    return (
        <div className="min-h-screen bg-neutral-50 pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] bg-white rounded-[32px] border border-neutral-100 shadow-soft overflow-hidden flex">
                {/* Sidebar */}
                <div className="w-80 border-r border-neutral-100 flex flex-col">
                    <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-neutral-900 font-display">Messages</h2>
                        {!connected && (
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Connecting...</span>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Spinner />
                            </div>
                        ) : chats.length === 0 ? (
                            <div className="p-8 text-center text-neutral-500">
                                No conversations yet.
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-neutral-50 ${activeChat?.id === chat.id ? 'bg-primary-50/50 border-r-2 border-primary' : ''
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
                                            <span className={`font-medium truncate ${activeChat?.id === chat.id ? 'text-primary-900' : 'text-neutral-900'}`}>
                                                {chat.otherPartyName}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-500 truncate">
                                            {chat.booking?.job?.title || 'Booking conversation'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
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
                                    <h3 className="font-bold text-neutral-900">{activeChat.otherPartyName}</h3>
                                    <p className="text-xs text-neutral-500">{activeChat.booking?.job?.title}</p>
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

                            <form className="p-4 bg-white border-t border-neutral-100 flex gap-3" onSubmit={handleSendMessage}>
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
        </div>
    );
}
