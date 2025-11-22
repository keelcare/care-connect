import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <Link href="/" className="inline-block group">
                        <span className="text-4xl font-bold text-primary tracking-tight group-hover:scale-105 transition-transform block">
                            Care
                        </span>
                    </Link>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-soft p-8 sm:p-10 border border-white/50">
                    {children}
                </div>
            </div>
        </div>
    );
}
