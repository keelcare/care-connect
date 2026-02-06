
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    onClick?: () => void;
    color?: string; // Tailwind color class for icon bg
}

export function QuickActionCard({ title, subtitle, icon: Icon, onClick, color = "bg-gray-100" }: QuickActionCardProps) {
    return (
        <div 
            className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group h-full flex flex-col items-start gap-4"
            onClick={onClick}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} border border-black/5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-dashboard-text-primary/80" />
            </div>
            
            <div className="mt-2">
                <h3 className="font-display font-bold text-xl text-dashboard-text-primary mb-1 group-hover:text-dashboard-accent-start transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-dashboard-text-secondary/80 font-medium">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
