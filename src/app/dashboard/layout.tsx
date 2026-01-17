"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Calendar, Settings, User, ClipboardList, CalendarOff, Bell, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GeofenceAlertBanner } from '@/components/location/GeofenceAlertBanner';
import { Avatar } from '@/components/ui/avatar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
        { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
        { icon: Calendar, label: 'Bookings', href: '/dashboard/bookings' },
        { icon: CalendarOff, label: 'Availability', href: '/dashboard/availability' },
        { icon: User, label: 'Profile', href: '/dashboard/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

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
                {/* Top Header Bar */}
                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-stone-100 h-16 flex items-center justify-between px-6 md:px-10">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-stone-100 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Mobile Logo */}
                    <Link href="/" className="md:hidden">
                        <span className="text-xl font-bold text-stone-900 tracking-tight font-display">
                            CareConnect
                        </span>
                    </Link>

                    {/* Spacer for desktop */}
                    <div className="hidden md:block" />

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Notification Bell */}
                        <Link
                            href="/dashboard/notifications"
                            className={`relative p-2.5 rounded-xl transition-all ${pathname === '/dashboard/notifications'
                                ? 'bg-stone-100 text-stone-900'
                                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                                }`}
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all"
                            >
                                <Avatar
                                    src={user?.profiles?.profile_image_url || undefined}
                                    alt={user?.profiles?.first_name || 'User'}
                                    fallback={user?.profiles?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                    size="sm"
                                    ringColor="bg-stone-100"
                                />
                                <ChevronDown size={16} className={`text-stone-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                                    <div className="px-4 py-3 border-b border-stone-100">
                                        <p className="font-bold text-stone-900 truncate">
                                            {user?.profiles?.first_name ? `${user.profiles.first_name} ${user.profiles.last_name}` : 'User'}
                                        </p>
                                        <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="w-full px-4 py-3 text-left hover:bg-stone-50 flex items-center gap-3 text-stone-700 transition-colors"
                                        >
                                            <LayoutDashboard size={18} />
                                            <span className="font-medium">Overview</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="w-full px-4 py-3 text-left hover:bg-stone-50 flex items-center gap-3 text-stone-700 transition-colors"
                                        >
                                            <User size={18} />
                                            <span className="font-medium">My Profile</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/bookings"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="w-full px-4 py-3 text-left hover:bg-stone-50 flex items-center gap-3 text-stone-700 transition-colors"
                                        >
                                            <Calendar size={18} />
                                            <span className="font-medium">My Bookings</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/settings"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="w-full px-4 py-3 text-left hover:bg-stone-50 flex items-center gap-3 text-stone-700 transition-colors"
                                        >
                                            <Settings size={18} />
                                            <span className="font-medium">Settings</span>
                                        </Link>
                                    </div>

                                    <div className="border-t border-stone-100 mt-1 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            <span className="font-medium">Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 md:hidden">
                        <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col">
                            <div className="p-6 border-b border-stone-100">
                                <Link href="/" className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-stone-900 tracking-tight font-display">
                                        CareConnect
                                    </span>
                                </Link>
                            </div>
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
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
                            <div className="p-4 border-t border-stone-100">
                                <button
                                    onClick={() => {
                                        logout();
                                        router.push('/');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12">
                    {children}
                </div>
            </main>

            {/* Geofence Alert Banner - Shows for parents when nanny leaves designated area */}
            <GeofenceAlertBanner position="top" autoDismiss={true} autoDismissTimeout={15000} />

            {/* Mobile Bottom Nav Placeholder - In a real app this would be a separate component visible only on mobile */}
        </div>
    );
}
