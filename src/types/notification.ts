export type NotificationCategory =
  | 'booking'
  | 'message'
  | 'review'
  | 'assignment'
  | 'general';

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  relatedId?: string; // booking_id, message_id, etc.
}

export interface NotificationGroup {
  date: string; // e.g., "Today", "Yesterday", "This Week"
  notifications: Notification[];
}
