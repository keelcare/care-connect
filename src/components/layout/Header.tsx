"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Bell, User, LogOut, ChevronDown, Settings, LayoutDashboard, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastProvider';
import { Avatar } from '@/components/ui/avatar';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { addToast } = useToast();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            addToast({ message: 'Logged out successfully', type: 'success' });
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed', error);
            addToast({ message: 'Failed to log out', type: 'error' });
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Don't show header on auth pages or dashboard (dashboard has its own sidebar/header structure usually)
    // BUT we are now using Header in DashboardLayout for parents, so we need to be careful.
    // The RootLayout logic handles hiding it. If we render it manually in DashboardLayout, it will show.
    if (pathname?.startsWith('/auth')) return null;

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50 h-[72px]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-bold text-primary tracking-tight font-display group-hover:opacity-90 transition-opacity">
                        CareConnect
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/search" className="text-neutral-600 hover:text-primary font-medium transition-colors">
                        Find Care
                    </Link>
                    <Link href="/about" className="text-neutral-600 hover:text-primary font-medium transition-colors">
                        About Us
                    </Link>
                    <Link href="/how-it-works" className="text-neutral-600 hover:text-primary font-medium transition-colors">
                        How it Works
                    </Link>
                </nav>

                {/* Auth Buttons / User Menu */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Location Selector */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-full border border-neutral-200 text-neutral-600 hover:border-primary/30 transition-colors cursor-pointer mr-2">
                        <MapPin size={18} className="text-neutral-500" />
                        <span className="text-sm font-medium truncate max-w-[150px]">Vittal Mallya Road, ...</span>
                        <ChevronDown size={14} className="text-neutral-400" />
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-neutral-500 hover:text-primary transition-colors rounded-full hover:bg-neutral-50">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full border border-neutral-200 hover:border-primary/30 hover:bg-neutral-50 transition-all"
                                >
                                    <Avatar
                                        src={user.profiles?.profile_image_url || undefined}
                                        alt={user.profiles?.first_name || 'User'}
                                        fallback={user.profiles?.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                                        size="sm"
                                        ringColor="bg-primary/10"
                                    />
                                    <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="px-4 py-3 border-b border-neutral-50">
                                            <p className="font-bold text-neutral-900 truncate">
                                                {user.profiles?.first_name ? `${user.profiles.first_name} ${user.profiles.last_name}` : 'User'}
                                            </p>
                                            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                                        </div>

                                        <div className="py-1">
                                            {user.role === 'nanny' ? (
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                                >
                                                    <LayoutDashboard size={18} />
                                                    <span className="font-medium">Dashboard</span>
                                                </Link>
                                            ) : user.role === 'admin' ? (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                                >
                                                    <LayoutDashboard size={18} />
                                                    <span className="font-medium">Admin Dashboard</span>
                                                </Link>
                                            ) : (
                                                <Link
                                                    href="/browse"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                                >
                                                    <LayoutDashboard size={18} />
                                                    <span className="font-medium">Browse</span>
                                                </Link>
                                            )}

                                            {user.role === 'parent' && (
                                                <>
                                                    <Link
                                                        href="/book-service"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                                    >
                                                        <User size={18} />
                                                        <span className="font-medium">Book a Service</span>
                                                    </Link>
                                                    <Link
                                                        href="/bookings"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                                    >
                                                        <User size={18} />
                                                        <span className="font-medium">My Bookings</span>
                                                    </Link>
                                                    <Link
                                                        href="/messages"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                                    >
                                                        <User size={18} />
                                                        <span className="font-medium">Messages</span>
                                                    </Link>
                                                </>
                                            )}

                                            <Link
                                                href="/dashboard/settings"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                            >
                                                <Settings size={18} />
                                                <span className="font-medium">Settings</span>
                                            </Link>
                                        </div>

                                        <div className="border-t border-neutral-50 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                <span className="font-medium">Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <Button variant="ghost" className="text-neutral-600 hover:text-primary hover:bg-primary-50">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary-600 text-black">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-neutral-600 hover:bg-neutral-50 rounded-xl"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-[72px] left-0 w-full bg-white border-b border-neutral-100 shadow-xl animate-in slide-in-from-top-5 duration-200">
                    <div className="p-4 space-y-4">
                        <Link
                            href="/search"
                            className="block px-4 py-3 rounded-xl hover:bg-neutral-50 text-neutral-600 font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Find Care
                        </Link>
                        <Link
                            href="/about"
                            className="block px-4 py-3 rounded-xl hover:bg-neutral-50 text-neutral-600 font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About Us
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="block px-4 py-3 rounded-xl hover:bg-neutral-50 text-neutral-600 font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            How it Works
                        </Link>
                        <div className="border-t border-neutral-100 pt-4">
                            {user ? (
                                <>
                                    <div className="px-4 mb-4 flex items-center gap-3">
                                        <Avatar
                                            src={user.profiles?.profile_image_url || undefined}
                                            alt={user.profiles?.first_name || 'User'}
                                            fallback={user.profiles?.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                                            size="md"
                                            ringColor="bg-primary/10"
                                        />
                                        <div>
                                            <p className="font-bold text-neutral-900">
                                                {user.profiles?.first_name || 'User'}
                                            </p>
                                            <p className="text-xs text-neutral-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={user.role === 'nanny' ? '/dashboard' : user.role === 'admin' ? '/admin' : '/browse'}
                                        className="block px-4 py-3 rounded-xl hover:bg-neutral-50 text-neutral-600 font-medium"
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
                                        <Button variant="outline" className="w-full rounded-xl">Log In</Button>
                                    </Link>
                                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full rounded-xl bg-primary text-white">Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
