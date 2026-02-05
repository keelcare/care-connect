'use client';

import React from 'react';
import { Navbar } from '@/components/landing-new/Navbar';
import { Footer } from '@/components/landing-new/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}
