'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Repeat,
  Heart,
  Star,
  Copy,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ParentSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const ParentSidebar: React.FC<ParentSidebarProps> = ({
  isCollapsed = false,
  onToggle,
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', href: '/parent-dashboard' },
    { icon: Heart, label: 'Saved Caregivers', href: '/favorites' },
    { icon: Sparkles, label: 'Book a Service', href: '/book-service' },
    { icon: Calendar, label: 'Your Bookings', href: '/bookings' },
    { icon: Repeat, label: 'Recurring', href: '/recurring-bookings' },
    { icon: User, label: 'My Family', href: '/dashboard/family' },
  ];

  return (
    <aside
      className={`bg-white border-r border-neutral-200 fixed top-[72px] h-[calc(100vh-72px)] z-30 hidden md:flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:bg-neutral-50 z-50"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? (
          <ChevronRight size={14} className="text-neutral-600" />
        ) : (
          <ChevronLeft size={14} className="text-neutral-600" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        <p
          className={`text-xs font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 select-none' : 'opacity-100'}`}
        >
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          // Exact match for root/home, startsWith for others to handle subpaths
          const isActive = item.href === '/browse' || item.href === '/'
            ? pathname === item.href
            : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-accent text-white shadow-md'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-accent'
                } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-accent'}`}
              />
              {!isCollapsed && (
                <span className={`${isActive ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Help Section */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-center">
            <p className="text-sm font-semibold text-neutral-900 mb-1">
              Need help choosing?
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-xs text-accent font-medium hover:underline outline-none hover:text-accent-600">
                Chat with an advisor
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-white shadow-xl border-neutral-200">
                <DropdownMenuLabel>Choose email provider</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=carecon.help@gmail.com&su=Need help choosing a caregiver', '_blank')}>
                  Gmail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open('https://outlook.office.com/mail/deeplink/compose?to=carecon.help@gmail.com&subject=Need help choosing a caregiver', '_blank')}>
                  Outlook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open('https://compose.mail.yahoo.com/?to=carecon.help@gmail.com&subject=Need help choosing a caregiver', '_blank')}>
                  Yahoo Mail
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText('carecon.help@gmail.com');
                    // You might want to add a toast/alert here to notify user
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy email address</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </aside>
  );
};
