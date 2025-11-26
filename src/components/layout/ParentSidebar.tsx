"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Search, Calendar, MessageSquare, Sparkles, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ParentSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export const ParentSidebar: React.FC<ParentSidebarProps> = ({ isCollapsed = false, onToggle }) => {
    const pathname = usePathname();
    const { user } = useAuth();

    const navItems = [
        { icon: Home, label: 'Browse', href: '/browse' },
        { icon: Search, label: 'Search', href: '/search' },
        { icon: Sparkles, label: 'Book a Service', href: '/book-service' },
        { icon: Calendar, label: 'Bookings', href: '/bookings' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <aside className={`bg-white border-r border-neutral-100 fixed top-[72px] h-[calc(100vh-72px)] z-30 hidden md:flex flex-col shadow-soft transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-12 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:bg-neutral-50 z-50"
                aria-label="Toggle sidebar"
            >
                {isCollapsed ? <ChevronRight size={14} className="text-neutral-600" /> : <ChevronLeft size={14} className="text-neutral-600" />}
            </button>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${isActive
                                ? 'bg-primary/10 text-neutral-900'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon size={20} className={isActive ? 'text-primary' : 'text-neutral-900'} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {!isCollapsed && (
                <div className="p-6 border-t border-neutral-100">
                    {/* Profile section removed as per request */}
                </div>
            )}
        </aside>
    );
};
