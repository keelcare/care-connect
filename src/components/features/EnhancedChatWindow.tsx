'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Send,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketProvider';
import { Message, Chat, User } from '@/types/api';
import { Button } from '@/components/ui/button';

interface ChatWindowProps {
  chat: Chat;
  otherParty: User | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
  showBackButton?: boolean;
}

export function EnhancedChatWindow({
  chat,
  otherParty,
  messages,
  onSendMessage,
  onBack,
  isLoading = false,
  showBackButton = false,
}: ChatWindowProps) {
  const { user } = useAuth();
  const { connected, sendTyping, onTyping, offTyping } = useSocket();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const otherPartyName =
    otherParty?.profiles?.first_name && otherParty?.profiles?.last_name
      ? `${otherParty.profiles.first_name} ${otherParty.profiles.last_name}`
      : otherParty?.email?.split('@')[0] || 'Unknown';

  const otherPartyImage = otherParty?.profiles?.profile_image_url;

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    onTyping(handleTyping);
    return () => offTyping(handleTyping);
  }, [user?.id, onTyping, offTyping]);

  // Handle input change with typing indicator
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMessageInput(value);

      // Send typing indicator
      if (value && !isTyping) {
        setIsTyping(true);
        sendTyping(chat.id, true);
      }

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing indicator after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTyping(chat.id, false);
      }, 2000);
    },
    [chat.id, isTyping, sendTyping]
  );

  // Handle send message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !connected) return;

    onSendMessage(messageInput.trim());
    setMessageInput('');
    setIsTyping(false);
    sendTyping(chat.id, false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date for message grouping
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = formatDate(message.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, Message[]>
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors lg:hidden"
          >
            <ChevronLeft size={20} className="text-neutral-600" />
          </button>
        )}

        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100">
            {otherPartyImage ? (
              <Image
                src={otherPartyImage}
                alt={otherPartyName}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold">
                {otherPartyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {connected && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary-900 truncate">
            {otherPartyName}
          </h3>
          <p className="text-xs text-neutral-500">
            {otherUserTyping ? (
              <span className="text-primary-600">typing...</span>
            ) : connected ? (
              'Online'
            ) : (
              'Offline'
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500">
            <Search size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <Send size={24} className="text-neutral-300" />
            </div>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-neutral-200/60 text-neutral-500 text-xs font-medium px-3 py-1 rounded-full">
                  {date}
                </div>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((message, index) => {
                const isMe = message.sender_id === user?.id;
                const showAvatar =
                  !isMe &&
                  (index === 0 ||
                    dateMessages[index - 1]?.sender_id !== message.sender_id);

                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}
                  >
                    {!isMe && (
                      <div className="w-8 mr-2 flex-shrink-0">
                        {showAvatar && (
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200">
                            {otherPartyImage ? (
                              <Image
                                src={otherPartyImage}
                                alt={otherPartyName}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-bold">
                                {otherPartyName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${isMe
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-white text-neutral-800 rounded-bl-md shadow-sm border border-neutral-100'
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      <p
                        className={`text-[10px] mt-1 px-1 ${isMe ? 'text-right text-neutral-400' : 'text-neutral-400'
                          }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {otherUserTyping && (
          <div className="flex items-center gap-2 ml-10">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-neutral-100">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-neutral-100"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400"
          >
            <Smile size={22} />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={!connected}
              className="w-full px-4 py-2.5 bg-neutral-50 rounded-full border-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all text-sm placeholder:text-neutral-400"
            />
          </div>

          <Button
            type="submit"
            disabled={!connected || !messageInput.trim()}
            className="w-10 h-10 rounded-full p-0 flex items-center justify-center bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors"
          >
            <Send size={18} />
          </Button>
        </div>

        {!connected && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            Connecting to chat server...
          </p>
        )}
      </form>
    </div>
  );
}
