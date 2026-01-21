'use client';

import React from 'react';
import { Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import styles from './BookingCard.module.css';

interface BookingCardProps {
  booking: Booking;
  userRole: 'parent' | 'nanny' | 'admin';
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  loading?: boolean;
}

export function BookingCard({
  booking,
  userRole,
  onStart,
  onComplete,
  onCancel,
  loading = false,
}: BookingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOtherPartyName = () => {
    if (userRole === 'nanny') {
      return booking.parent?.profiles?.first_name &&
        booking.parent?.profiles?.last_name
        ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name}`
        : booking.parent?.email || 'Parent';
    } else {
      return booking.nanny?.profiles?.first_name &&
        booking.nanny?.profiles?.last_name
        ? `${booking.nanny.profiles.first_name} ${booking.nanny.profiles.last_name}`
        : booking.nanny?.email || 'Nanny';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return styles.statusConfirmed;
      case 'IN_PROGRESS':
        return styles.statusInProgress;
      case 'COMPLETED':
        return styles.statusCompleted;
      case 'CANCELLED':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const { day, month } = formatDate(booking.start_time);

  return (
    <div className={styles.bookingCard}>
      <div className={styles.bookingInfo}>
        <div className={styles.dateBox}>
          <span className={styles.day}>{day}</span>
          <span className={styles.month}>{month}</span>
        </div>
        <div className={styles.details}>
          <span className={styles.serviceTitle}>
            {booking.job?.title || 'Booking'}
          </span>
          <span className={styles.provider}>with {getOtherPartyName()}</span>
          <span className={styles.time}>
            {formatTime(booking.start_time)}
            {booking.end_time && ` - ${formatTime(booking.end_time)}`}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <span
          className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}
        >
          {booking.status.toLowerCase().replace('_', ' ')}
        </span>

        {loading ? (
          <Spinner />
        ) : (
          <div className={styles.buttons}>
            {booking.status === 'CONFIRMED' &&
              userRole === 'nanny' &&
              onStart && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onStart(booking.id)}
                >
                  Start
                </Button>
              )}

            {booking.status === 'IN_PROGRESS' && onComplete && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onComplete(booking.id)}
              >
                Complete
              </Button>
            )}

            {(booking.status === 'CONFIRMED' ||
              booking.status === 'IN_PROGRESS') &&
              onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(booking.id)}
                >
                  Cancel
                </Button>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
