"use client";

import React from 'react';
import { Notification } from '@/types/notification';
import { Calendar, MessageSquare, Star, Bell, ChevronRight } from 'lucide-react';
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

const colorMap = {
    booking: 'from-blue-400/20 to-purple-400/20',
    message: 'from-green-400/20 to-teal-400/20',
    review: 'from-yellow-400/20 to-orange-400/20',
    assignment: 'from-pink-400/20 to-rose-400/20',
    general: 'from-neutral-400/20 to-neutral-500/20',
};

const iconColorMap = {
    booking: 'text-blue-600',
    message: 'text-green-600',
    review: 'text-yellow-600',
    assignment: 'text-pink-600',
    general: 'text-neutral-600',
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead }) => {
    const router = useRouter();
    const Icon = iconMap[notification.category];
    const gradientClass = colorMap[notification.category];
    const iconColorClass = iconColorMap[notification.category];

    const handleClick = () => {
        if (onMarkAsRead && !notification.isRead) {
            onMarkAsRead(notification.id);
        }
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClass} backdrop-blur-sm border border-white/20 p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${!notification.isRead ? 'ring-2 ring-primary/20' : ''
                }`}
        >
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md -z-10"></div>

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-white/80 flex items-center justify-center ${iconColorClass} shadow-sm`}>
                    <Icon size={22} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-neutral-900 text-base leading-tight">
                            {notification.title}
                        </h3>
                        {!notification.isRead && (
                            <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5"></span>
                        )}
                    </div>

                    <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                        {notification.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500 font-medium">
                            {formatRelativeTime(notification.timestamp)}
                        </span>

                        {notification.actionLabel && (
                            <span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                                {notification.actionLabel}
                                <ChevronRight size={14} />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
