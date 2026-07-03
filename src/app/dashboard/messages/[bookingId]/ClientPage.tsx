'use client';

import { useParams } from 'next/navigation';
import { ChatRoom } from '@/components/features/ChatRoom';

export default function NannyChatRoomPage() {
  const params = useParams();
  const bookingId = String(params?.bookingId ?? '');

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-[28px] border border-neutral-100 shadow-soft overflow-hidden">
      <ChatRoom bookingId={bookingId} backHref="/dashboard/bookings" />
    </div>
  );
}
