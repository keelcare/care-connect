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
        { icon: Home, label: 'Browse', href: '/browse' },
        { icon: Search, label: 'Search', href: '/search' },
        { icon: Heart, label: 'Favorites', href: '/favorites' },
        { icon: Sparkles, label: 'Book a Service', href: '/book-service' },
        { icon: Calendar, label: 'Bookings', href: '/bookings' },
        { icon: Repeat, label: 'Recurring', href: '/recurring-bookings' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: Star, label: 'Reviews', href: '/parent/reviews' },
        { icon: Settings, label: 'Settings', href: '/settings' },
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
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {!isCollapsed && (
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-3 mb-3">
                        Menu
                    </p>
                )}

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
                                <span className={`font-medium ${isActive ? 'text-white' : ''}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            {!isCollapsed && user && (
                <div className="p-4 border-t border-stone-100">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-stone-50">
                        <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                            <User size={18} className="text-stone-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-stone-900 truncate">
                                {user.profiles?.first_name || 'User'}
                            </p>
                            <p className="text-xs text-stone-500 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapsed User Avatar */}
            {isCollapsed && user && (
                <div className="p-4 border-t border-stone-100 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                        <User size={18} className="text-stone-600" />
                    </div>
                </div>
            )}
        </aside>
    );
};
