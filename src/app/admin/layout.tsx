'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Spinner } from '@/components/ui/Spinner';
import { Menu, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    if (!loading && user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden font-sans">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 sticky top-0 z-20 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2.5 -ml-2 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-all active:scale-95"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-primary-900 text-sm leading-tight">Keel</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-tight">Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl hover:bg-red-50 text-red-500 transition-all active:scale-95"
            aria-label="Log Out"
          >
            <LogOut size={20} />
          </button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="w-full px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
