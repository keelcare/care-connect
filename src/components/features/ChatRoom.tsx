'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { EnhancedChatWindow } from '@/components/features/EnhancedChatWindow';
import { Spinner } from '@/components/ui/Spinner';
import { useBookingChat } from '@/hooks/useBookingChat';

interface ChatRoomProps {
  bookingId: string;
  /** Where the back button navigates (defaults to browser back). */
  backHref?: string;
}

/**
 * Full-screen chat room scoped to a single booking. One booking = one room.
 */
export function ChatRoom({ bookingId, backHref }: ChatRoomProps) {
  const router = useRouter();
  const { chat, otherParty, messages, loading, error, sendChatMessage } =
    useBookingChat(bookingId);

  const handleBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-300">
          <MessageSquare size={28} />
        </div>
        <p className="text-neutral-600 font-medium">
          {error || 'Conversation unavailable'}
        </p>
        <button
          onClick={handleBack}
          className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <EnhancedChatWindow
      chat={chat}
      otherParty={otherParty}
      messages={messages}
      onSendMessage={sendChatMessage}
      onBack={handleBack}
      isLoading={loading}
      showBackButton
      backAlwaysVisible
    />
  );
}
