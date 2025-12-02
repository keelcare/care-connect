"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Calendar, Settings, User, ClipboardList, CalendarOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
        { icon: Calendar, label: 'Bookings', href: '/dashboard/bookings' },
        { icon: CalendarOff, label: 'Availability', href: '/dashboard/availability' },
        { icon: User, label: 'Profile', href: '/dashboard/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-stone-100 fixed h-full z-30 hidden md:flex flex-col shadow-soft">
                <div className="p-8 border-b border-stone-100">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-3xl font-bold text-stone-900 tracking-tight font-display">
                            CareConnect
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-stone-100 text-stone-900'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-stone-900' : 'text-stone-400'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-stone-100">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm">
                            <Image
                                src={user?.profiles?.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                alt="User"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-stone-900 truncate">
                                {user?.profiles?.first_name ? `${user.profiles.first_name} ${user.profiles.last_name}` : 'Loading...'}
                            </p>
                            <p className="text-xs text-stone-500 truncate capitalize">
                                {user?.role || '...'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-72 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav Placeholder - In a real app this would be a separate component visible only on mobile */}
        </div>
    );
}
