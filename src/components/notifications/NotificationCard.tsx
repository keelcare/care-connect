'use client';

import React from 'react';
import { Notification } from '@/types/notification';
import {
  Calendar,
  MessageSquare,
  Star,
  Bell,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/notificationHelpers';
import { useRouter } from 'next/navigation';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const iconMap = {
  booking: Calendar,
  message: MessageSquare,
  review: Star,
  assignment: Bell,
  general: Bell,
};

const typeIconMap = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

const typeColorMap = {
  success: 'from-green-400/20 to-green-500/20',
  info: 'from-blue-400/20 to-indigo-400/20',
  warning: 'from-yellow-400/20 to-orange-400/20',
  error: 'from-red-400/20 to-rose-400/20',
};

const typeIconColorMap = {
  success: 'text-green-600',
  info: 'text-blue-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const router = useRouter();

  // Use type-based icon if priority, otherwise fallback to category-based or general bell
  const Icon = typeIconMap[notification.type as keyof typeof typeIconMap] ||
    iconMap[notification.category as keyof typeof iconMap] ||
    Bell;

  const gradientClass = typeColorMap[notification.type as keyof typeof typeColorMap] ||
    'from-neutral-400/20 to-neutral-500/20';

  const iconColorClass = typeIconColorMap[notification.type as keyof typeof typeIconColorMap] ||
    'text-neutral-600';

  const handleClick = () => {
    if (onMarkAsRead && !notification.is_read) {
      onMarkAsRead(notification.id);
    }
    // Handle navigation based on category or related_id
    if (notification.category === 'message' && notification.related_id) {
      router.push(`/messages/${notification.related_id}`);
    } else if (notification.category === 'booking' && notification.related_id) {
      router.push(`/bookings/${notification.related_id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClass} backdrop-blur-sm border border-white/20 p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${!notification.is_read ? 'ring-2 ring-primary-900/20' : ''
        }`}
    >
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md -z-10"></div>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full bg-white/80 flex items-center justify-center ${iconColorClass} shadow-sm`}
        >
          <Icon size={22} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-primary-900 text-base leading-tight">
              {notification.title}
            </h3>
            {!notification.is_read && (
              <span className="flex-shrink-0 w-2 h-2 bg-primary-900 rounded-full mt-1.5"></span>
            )}
          </div>

          <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">
              {formatRelativeTime(notification.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
