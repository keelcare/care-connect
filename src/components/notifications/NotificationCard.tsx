'use client';

import React from 'react';
import { Notification } from '@/types/notification';
import {
  Calendar,
  MessageSquare,
  Star,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  GraduationCap,
  Baby,
  Heart
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/notificationHelpers';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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

const typeStyles = {
  success: {
    bg: 'bg-primary-50', // Mint/Cream
    text: 'text-primary-900', // Deep Forest
    border: 'border-primary-900/20',
    icon: CheckCircle
  },
  info: {
    bg: 'bg-white',
    text: 'text-gray-900', // Navy
    border: 'border-gray-200',
    icon: Info
  },
  warning: {
    bg: 'bg-neutral-50', // Sage tint
    text: 'text-secondary', // Muted Sage
    border: 'border-secondary/20',
    icon: AlertTriangle
  },
  error: {
    bg: 'bg-red-50', // Terracotta tint
    text: 'text-terracotta', // Terracotta
    border: 'border-terracotta/20',
    icon: AlertCircle
  },
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const router = useRouter();

  // Determine styles based on type or category
  const style = typeStyles[notification.type as keyof typeof typeStyles] || typeStyles.info;
  const CategoryIcon = iconMap[notification.category as keyof typeof iconMap] || Bell;

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={handleClick}
      className={`relative rounded-[24px] p-5 border-2 transition-all duration-300 cursor-pointer ${notification.is_read
          ? 'bg-white border-gray-100'
          : `${style.bg} ${style.border} shadow-md`
        }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${notification.is_read ? 'bg-gray-100 text-gray-400' : `${style.text} bg-white`}`}>
          <CategoryIcon size={24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-bold font-display text-lg ${notification.is_read ? 'text-gray-700' : 'text-primary-900'}`}>
              {notification.title}
            </h3>
            {!notification.is_read && (
              <span className="flex-shrink-0 w-2.5 h-2.5 bg-terracotta rounded-full mt-2 animate-pulse" />
            )}
          </div>

          <p className={`${notification.is_read ? 'text-gray-500' : 'text-gray-600'} mb-3 font-body leading-relaxed`}>
            {notification.message}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {formatRelativeTime(notification.created_at)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
