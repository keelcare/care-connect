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
    LogOut,
    Bell,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
    { href: '/home', label: 'Home', icon: Home },
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
        if (href === '/home') {
            return pathname === '/home';
        }
        return pathname?.startsWith(href);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4 md:pt-6">
            <div className="max-w-7xl mx-auto bg-white/85 backdrop-blur-xl border border-[#8B7FDB]/10 rounded-full shadow-soft px-4 md:px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8B7FDB] to-[#7FC7D9] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <img src="/logo.svg" alt="Keel Logo" className="h-5 w-auto brightness-0 invert" />
                        </div>
                        <span className="text-xl font-heading font-medium text-neutral-800 tracking-tight hidden sm:block">
                            Keel
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${active
                                        ? 'text-[#8B7FDB]'
                                        : 'text-neutral-600 hover:text-neutral-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 relative z-10">
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </div>
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-[#F5F3FF] rounded-full"
                                            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side - Notifications & Profile */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <Link
                            href="/notifications"
                            className="relative p-2.5 rounded-full hover:bg-[#F5F3FF] transition-colors"
                        >
                            <Bell className="w-5 h-5 text-neutral-600" />
                            {/* Notification badge */}
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8B4B8] rounded-full" />
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-[#F5F3FF] transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B7FDB] to-[#7FC7D9] flex items-center justify-center text-white font-medium text-sm shadow-sm">
                                    {user?.profiles?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-neutral-500 transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''
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
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-neutral-200/60 overflow-hidden z-50"
                                        >
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-neutral-100 bg-[#FAFAFA]">
                                                <p className="font-medium text-neutral-800 text-sm">
                                                    {user?.profiles?.first_name} {user?.profiles?.last_name}
                                                </p>
                                                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <button
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F3FF] transition-colors text-neutral-600 text-sm text-left"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                >
                                                    <User className="w-4 h-4" />
                                                    View Profile
                                                </button>
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-neutral-100 py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FFF5F6] transition-colors text-[#D4868C] text-sm w-full"
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
                            className="md:hidden p-2.5 rounded-full hover:bg-[#F5F3FF] transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-neutral-600" />
                            ) : (
                                <Menu className="w-5 h-5 text-neutral-600" />
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
                            className="md:hidden border-t border-neutral-100 mt-3 pt-3 pb-2"
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
                                            ? 'text-[#8B7FDB] bg-[#F5F3FF] font-medium'
                                            : 'text-neutral-600 hover:bg-[#F5F3FF]/50'
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
