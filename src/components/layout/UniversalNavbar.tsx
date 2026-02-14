'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Calendar,
    Sparkles,
    Phone,
    User,
    Settings,
    LogOut,
    Bell,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
    { href: '/parent-dashboard', label: 'Home', icon: Home },
    { href: '/bookings', label: 'My Bookings', icon: Calendar },
    { href: '/book-service', label: 'Book a Service', icon: Sparkles },
    { href: '/contact', label: 'Contact Us', icon: Phone },
];

export default function UniversalNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const isActive = (href: string) => {
        if (href === '/parent-dashboard') {
            return pathname === '/parent-dashboard';
        }
        return pathname?.startsWith(href);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 pt-6">
            <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-full shadow-lg px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-[#F1F5F9] rounded-full flex items-center justify-center group-hover:bg-[#E2E8F0] transition-colors">
                            <img src="/logo.svg" alt="Keel Logo" className="h-6 w-auto" />
                        </div>
                        <span className="text-xl font-bold font-display text-[#1B3022] tracking-tight hidden sm:block">
                            Keel
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all ${active
                                        ? 'text-[#1B3022] bg-[#F2F7F4]'
                                        : 'text-gray-600 hover:text-[#1B3022] hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </div>
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-[#F2F7F4] rounded-full -z-10"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side - Notifications & Profile */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <Link
                            href={user?.role === 'nanny' ? '/dashboard/notifications' : '/notifications'}
                            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <Bell className="w-5 h-5 text-gray-600" />
                            {/* Notification badge */}
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[#CC7A68] rounded-full" />
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B3022] to-[#CC7A68] flex items-center justify-center text-white font-bold text-sm">
                                    {user?.profiles?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-600 transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsProfileOpen(false)}
                                        />

                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                        >
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-semibold text-[#1B3022] text-sm">
                                                    {user?.profiles?.first_name} {user?.profiles?.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <button
                                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm text-left cursor-default"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // setIsProfileOpen(false); // Optional: close on click or keep open? User said "without redirecting".
                                                    }}
                                                >
                                                    <User className="w-4 h-4" />
                                                    View Profile
                                                </button>
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-gray-100 py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600 text-sm w-full"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-gray-600" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-gray-100 mt-3 pt-3 pb-2"
                        >
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${active
                                            ? 'text-[#1B3022] bg-[#F2F7F4] font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
