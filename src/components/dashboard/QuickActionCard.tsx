
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
            className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50/50 transition-all duration-300 cursor-pointer group h-full flex flex-col items-start gap-5"
            onClick={onClick}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} border border-black/5 group-hover:scale-105 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-dashboard-text-primary" />
            </div>
            
            <div className="mt-auto">
                <h3 className="font-heading font-bold text-lg text-dashboard-text-primary mb-1 group-hover:text-dashboard-accent-start transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-dashboard-text-secondary leading-relaxed">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
