
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatusPillProps {
    status: 'active' | 'pending' | 'completed' | 'cancelled' | 'online' | 'offline';
    text?: string;
    className?: string;
    showDot?: boolean;
}

export function StatusPill({ status, text, className, showDot = true }: StatusPillProps) {
    const styles = {
        active: 'bg-dashboard-success/10 text-dashboard-success border-dashboard-success/20',
        online: 'bg-dashboard-success/10 text-dashboard-success border-dashboard-success/20',
        pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
        offline: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    };

    const dotStyles = {
        active: 'bg-dashboard-success',
        online: 'bg-dashboard-success',
        pending: 'bg-yellow-500',
        completed: 'bg-blue-500',
        cancelled: 'bg-red-500',
        offline: 'bg-gray-500',
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm",
            styles[status],
            className
        )}>
            {showDot && (
                <span className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    dotStyles[status]
                )} />
            )}
            <span className="uppercase tracking-wide">{text || status}</span>
        </div>
    );
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <div 
            className={cn(
                "bg-white/60 backdrop-blur-md border border-white/40 shadow-soft rounded-[24px]",
                hoverEffect && "hover:bg-white/80 hover:shadow-premium transition-all duration-300 hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
