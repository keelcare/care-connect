"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        router.push('/');
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        router.push('/dashboard/profile');
    };

    const getUserDisplayName = () => {
        if (user?.profiles?.first_name) {
            return user.profiles.first_name;
        }
        return user?.email?.split('@')[0] || 'User';
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/70 backdrop-blur-md shadow-soft'
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-bold text-primary tracking-tight">
                        Care Connect
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {loading ? (
                        <div className="w-24 h-10 bg-neutral-200 rounded-full animate-pulse"></div>
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 border border-neutral-200 transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold">
                                    {getUserDisplayName().charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-neutral-800">
                                    {getUserDisplayName()}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-neutral-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-strong border border-neutral-100 py-2 z-20">
                                        {user.role === 'nanny' && (
                                            <>
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                                >
                                                    <User size={18} />
                                                    <span className="font-medium">Dashboard</span>
                                                </Link>
                                                <Link
                                                    href="/dashboard/messages"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                                >
                                                    <User size={18} />
                                                    <span className="font-medium">Messages</span>
                                                </Link>
                                            </>
                                        )}
                                        {user.role === 'parent' && (
                                            <>
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
                                            href="/dashboard/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                        >
                                            <User size={18} />
                                            <span className="font-medium">View Profile</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/settings"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                                        >
                                            <Settings size={18} />
                                            <span className="font-medium">Settings</span>
                                        </Link>
                                        <hr className="my-2 border-neutral-100" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            <span className="font-medium">Log Out</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-neutral-600 hover:text-primary font-medium transition-colors">
                                Log In
                            </Link>
                            <Link href="/auth/signup">
                                <Button className="rounded-full bg-primary hover:bg-primary-600 text-white px-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                    Join Now
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-full hover:bg-white/50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <i className={`lni ${isMobileMenuOpen ? 'lni-close' : 'lni-menu'} text-2xl text-neutral-700`}></i>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white/90 backdrop-blur-xl md:hidden pt-24 px-6">
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="w-32 h-12 bg-neutral-200 rounded-full animate-pulse"></div>
                        </div>
                    ) : user ? (
                        <nav className="flex flex-col space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-lg">
                                    {getUserDisplayName().charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-neutral-800">{getUserDisplayName()}</p>
                                    <p className="text-sm text-neutral-500">{user.email}</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full text-left px-6 py-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-neutral-700"
                            >
                                <User size={20} />
                                <span className="font-medium text-lg">View Profile</span>
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full text-left px-6 py-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-neutral-700"
                            >
                                <Settings size={20} />
                                <span className="font-medium text-lg">Settings</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-6 py-4 bg-red-50 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-red-600"
                            >
                                <LogOut size={20} />
                                <span className="font-medium text-lg">Log Out</span>
                            </button>
                        </nav>
                    ) : (
                        <nav className="flex flex-col space-y-6 text-center">
                            <Link
                                href="/auth/login"
                                className="text-2xl font-medium text-neutral-800 hover:text-primary transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link
                                href="/auth/signup"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Button className="w-full rounded-full bg-primary text-white text-lg py-6 shadow-xl">
                                    Join Now
                                </Button>
                            </Link>
                        </nav>
                    )}
                </div>
            )}
        </header>
    );
};
