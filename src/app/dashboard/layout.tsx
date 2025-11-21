"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Calendar, Settings, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './layout.module.css';

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
        { icon: User, label: 'Profile', href: '/dashboard/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.userProfile}>
                    <Image
                        src={user?.profiles?.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt="User"
                        width={40}
                        height={40}
                        className={styles.avatar}
                    />
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user?.profiles?.first_name ? `${user.profiles.first_name} ${user.profiles.last_name}` : 'Loading...'}</span>
                        <span className={styles.userRole}>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '...'}</span>
                    </div>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
