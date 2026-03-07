'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, Sparkles, User, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
    { href: '/parent-dashboard', label: 'Home', icon: Home },
    { href: '/bookings', label: 'Bookings', icon: Calendar },
    { href: '/book-service', label: 'Book', icon: Sparkles },
    { href: '/parent-dashboard/family', label: 'Family', icon: User },
    { href: '/support', label: 'Support', icon: HelpCircle },
];

export default function BottomNavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    const isActive = (href: string) => {
        if (href === '/parent-dashboard') {
            return pathname === '/parent-dashboard';
        }
        return pathname?.startsWith(href);
    };

    const PROTECTED_ROUTES = ['/bookings', '/book-service', '/parent-dashboard/family'];

    const handleNavClick = (e: React.MouseEvent, href: string) => {
        if (!user && PROTECTED_ROUTES.some(route => href.startsWith(route))) {
            e.preventDefault();
            router.push('/auth/login');
            // We don't have toast context here easily, but the redirect is primary
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-40 pb-safe">
            <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
                <div className="max-w-md mx-auto px-4 py-2">
                    <div className="flex items-center justify-around">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all"
                                >
                                    <div className="relative">
                                        <Icon
                                            className={`w-6 h-6 transition-colors ${active ? 'text-primary' : 'text-gray-400'
                                                }`}
                                        />
                                        {active && (
                                            <motion.div
                                                layoutId="activeBottomTab"
                                                className="absolute -inset-2 bg-background rounded-full -z-10"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs font-medium transition-colors ${active ? 'text-primary' : 'text-gray-500'
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
