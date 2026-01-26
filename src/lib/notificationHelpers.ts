import { Notification, NotificationCategory } from '@/types/notification';
import { Booking, Message, Review } from '@/types/api';

/**
 * Convert a booking to a notification
 */
export function bookingToNotification(
  booking: Booking,
  userId: string
): Notification {
  const isParent = booking.parent_id === userId;
  const otherParty = isParent
    ? `${booking.nanny?.profiles?.first_name || 'Nanny'}`
    : `${booking.parent?.profiles?.first_name || 'Parent'}`;

  let title = '';
  let description = '';

  switch (booking.status) {
    case 'CONFIRMED':
      title = 'Booking Confirmed';
      description = `Your booking with ${otherParty} has been confirmed`;
      break;
    case 'IN_PROGRESS':
      title = 'Booking Started';
      description = `Your booking with ${otherParty} is now in progress`;
      break;
    case 'COMPLETED':
      title = 'Booking Completed';
      description = `Your booking with ${otherParty} has been completed`;
      break;
    case 'CANCELLED':
      title = 'Booking Cancelled';
      description = `Your booking with ${otherParty} was cancelled`;
      break;
    default:
      title = 'Booking Update';
      description = `Update on your booking with ${otherParty}`;
  }

  return {
    id: `booking-${booking.id}`,
    user_id: userId,
    title,
    message: description,
    type: 'info', // Default type for bookings
    is_read: false,
    created_at: booking.updated_at,
    related_id: booking.id,
    category: 'booking',
  };
}

/**
 * Convert a message to a notification
 */
export function messageToNotification(
  message: Message,
  chatId: string
): Notification {
  const senderName = message.sender?.profiles?.first_name || 'Someone';

  return {
    id: `message-${message.id}`,
    user_id: '', // Not easily available here, but unified API will handle it
    title: 'New Message',
    message: `${senderName}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
    type: 'info',
    is_read: message.is_read,
    created_at: message.created_at,
    related_id: message.id,
    category: 'message',
  };
}

/**
 * Convert a review to a notification
 */
export function reviewToNotification(review: Review): Notification {
  const reviewerName = review.reviewer?.profiles?.first_name || 'Someone';

  return {
    id: `review-${review.id}`,
    user_id: review.reviewee_id,
    title: 'New Review',
    message: `${reviewerName} left you a ${review.rating}-star review`,
    type: 'success',
    is_read: false,
    created_at: review.created_at,
    related_id: review.id,
    category: 'review',
  };
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Group notifications by date
 */
export function groupNotificationsByDate(
  notifications: Notification[]
): { date: string; notifications: Notification[] }[] {
  const groups: { [key: string]: Notification[] } = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Earlier: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.created_at);
    const notifDay = new Date(
      notifDate.getFullYear(),
      notifDate.getMonth(),
      notifDate.getDate()
    );

    if (notifDay.getTime() === today.getTime()) {
      groups['Today'].push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups['Yesterday'].push(notification);
    } else if (notifDate >= weekAgo) {
      groups['This Week'].push(notification);
    } else {
      groups['Earlier'].push(notification);
    }
  });

  return Object.entries(groups)
    .filter(([_, notifs]) => notifs.length > 0)
    .map(([date, notifications]) => ({ date, notifications }));
}
