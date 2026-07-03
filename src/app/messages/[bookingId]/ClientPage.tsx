'use client';

import { useParams } from 'next/navigation';
import ParentLayout from '@/components/layout/ParentLayout';
import { ChatRoom } from '@/components/features/ChatRoom';

export default function ParentChatRoomPage() {
  const params = useParams();
  const bookingId = String(params?.bookingId ?? '');

  return (
    <ParentLayout>
      <div className="max-w-3xl mx-auto h-[calc(100vh-80px)] md:p-6">
        <div className="h-full bg-white md:rounded-[28px] md:border border-neutral-100 md:shadow-soft overflow-hidden">
          <ChatRoom bookingId={bookingId} backHref="/bookings" />
        </div>
      </div>
    </ParentLayout>
  );
}
