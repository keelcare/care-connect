'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldCheck,
  UserCog,
  AlertTriangle,
  Star,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavSection {
  label: string | null;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: null,
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    ],
  },
  {
    label: 'Management',
    items: [
      { icon: Users, label: 'Users', href: '/admin/users' },
      { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
      { icon: ShieldCheck, label: 'Verify Nannies', href: '/admin/verifications' },
      { icon: UserCog, label: 'Manual Assign', href: '/admin/manual-assignment' },
    ],
  },
  {
    label: 'Moderation',
    items: [
      { icon: AlertTriangle, label: 'Disputes', href: '/admin/disputes' },
      { icon: Star, label: 'Reviews', href: '/admin/reviews' },
      { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
      { icon: LifeBuoy, label: 'Support', href: '/admin/support' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ],
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({
  isCollapsed,
  onToggle,
  onMobileClose,
  pathname,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
  pathname: string | null;
}) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.removeItem('locationChecked');
      addToast({ message: 'Logged out successfully', type: 'success' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
      addToast({ message: 'Failed to log out', type: 'error' });
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className={`flex items-center h-16 border-b border-white/8 shrink-0 transition-all duration-300 ${isCollapsed ? 'px-4 justify-center' : 'px-5'
          }`}
      >
        {isCollapsed ? (
          <Image src="/logo.svg" alt="Keel" width={28} height={28} className="rounded-md" />
        ) : (
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Keel" width={30} height={30} className="rounded-md" />
            <div>
              <p className="text-white font-bold text-sm leading-none">Keel</p>
              <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase leading-none mt-0.5">
                Admin
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_SECTIONS.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.label && !isCollapsed && (
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em] px-3 mb-2">
                {section.label}
              </p>
            )}
            {section.label && isCollapsed && (
              <div className="h-px bg-white/6 mx-2 mb-2" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-xl transition-all duration-150 group relative ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2.5'
                      } ${active
                        ? 'bg-white/12 text-white'
                        : 'text-white/50 hover:text-white/90 hover:bg-white/6'
                      }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full" />
                    )}
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${active ? 'text-white' : 'text-white/40 group-hover:text-white/80'
                        }`}
                    />
                    {!isCollapsed && (
                      <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Logout Section */}
      <div className="p-3 border-t border-white/6 shrink-0 space-y-1">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-3 mb-1">
            <Avatar
              src={user.profiles?.profile_image_url || undefined}
              alt={user.profiles?.first_name || 'User'}
              fallback={user.profiles?.first_name?.[0] || 'A'}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.profiles?.first_name || 'Admin'}
              </p>
              <p className="text-[10px] text-white/40 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {isCollapsed && user && (
          <div className="flex justify-center py-2 mb-1">
            <Avatar
              src={user.profiles?.profile_image_url || undefined}
              alt={user.profiles?.first_name || 'User'}
              fallback={user.profiles?.first_name?.[0] || 'A'}
              size="sm"
            />
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-2.5'
            }`}
          title={isCollapsed ? 'Log Out' : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm font-medium">Log Out</span>}
        </button>

        {/* Collapse Toggle (desktop only) */}
        <div className="hidden md:block pt-1">
          <button
            onClick={onToggle}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/6 transition-all duration-150"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const pathname = usePathname();

  const sharedProps = { isCollapsed, onToggle, onMobileClose, pathname };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-[hsl(208,67%,8%)] transition-all duration-300 ${isCollapsed ? 'w-[68px]' : 'w-60'
          }`}
      >
        <SidebarContent {...sharedProps} />
      </aside>

      {/* Mobile: Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="relative flex flex-col w-60 h-full bg-[hsl(208,67%,8%)] shadow-2xl">
            <SidebarContent {...sharedProps} />
          </aside>
          {/* Close button */}
          <button
            onClick={onMobileClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white p-1.5 rounded-lg bg-white/10"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
};
