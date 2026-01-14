"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Calendar, MessageSquare, Sparkles, Settings, ChevronLeft, ChevronRight, User, Repeat, Heart, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ParentSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export const ParentSidebar: React.FC<ParentSidebarProps> = ({ isCollapsed = false, onToggle }) => {
    const pathname = usePathname();
    const { user } = useAuth();

    const navItems = [

        { icon: Search, label: 'Browse', href: '/browse' },
        { icon: Heart, label: 'Saved Caregivers', href: '/favorites' },
        { icon: Sparkles, label: 'Book a Service', href: '/book-service' },
        { icon: Calendar, label: 'Your Bookings', href: '/bookings' },
        { icon: Repeat, label: 'Recurring', href: '/recurring-bookings' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: Star, label: 'Reviews', href: '/parent/reviews' },
    ];

    return (
        <aside className={`bg-white border-r border-stone-100 fixed top-[72px] h-[calc(100vh-72px)] z-30 hidden md:flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-8 w-6 h-6 bg-white border border-stone-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:bg-stone-50 z-50"
                aria-label="Toggle sidebar"
            >
                {isCollapsed ? (
                    <ChevronRight size={14} className="text-stone-600" />
                ) : (
                    <ChevronLeft size={14} className="text-stone-600" />
                )}
            </button>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
                <p className={`text-xs font-semibold text-stone-400 uppercase tracking-wider px-3 mb-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 select-none' : 'opacity-100'}`}>
                    Menu
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-emerald-600 text-white'
                                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon
                                size={20}
                                className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-stone-500 group-hover:text-stone-700'}`}
                            />
                            {!isCollapsed && (
                                <span className={`${isActive ? 'text-emerald-900' : ''}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Help Section */}
            {!isCollapsed && (
                <div className="px-4 pb-4">
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 text-center">
                        <p className="text-sm font-semibold text-stone-900 mb-1">Need help choosing?</p>
                        <button className="text-xs text-emerald-600 font-medium hover:underline">
                            Chat with an advisor
                        </button>
                    </div>
                </div>
            )}


        </aside>
    );
};
