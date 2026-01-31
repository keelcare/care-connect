'use client';

import React from 'react';
import Image from 'next/image';
import { MessageSquare, Search } from 'lucide-react';
import { Chat, Booking, User } from '@/types/api';

interface ChatWithDetails extends Chat {
  booking?: Booking;
  otherParty?: User;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface ChatSidebarProps {
  chats: ChatWithDetails[];
  activeChat: ChatWithDetails | null;
  onSelectChat: (chat: ChatWithDetails) => void;
  isConnected: boolean;
  isLoading?: boolean;
  currentUserId?: string;
}

export function ChatSidebar({
  chats,
  activeChat,
  onSelectChat,
  isConnected,
  isLoading = false,
  currentUserId,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const getOtherPartyName = (chat: ChatWithDetails) => {
    const otherParty = chat.otherParty;
    if (otherParty?.profiles?.first_name && otherParty?.profiles?.last_name) {
      return `${otherParty.profiles.first_name} ${otherParty.profiles.last_name}`;
    }
    return otherParty?.email?.split('@')[0] || 'Unknown';
  };

  const getOtherPartyImage = (chat: ChatWithDetails) => {
    return chat.otherParty?.profiles?.profile_image_url || null;
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const filteredChats = chats.filter((chat) => {
    const name = getOtherPartyName(chat).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col bg-white border-r border-neutral-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-primary-900">Messages</h2>
          <div className="flex items-center gap-2">
            {!isConnected && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                Connecting...
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-navy/20 focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-stone-300" />
            </div>
            {searchQuery ? (
              <p className="text-sm text-center">No conversations found</p>
            ) : (
              <>
                <p className="text-sm text-center">No conversations yet</p>
                <p className="text-xs mt-1 text-center">
                  Start a booking to begin chatting!
                </p>
              </>
            )}
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherPartyName = getOtherPartyName(chat);
            const otherPartyImage = getOtherPartyImage(chat);
            const isActive = activeChat?.id === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all hover:bg-stone-50 ${isActive
                  ? 'bg-navy/10 border-l-2 border-navy'
                  : 'border-l-2 border-transparent'
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100">
                    {otherPartyImage ? (
                      <Image
                        src={otherPartyImage}
                        alt={otherPartyName}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-lg">
                        {otherPartyName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Online indicator would go here if we had presence */}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-medium truncate ${isActive ? 'text-navy' : 'text-navy'
                        }`}
                    >
                      {otherPartyName}
                    </span>
                    {chat.lastMessageTime && (
                      <span className="text-xs text-stone-400 flex-shrink-0 ml-2">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm truncate ${chat.unreadCount
                        ? 'text-stone-700 font-medium'
                        : 'text-stone-500'
                        }`}
                    >
                      {chat.lastMessage ||
                        chat.booking?.job?.title ||
                        'Booking conversation'}
                    </p>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-sage text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
