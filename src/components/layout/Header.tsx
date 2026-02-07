'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  MapPin,
  LogOut,
  Settings,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastProvider';
import { Avatar } from '@/components/ui/avatar';
import { usePreferences } from '@/hooks/usePreferences';
import { LocationModal } from '@/components/features/LocationModal';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToast();
  const { preferences } = usePreferences();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.removeItem('locationChecked'); // Clear location check flag
      addToast({ message: 'Logged out successfully', type: 'success' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
      addToast({ message: 'Failed to log out', type: 'error' });
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Don't show header on auth pages or dashboard (dashboard has its own sidebar/header structure usually)
  // BUT we are now using Header in DashboardLayout for parents, so we need to be careful.
  // The RootLayout logic handles hiding it. If we render it manually in DashboardLayout, it will show.
  if (pathname?.startsWith('/auth')) return null;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 h-[72px]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href={
            !user
              ? '/'
              : user.role === 'nanny'
                ? '/dashboard'
                : user.role === 'admin'
                  ? '/admin'
                  : '/parent-dashboard'
          }
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl font-bold text-stone-900 tracking-tight font-display group-hover:opacity-80 transition-opacity">
            Keel
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/search"
            className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            Find Care
          </Link>
          <Link
            href="/about"
            className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/how-it-works"
            className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            How it Works
          </Link>
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Location Selector - Hidden on Landing Page */}
          {pathname !== '/' && (
            <div
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100 transition-colors cursor-pointer mr-2"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <MapPin size={18} className="text-stone-500" />
              <span className="text-sm font-medium truncate max-w-[150px]">
                {preferences.location?.address ||
                  user?.profiles?.address ||
                  'Set Location'}
              </span>
              <ChevronDown size={14} className="text-stone-400" />
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/notifications')}
                className="relative p-2 text-stone-500 hover:text-stone-900 transition-colors rounded-xl hover:bg-stone-100"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <Avatar
                    src={user.profiles?.profile_image_url || undefined}
                    alt={user.profiles?.first_name || 'User'}
                    fallback={
                      user.profiles?.first_name?.[0] ||
                      user.email?.[0]?.toUpperCase() ||
                      'U'
                    }
                    size="sm"
                    ringColor="bg-stone-100"
                  />
                  <ChevronDown
                    size={14}
                    className={`text-stone-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    {/* Backdrop to close */}
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-stone-50 mb-1">
                        <p className="text-sm font-semibold text-stone-900 truncate">
                          {user.profiles?.first_name || 'User'}
                        </p>
                        <p className="text-xs text-stone-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href={
                          user.role === 'nanny'
                            ? '/dashboard'
                            : user.role === 'admin'
                              ? '/admin'
                              : '/parent-dashboard'
                        }
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all bg-accent hover:bg-accent-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-xl"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white border-b border-stone-200 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="p-4 space-y-4">
            <Link
              href="/search"
              className="block px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Care
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/how-it-works"
              className="block px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <div className="border-t border-stone-100 pt-4">
              {user ? (
                <>
                  <div className="px-4 mb-4 flex items-center gap-3">
                    <Avatar
                      src={user.profiles?.profile_image_url || undefined}
                      alt={user.profiles?.first_name || 'User'}
                      fallback={
                        user.profiles?.first_name?.[0] ||
                        user.email?.[0]?.toUpperCase() ||
                        'U'
                      }
                      size="md"
                      ringColor="bg-stone-100"
                    />
                    <div>
                      <p className="font-bold text-stone-900">
                        {user.profiles?.first_name || 'User'}
                      </p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={
                      user.role === 'nanny'
                        ? '/dashboard'
                        : user.role === 'admin'
                          ? '/admin'
                          : '/parent-dashboard'
                    }
                    className="block px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-stone-200"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full rounded-xl bg-accent hover:bg-accent-600 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </header>
  );
};
