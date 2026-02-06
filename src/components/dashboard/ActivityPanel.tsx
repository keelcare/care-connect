
import React from 'react';
import { ArrowRight, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ActivityPanel() {
    const activities = [
        {
            id: 1,
            type: 'session_end',
            message: 'Emma Wilson finished her session',
            time: '10 min ago',
            icon: CheckCircle2,
            iconColor: 'text-dashboard-success'
        },
        {
            id: 2,
            type: 'invoice',
            message: 'Invoice #2024-10 paid',
            time: 'Yesterday',
            icon: FileText,
            iconColor: 'text-dashboard-sage'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-dashboard-accent-start to-dashboard-accent-end rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-heading font-semibold text-xl">Recent Activity</h3>
                <div className="w-2 h-2 rounded-full bg-dashboard-success animate-pulse" />
            </div>

            <div className="space-y-6 relative z-10">
                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-white/10" />
                
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 relative">
                        <div className={cn("relative z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0", activity.iconColor)}>
                            <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="pt-2">
                            <p className="font-medium text-white/90 text-sm">{activity.message}</p>
                            <p className="text-white/50 text-xs mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <Button 
                variant="ghost" 
                className="w-full mt-8 text-white/70 hover:text-white hover:bg-white/10 rounded-xl justify-between group"
            >
                View All Activity
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
    );
}
