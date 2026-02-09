import React from 'react';
import { ArrowRight, FileText, CheckCircle2, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Notification } from '@/types/api';
import Link from 'next/link';
import { ActivityFeedModal } from './ActivityFeedModal';

interface ActivityPanelProps {
    activities?: Notification[];
}

export function ActivityPanel({ activities = [] }: ActivityPanelProps) {
    // Helper to format time relative to now (e.g. "10 min ago")
    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        return date.toLocaleDateString();
    };

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    return (
        <>
            <div className="bg-gradient-to-br from-dashboard-accent-start to-dashboard-accent-end rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden h-[400px] flex flex-col">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="font-heading font-semibold text-xl">Recent Activity</h3>
                    {activities.length > 0 && (
                        <div className="w-2 h-2 rounded-full bg-dashboard-success animate-pulse" />
                    )}
                </div>

                <div className="space-y-6 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
                    {activities.length > 0 && (
                        <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-white/10" />
                    )}

                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-white/60">
                            <Bell className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-sm">No recent activity</p>
                        </div>
                    ) : (
                        activities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex gap-4 relative">
                                <div className={cn("relative z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 text-white")}>
                                    {activity.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="pt-2">
                                    <p className="font-medium text-white/90 text-sm">{activity.message}</p>
                                    <p className="text-white/50 text-xs mt-0.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatTimeAgo(activity.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-auto">
                    <Button
                        variant="ghost"
                        onClick={() => setIsModalOpen(true)}
                        className="w-full mt-4 text-white/70 hover:text-white hover:bg-white/10 rounded-xl justify-between group"
                    >
                        View All Activity
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            <ActivityFeedModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                activities={activities} 
            />
        </>
    );
}
