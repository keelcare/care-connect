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
  CreditCard,
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
      { icon: CreditCard, label: 'Payment Audit', href: '/admin/payment-audit' },
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
        className={`flex items-center h-16 border-b border-white/10 shrink-0 transition-all duration-300 ${isCollapsed ? 'px-4 justify-center' : 'px-8'
          }`}
      >
        {isCollapsed ? (
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Keel"
              width={16}
              height={16}
              className="h-4 w-auto brightness-0 invert"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Image src="/logo.svg" alt="Keel" width={20} height={20} className="h-5 w-auto" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none font-display">Keel</p>
              <p className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase leading-none mt-1">
                Admin Console
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
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-4 mb-2">
                {section.label}
              </p>
            )}
            {section.label && isCollapsed && (
              <div className="h-px bg-white/5 mx-4 mb-2" />
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
                    className={`flex items-center gap-3 rounded-xl transition-all duration-200 group relative ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
                      } ${active
                        ? 'bg-accent text-primary-900 shadow-lg shadow-accent/20'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${active ? 'text-primary-900' : 'text-white/40 group-hover:text-white'
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
      <div className="p-4 border-t border-white/10 shrink-0 space-y-2">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-white/5 rounded-2xl border border-white/10">
            <Avatar
              src={user.profiles?.profile_image_url || undefined}
              alt={user.profiles?.first_name || 'User'}
              fallback={user.profiles?.first_name?.[0] || 'A'}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user.profiles?.first_name || 'Admin'}
              </p>
              <p className="text-[10px] text-white/50 truncate">
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
          className={`flex items-center gap-3 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200 ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
            }`}
          title={isCollapsed ? 'Log Out' : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm font-semibold">Log Out</span>}
        </button>
        {/* Collapse Toggle (desktop only) */}
        <div className="hidden md:block pt-1">
          <button
            onClick={onToggle}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Collapse</span>
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
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-[#0B1221] border-r border-white/5 transition-all duration-300 shadow-2xl ${isCollapsed ? 'w-20' : 'w-72'
          }`}
      >
        <SidebarContent {...sharedProps} />
      </aside>

      {/* Mobile: Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="relative flex flex-col w-72 h-full bg-[#0B1221] shadow-2xl transition-transform duration-300 ease-out">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onMobileClose}
                className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent {...sharedProps} />
          </aside>
        </div>
      )}
    </>
  );
};
