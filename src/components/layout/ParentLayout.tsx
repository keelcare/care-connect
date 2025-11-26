"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ParentSidebar } from '@/components/layout/ParentSidebar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    // Redirect nannies to dashboard
    React.useEffect(() => {
        if (!loading && user?.role === 'nanny') {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Don't render parent layout for nannies
    if (user?.role === 'nanny') {
        return null;
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-neutral-50">
                <ParentSidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />

                {/* Main Content Area with Footer */}
                <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
                    <main className="flex-1 pb-8">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}
