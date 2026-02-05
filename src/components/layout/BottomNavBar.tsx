'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, Sparkles, User } from 'lucide-react';

const NAV_ITEMS = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/bookings', label: 'Bookings', icon: Calendar },
    { href: '/book-service', label: 'Book', icon: Sparkles },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function BottomNavBar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/home') {
            return pathname === '/home';
        }
        return pathname?.startsWith(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-40 pb-safe">
            <div className="bg-white/90 backdrop-blur-xl border-t border-[#8B7FDB]/10 shadow-lg">
                <div className="max-w-md mx-auto px-4 py-2">
                    <div className="flex items-center justify-around">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all"
                                >
                                    <div className="relative">
                                        <Icon
                                            className={`w-6 h-6 transition-colors duration-300 ${
                                                active ? 'text-[#8B7FDB]' : 'text-neutral-400'
                                            }`}
                                        />
                                        {active && (
                                            <motion.div
                                                layoutId="activeBottomTab"
                                                className="absolute -inset-2 bg-[#F5F3FF] rounded-full -z-10"
                                                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs font-medium transition-colors duration-300 ${
                                            active ? 'text-[#8B7FDB]' : 'text-neutral-400'
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
