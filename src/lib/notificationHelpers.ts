import { Notification, NotificationCategory } from '@/types/notification';
import { Booking, Message, Review } from '@/types/api';

/**
 * Convert a booking to a notification
 */
export function bookingToNotification(booking: Booking, userId: string): Notification {
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
        category: 'booking',
        title,
        description,
        timestamp: booking.updated_at,
        isRead: false,
        actionUrl: `/bookings`,
        actionLabel: 'View Booking',
        relatedId: booking.id,
    };
}

/**
 * Convert a message to a notification
 */
export function messageToNotification(message: Message, chatId: string): Notification {
    const senderName = message.sender?.profiles?.first_name || 'Someone';

    return {
        id: `message-${message.id}`,
        category: 'message',
        title: 'New Message',
        description: `${senderName}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
        timestamp: message.created_at,
        isRead: message.is_read,
        actionUrl: `/messages`,
        actionLabel: 'Reply',
        relatedId: message.id,
    };
}

/**
 * Convert a review to a notification
 */
export function reviewToNotification(review: Review): Notification {
    const reviewerName = review.reviewer?.profiles?.first_name || 'Someone';

    return {
        id: `review-${review.id}`,
        category: 'review',
        title: 'New Review',
        description: `${reviewerName} left you a ${review.rating}-star review`,
        timestamp: review.created_at,
        isRead: false,
        actionUrl: `/dashboard`,
        actionLabel: 'View Review',
        relatedId: review.id,
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
export function groupNotificationsByDate(notifications: Notification[]): { date: string; notifications: Notification[] }[] {
    const groups: { [key: string]: Notification[] } = {
        'Today': [],
        'Yesterday': [],
        'This Week': [],
        'Earlier': [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    notifications.forEach(notification => {
        const notifDate = new Date(notification.timestamp);
        const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

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
