'use client';

import React, { useState, useEffect } from 'react';
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
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { Avatar } from '@/components/ui/avatar';
import { usePreferences } from '@/hooks/usePreferences';
import { LocationModal } from '@/components/features/LocationModal';
import { useSocket } from '@/context/SocketProvider';


const NAV_ITEMS_PARENT = [
  { href: '/parent-dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/bookings', label: 'My Bookings', icon: LayoutDashboard }, // using LayoutDashboard as placeholder if Calendar not imported, but I should import Calendar
  { href: '/book-service', label: 'Book a Service', icon: Settings }, // Helper to fix icons later
  { href: '/parent-dashboard/family', label: 'My Family', icon: User },
  { href: '/contact', label: 'Contact', icon: MapPin }, // Icon placeholder
];

const NAV_ITEMS_NANNY = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'Bookings', icon: LayoutDashboard },
  { href: '/dashboard/availability', label: 'Availability', icon: Settings },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToast();
  const { preferences } = usePreferences();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { onNotification, offNotification } = useSocket();
  const [hasUnread, setHasUnread] = useState(false);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNotification = () => {
      setHasUnread(true);
    };

    onNotification(handleNotification);
    return () => {
      offNotification(handleNotification);
    };
  }, [onNotification, offNotification]);

  // Reset unread status when visiting notifications page
  useEffect(() => {
    if (pathname === '/notifications' || pathname === '/dashboard/notifications') {
      setHasUnread(false);
    }
  }, [pathname]);

  // Close menus when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

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

  // Helper to determine active state
  const isActive = (href: string) => {
      if (href === '/parent-dashboard' || href === '/dashboard') return pathname === href;
      return pathname?.startsWith(href);
  };

  const navItems = user?.role === 'nanny' ? NAV_ITEMS_NANNY : (user?.role === 'parent' ? NAV_ITEMS_PARENT : []);

  // Don't show header on auth pages if they are handled by layout logic
  if (pathname?.startsWith('/auth')) return null;

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none">
        <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-white/20 rounded-full shadow-lg shadow-primary-900/5 px-4 md:px-6 py-3 flex items-center justify-between pointer-events-auto">
          
          {/* Logo */}
          <Link href={user ? (user.role === 'nanny' ? '/dashboard' : '/parent-dashboard') : "/"} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
              <img src="/logo.svg" alt="Keel Logo" className="h-6 w-auto" />
            </div>
            <span className="text-xl font-bold font-display text-primary-900 tracking-tight">Keel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {!user && (
              <div className="flex items-center gap-6 mr-4">
                 <Link href="/about" className="text-sm font-bold font-body text-primary-900/70 hover:text-primary-900 transition-colors">
                  About
                </Link>
                <Link href="/how-it-works" className="text-sm font-bold font-body text-primary-900/70 hover:text-primary-900 transition-colors">
                  How it Works
                </Link>
                <Link href="/search" className="text-sm font-bold font-body text-primary-900/70 hover:text-primary-900 transition-colors">
                  Find Care
                </Link>
              </div>
            )}
             {user && (
               <div className="flex items-center p-1 bg-neutral-100/50 rounded-full border border-neutral-200/50">
                {navItems.map((item) => (
                    <Link 
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            isActive(item.href) 
                            ? 'bg-white text-primary-900 shadow-sm' 
                            : 'text-neutral-500 hover:text-primary-900 hover:bg-white/50'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
               </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Location Selector - Desktop */}
            <button 
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-full border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus:outline-none"
              onClick={() => setIsLocationModalOpen(true)}
              aria-label="Set location"
              type="button"
            >
              <MapPin size={16} className="text-neutral-500" />
              <span className="text-xs font-bold truncate max-w-[120px]">
                {preferences.location?.address ||
                  user?.profiles?.address ||
                  'Set Location'}
              </span>
              <ChevronDown size={14} className="text-neutral-400" />
            </button>

            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                {/* Notifications */}
                <button
                    onClick={() => router.push(user.role === 'nanny' ? '/dashboard/notifications' : '/notifications')}
                    className="relative p-2 text-primary-900/70 hover:text-primary-900 transition-colors rounded-full hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full outline-none"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {hasUnread && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsProfileOpen(false);
                }}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    aria-label="User menu"
                    id="user-menu-button"
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
                        ringColor="bg-neutral-50"
                      />
                      <ChevronDown
                      size={14}
                      className={`text-neutral-400 transition-transform duration-200 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                   {/* Dropdown Menu */}
                   <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30 cursor-default"
                          onClick={() => setIsProfileOpen(false)}
                        />
                         <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-40"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="user-menu-button"
                        >
                           <div className="px-5 py-3 border-b border-neutral-50 mb-1">
                            <p className="text-sm font-bold text-primary-900 truncate">
                              {user.profiles?.first_name || 'User'}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
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
                             className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-primary-900 transition-colors focus:bg-neutral-50 focus:outline-none"
                             role="menuitem"
                          >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                          </Link>

                          <Link
                            href="/settings"
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-primary-900 transition-colors focus:bg-neutral-50 focus:outline-none"
                            role="menuitem"
                          >
                            <Settings size={18} />
                            <span>Settings</span>
                          </Link>

                           <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              handleLogout();
                            }}
                             className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors focus:bg-red-50 focus:outline-none"
                             role="menuitem"
                          >
                            <LogOut size={18} />
                            <span>Log Out</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                   </AnimatePresence>
                </div>
              </div>
            ) : (
               <div className="hidden sm:flex items-center gap-4">
                <Link href="/auth/login" className="text-sm font-bold text-primary-900 hover:text-primary-900/70 transition-colors">
                  Log In
                </Link>
                <Link href="/auth/signup">
                  <button className="bg-primary-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/10">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

             {/* Mobile Menu Button */}
             <button 
               className="md:hidden text-primary-900 p-2" 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               aria-label={isMenuOpen ? "Close menu" : "Open menu"}
               aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="md:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mx-auto pointer-events-auto"
            >
               {/* Location Mobile */}
               <button
                  className="w-full flex items-center gap-2 px-3 py-3 bg-neutral-50 rounded-xl mb-4 border border-neutral-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsLocationModalOpen(true);
                  }}
                  aria-label="Set location"
                >
                  <MapPin size={18} className="text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700 truncate flex-1 text-left">
                    {preferences.location?.address || user?.profiles?.address || 'Set Location'}
                  </span>
                  <ChevronDown size={14} className="text-neutral-400" />
                </button>

              <div className="flex flex-col gap-4">
                 {!user && (
                    <>
                      <Link href="/about" className="text-lg font-bold font-body text-primary-900" onClick={() => setIsMenuOpen(false)}>
                        About
                      </Link>
                      <Link href="/how-it-works" className="text-lg font-bold font-body text-primary-900" onClick={() => setIsMenuOpen(false)}>
                        How it Works
                      </Link>
                       <Link href="/search" className="text-lg font-bold font-body text-primary-900" onClick={() => setIsMenuOpen(false)}>
                        Find Care
                      </Link>
                      <div className="h-px bg-neutral-100 my-2" />
                      <Link href="/auth/login" className="text-lg font-bold text-primary-900" onClick={() => setIsMenuOpen(false)}>
                        Log In
                      </Link>
                       <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full bg-primary-900 text-white px-8 py-3 rounded-full font-bold shadow-md">
                          Sign Up
                        </button>
                      </Link>
                    </>
                 )}

                 {user && (
                    <>
                        {navItems.map((item) => (
                             <Link 
                                key={item.href}
                                href={item.href} 
                                className={`text-lg font-bold p-2 rounded-lg -ml-2 ${isActive(item.href) ? 'text-primary-900 bg-neutral-50' : 'text-neutral-600'}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                       
                      <div className="h-px bg-neutral-100 my-2" />
                      
                      <Link 
                        href="/settings" 
                         className="text-lg font-bold text-primary-900 hover:bg-neutral-50 p-2 rounded-lg -ml-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                         Settings
                      </Link>
                       <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="text-left text-lg font-bold text-red-600 hover:bg-red-50 p-2 rounded-lg -ml-2"
                      >
                         Log Out
                      </button>
                    </>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

       <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
};
