
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, FileText, Clock, Bell, Circle } from 'lucide-react';
import { Notification } from '@/types/api';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface ActivityFeedModalProps {
    isOpen: boolean;
    onClose: () => void;
    activities: Notification[];
}

export function ActivityFeedModal({ isOpen, onClose, activities }: ActivityFeedModalProps) {
    // Group activities by date
    const groupedActivities = React.useMemo(() => {
        const groups: Record<string, Notification[]> = {
            'Today': [],
            'Yesterday': [],
            'Earlier': []
        };

        activities.forEach(activity => {
            const date = new Date(activity.created_at);
            if (isToday(date)) {
                groups['Today'].push(activity);
            } else if (isYesterday(date)) {
                groups['Yesterday'].push(activity);
            } else {
                groups['Earlier'].push(activity);
            }
        });

        return groups;
    }, [activities]);

    const hasActivities = activities.length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white/90 backdrop-blur-xl w-full max-w-md max-h-[80vh] rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col border border-white/20"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100/50 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                                <h2 className="text-xl font-heading font-semibold text-gray-900">Recent Activity</h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
                                {!hasActivities ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                        <Bell className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No recent activity</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {(Object.keys(groupedActivities) as Array<keyof typeof groupedActivities>).map((group) => {
                                            const groupActivities = groupedActivities[group];
                                            if (groupActivities.length === 0) return null;

                                            return (
                                                <div key={group} className="space-y-4">
                                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2 sticky top-0 bg-white/80 backdrop-blur-sm py-1 z-10">
                                                        {group}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {groupActivities.map((activity) => (
                                                            <div
                                                                key={activity.id}
                                                                className="group relative p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <div className={cn(
                                                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                                                                        activity.type === 'success'
                                                                            ? "bg-green-50 text-green-600 border-green-100"
                                                                            : "bg-blue-50 text-blue-600 border-blue-100"
                                                                    )}>
                                                                        {activity.type === 'success' ? (
                                                                            <CheckCircle2 className="w-5 h-5" />
                                                                        ) : (
                                                                            <FileText className="w-5 h-5" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <p className="font-medium text-gray-900 text-sm leading-snug">
                                                                                {activity.message}
                                                                            </p>
                                                                            {!activity.is_read && (
                                                                                <Circle className="w-2 h-2 fill-blue-500 text-blue-500 shrink-0 mt-1.5" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                                            <Clock className="w-3 h-3" />
                                                                            <time>
                                                                                {format(new Date(activity.created_at), 'h:mm a')}
                                                                            </time>
                                                                            {/* Nice to have: Category pill */}
                                                                            {activity.category && (
                                                                                <>
                                                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                                                    <span className="capitalize">{activity.category.replace('_', ' ')}</span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
