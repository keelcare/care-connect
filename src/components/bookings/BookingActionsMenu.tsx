'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Eye, LifeBuoy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Booking } from '@/types/api';
import { BookingHelpModal } from './BookingHelpModal';

interface BookingActionsMenuProps {
  booking: Booking;
  role: 'parent' | 'nanny';
}

/**
 * Kebab (3-dots) menu on a booking card: Details + Help.
 * "Help" opens quick support presets that create a booking-linked ticket.
 */
export function BookingActionsMenu({ booking, role }: BookingActionsMenuProps) {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);

  const detailsHref =
    role === 'parent'
      ? `/bookings/${booking.id}`
      : `/dashboard/bookings/${booking.id}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Booking options"
            onClick={(e) => e.stopPropagation()}
            className="h-8 w-8 rounded-xl border border-slate-200 p-0 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <MoreVertical size={15} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => router.push(detailsHref)}>
            <Eye size={15} className="mr-2 text-neutral-500" />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setHelpOpen(true)}>
            <LifeBuoy size={15} className="mr-2 text-neutral-500" />
            Help
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BookingHelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        booking={booking}
        role={role}
      />
    </>
  );
}
