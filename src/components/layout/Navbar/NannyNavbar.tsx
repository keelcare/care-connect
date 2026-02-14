import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, CalendarCheck, Users, User, Menu, X, LogOut, Settings, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/hooks/usePreferences';
import { LogoPill } from './LogoPill';
import { NavItem } from './NavItem';
import { NotificationButton } from './NotificationButton';
import { ProfileChip } from './ProfileChip';
import { LocationModal } from '@/components/features/LocationModal';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
    { href: '/dashboard/availability', label: 'Availability', icon: CalendarCheck },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export function NannyNavbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { preferences } = usePreferences();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname?.startsWith(href);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left: Logo */}
                    <LogoPill />

                    {/* Center: Desktop Navigation */}
                    <div className="hidden md:flex items-center p-1 bg-white/40 backdrop-blur-xl rounded-full border border-white/50 shadow-sm">
                        {NAV_ITEMS.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                isActive={isActive(item.href)}
                            />
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Location Selector */}
                        <div
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-md rounded-full border border-white/60 text-dashboard-text-secondary hover:border-dashboard-accent-start hover:bg-white/70 transition-all cursor-pointer shadow-sm"
                            onClick={() => setIsLocationModalOpen(true)}
                        >
                            <MapPin size={16} className="text-dashboard-text-secondary" />
                            <span className="text-xs font-medium truncate max-w-[120px]">
                                {preferences.location?.address ||
                                    user?.profiles?.address ||
                                    'Set Location'}
                            </span>
                            <ChevronDown size={12} className="text-dashboard-text-secondary" />
                        </div>

                        <NotificationButton />

                        <div className="hidden md:block relative">
                            <ProfileChip
                                name={user?.profiles?.first_name || 'User'}
                                image={user?.profiles?.profile_image_url || undefined}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            />
                            {/* Desktop Profile Dropdown */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-[24px] shadow-premium border border-white/60 p-2 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100/50">
                                                <p className="text-sm font-semibold text-dashboard-text-primary">{user?.profiles?.first_name} {user?.profiles?.last_name}</p>
                                                <p className="text-xs text-dashboard-text-secondary truncate">{user?.email}</p>
                                            </div>
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-dashboard-text-secondary hover:text-dashboard-text-primary hover:bg-white/50 rounded-xl transition-colors">
                                                <User className="w-4 h-4" /> Profile
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-dashboard-text-secondary hover:text-dashboard-text-primary hover:bg-white/50 rounded-xl transition-colors">
                                                <Settings className="w-4 h-4" /> Settings
                                            </button>
                                            <div className="h-px bg-gray-100/50 my-1" />
                                            <button
                                                onClick={() => logout()}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/60 flex items-center justify-center text-dashboard-text-secondary"
                        >
                            <Menu className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-white/95 backdrop-blur-2xl border-l border-white/60 shadow-2xl z-50 p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-display font-bold text-dashboard-accent-start">Menu</h2>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 bg-gray-100/50 rounded-full text-gray-500 hover:text-gray-900"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-2 flex-1">
                                {NAV_ITEMS.map((item) => (
                                    <NavItem
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        isActive={isActive(item.href)}
                                    />
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={user?.profiles?.profile_image_url || '/placeholder-avatar.png'}
                                            alt="Profile"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{user?.profiles?.first_name}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => logout()}
                                    className="w-full flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Location Modal */}
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
            />
        </>
    );
}
