export type NotificationCategory =
  | 'booking'
  | 'message'
  | 'review'
  | 'assignment'
  | 'general';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  related_id?: string;
  category?: string;
}

export interface NotificationGroup {
  date: string; // e.g., "Today", "Yesterday", "This Week"
  notifications: Notification[];
}
