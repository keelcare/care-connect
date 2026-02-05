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
            <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-[#E4DDD3] rounded-full shadow-warm px-4 md:px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-[#F4F7F5] rounded-full flex items-center justify-center group-hover:bg-[#E3EBE6] transition-colors">
                            <img src="/logo.svg" alt="Keel Logo" className="h-6 w-auto" />
                        </div>
                        <span className="text-xl font-display font-normal text-[#37322D] tracking-tight hidden sm:block">
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
                                    className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all ${active
                                        ? 'text-[#4A6C5B] bg-[#F4F7F5]'
                                        : 'text-[#6B5D52] hover:text-[#37322D] hover:bg-[#EFEBE6]'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </div>
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-[#F4F7F5] rounded-full -z-10"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
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
                            className="relative p-2.5 rounded-full hover:bg-[#EFEBE6] transition-colors"
                        >
                            <Bell className="w-5 h-5 text-[#6B5D52]" />
                            {/* Notification badge */}
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B87356] rounded-full" />
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-[#EFEBE6] transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A6C5B] to-[#B87356] flex items-center justify-center text-white font-medium text-sm">
                                    {user?.profiles?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-[#6B5D52] transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''
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
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-[#E4DDD3] overflow-hidden z-50"
                                        >
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-[#E4DDD3] bg-[#FDFCFA]">
                                                <p className="font-medium text-[#37322D] text-sm">
                                                    {user?.profiles?.first_name} {user?.profiles?.last_name}
                                                </p>
                                                <p className="text-xs text-[#6B5D52] truncate">{user?.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <button
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#EFEBE6] transition-colors text-[#6B5D52] text-sm text-left"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                >
                                                    <User className="w-4 h-4" />
                                                    View Profile
                                                </button>
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-[#E4DDD3] py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FBF6F4] transition-colors text-[#B87356] text-sm w-full"
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
                            className="md:hidden p-2.5 rounded-full hover:bg-[#EFEBE6] transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-[#6B5D52]" />
                            ) : (
                                <Menu className="w-5 h-5 text-[#6B5D52]" />
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
                            className="md:hidden border-t border-[#E4DDD3] mt-3 pt-3 pb-2"
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
                                            ? 'text-[#4A6C5B] bg-[#F4F7F5] font-medium'
                                            : 'text-[#6B5D52] hover:bg-[#EFEBE6]'
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
