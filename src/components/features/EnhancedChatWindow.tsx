'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Send, MoreVertical, ChevronLeft, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketProvider';
import { Message, Chat, User } from '@/types/api';

interface ChatWindowProps {
  chat: Chat;
  otherParty: User | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
  showBackButton?: boolean;
  /** Show the back button at all breakpoints (room view has no sidebar). */
  backAlwaysVisible?: boolean;
}

export function EnhancedChatWindow({
  chat,
  otherParty,
  messages,
  onSendMessage,
  onBack,
  isLoading = false,
  showBackButton = false,
  backAlwaysVisible = false,
}: ChatWindowProps) {
  const { user } = useAuth();
  const { connected, sendTyping, onTyping, offTyping } = useSocket();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const otherPartyName =
    otherParty?.profiles?.first_name && otherParty?.profiles?.last_name
      ? `${otherParty.profiles.first_name} ${otherParty.profiles.last_name}`
      : otherParty?.email?.split('@')[0] || 'Unknown';

  const otherPartyImage = otherParty?.profiles?.profile_image_url;

  // Scroll to bottom on new messages / typing changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherUserTyping]);

  // Receive the other party's typing state.
  useEffect(() => {
    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setOtherUserTyping(data.isTyping);
      }
    };
    onTyping(handleTyping);
    return () => offTyping(handleTyping);
  }, [user?.id, onTyping, offTyping]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    sendTyping(chat.id, false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }, [chat.id, sendTyping]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setMessageInput(value);

      if (value && !isTyping) {
        setIsTyping(true);
        sendTyping(chat.id, true);
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTyping(chat.id, false);
      }, 2000);
    },
    [chat.id, isTyping, sendTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !connected) return;
    onSendMessage(messageInput.trim());
    setMessageInput('');
    stopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  // Group messages by day for date separators.
  const groups = messages.reduce<{ date: string; items: Message[] }[]>(
    (acc, message) => {
      const date = formatDate(message.created_at);
      const last = acc[acc.length - 1];
      if (last && last.date === date) last.items.push(message);
      else acc.push({ date, items: [message] });
      return acc;
    },
    []
  );

  // Index of the last message I sent (for the read receipt).
  const lastOwnIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender_id === user?.id) return messages[i].id;
    }
    return null;
  })();
  const lastOwnMessage = messages.find((m) => m.id === lastOwnIndex);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-white/90 backdrop-blur border-b border-neutral-100 flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBack}
            aria-label="Back"
            className={`p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors ${backAlwaysVisible ? '' : 'lg:hidden'}`}
          >
            <ChevronLeft size={20} className="text-neutral-600" />
          </button>
        )}

        <div className="relative flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100">
            {otherPartyImage ? (
              <Image
                src={otherPartyImage}
                alt={otherPartyName}
                fill
                sizes="40px"
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
              <span className="text-primary-600">typing…</span>
            ) : connected ? (
              'Active now'
            ) : (
              'Connecting…'
            )}
          </p>
        </div>

        <button
          aria-label="Conversation options"
          className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-neutral-50/60">
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
            <p className="text-xs mt-1">Say hello to {otherPartyName}!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-center my-4">
                <div className="bg-neutral-200/70 text-neutral-500 text-[11px] font-semibold px-3 py-1 rounded-full">
                  {group.date}
                </div>
              </div>

              {group.items.map((message, index) => {
                const isMe = message.sender_id === user?.id;
                const prev = group.items[index - 1];
                const next = group.items[index + 1];
                const isFirstOfGroup = !prev || prev.sender_id !== message.sender_id;
                const isLastOfGroup = !next || next.sender_id !== message.sender_id;

                // iMessage-style corners: the tail sits on the last bubble of a run.
                const corner = isMe
                  ? `rounded-2xl ${isLastOfGroup ? 'rounded-br-md' : ''}`
                  : `rounded-2xl ${isLastOfGroup ? 'rounded-bl-md' : ''}`;

                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} ${isLastOfGroup ? 'mb-2.5' : 'mb-0.5'}`}
                  >
                    {!isMe && (
                      <div className="w-7 flex-shrink-0">
                        {isLastOfGroup && (
                          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-neutral-200">
                            {otherPartyImage ? (
                              <Image
                                src={otherPartyImage}
                                alt={otherPartyName}
                                fill
                                sizes="28px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px] font-bold">
                                {otherPartyName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`group max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        title={formatTime(message.created_at)}
                        className={`px-4 py-2.5 shadow-sm ${corner} ${
                          isMe
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-neutral-800 border border-neutral-100'
                        }`}
                      >
                        <p className="text-[15px] leading-snug whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      {isLastOfGroup && (
                        <span className="text-[10px] text-neutral-400 mt-1 px-1">
                          {formatTime(message.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {/* Read receipt under my most recent message */}
        {!isLoading && lastOwnMessage && (
          <div className="flex justify-end pr-1">
            <span className="flex items-center gap-1 text-[10px] text-neutral-400">
              {lastOwnMessage.is_read ? (
                <>
                  <CheckCheck size={12} className="text-primary-600" /> Read
                </>
              ) : (
                <>
                  <Check size={12} /> Sent
                </>
              )}
            </span>
          </div>
        )}

        {/* Typing indicator */}
        {otherUserTyping && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-7" />
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-neutral-100">
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-neutral-100"
      >
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={messageInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message…"
              disabled={!connected}
              className="w-full max-h-32 resize-none px-4 py-2.5 bg-neutral-100 rounded-3xl border-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all text-[15px] placeholder:text-neutral-400 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            aria-label="Send message"
            disabled={!connected || !messageInput.trim()}
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-600 text-white hover:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>

        {!connected && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            Connecting to chat server…
          </p>
        )}
      </form>
    </div>
  );
}
