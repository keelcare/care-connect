'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, Calendar, MessageSquare, User } from 'lucide-react';

export const MobileBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Compass, label: 'Find Care', href: '/find-care' },
    { icon: Compass, label: 'Home', href: '/parent-dashboard' },
    { icon: Calendar, label: 'Bookings', href: '/bookings' },
    { icon: User, label: 'Profile', href: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-lg border-t border-stone-200"></div>

      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href)); // Basic active check

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${isActive
                ? 'text-accent-700'
                : 'text-stone-400 hover:text-stone-600'
                }`}
            >
              <div
                className={`p-1 rounded-full transition-all ${isActive ? 'bg-accent-50' : 'bg-transparent'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
