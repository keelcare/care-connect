import React from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';

interface NotificationButtonProps {
    className?: string;
    variant?: 'navbar' | 'dashboard';
}

export function NotificationButton({ className, variant = 'navbar' }: NotificationButtonProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { unreadCount } = useNotificationContext();

    const handleClick = () => {
        const path = user?.role === 'nanny' ? '/dashboard/notifications' : '/notifications';
        router.push(path);
    };

    const styles = {
        navbar: "p-1.5 text-primary-900/70 hover:text-primary-900 hover:bg-neutral-50",
        dashboard: "w-10 h-10 bg-white/50 backdrop-blur-sm border border-white/60 text-dashboard-text-secondary hover:text-dashboard-text-primary hover:bg-white"
    };

    return (
        <motion.button
            onClick={handleClick}
            className={cn(
                "relative rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                styles[variant],
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
        >
            <Bell size={variant === 'navbar' ? 18 : 20} className={variant === 'navbar' ? "" : "w-5 h-5"} />
            <AnimatePresence>
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={cn(
                            "absolute bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm",
                            variant === 'navbar' 
                                ? "-top-1 -right-1 min-w-[18px] h-[18px] px-1" 
                                : "-top-1 -right-1 min-w-[20px] h-5 px-1"
                        )}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

