'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing-new/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-background">
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}
