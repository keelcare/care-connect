"use client";

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { FeaturedCaregivers } from '@/components/features/FeaturedCaregivers';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function BrowsePage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 md:pb-8">
            {/* Header Section */}
            <div className="bg-white border-b border-neutral-200 pt-8 pb-6 px-4 md:px-8 sticky top-0 z-10 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 font-display">
                        Welcome back, {user?.profiles?.first_name || 'Parent'}
                    </h1>
                    <p className="text-neutral-500 mt-2">
                        Find the perfect care for your family today.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 mt-6">
                {/* Featured Section */}
                <FeaturedCaregivers />

                {/* Nearby Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900 font-display">Nearby Caregivers</h2>
                        <Link href="/search?sort=distance">
                            <Button variant="ghost" className="text-primary hover:text-primary-600">
                                See All
                            </Button>
                        </Link>
                    </div>

                    {/* Placeholder for Nearby Grid - Reusing Featured for demo but would be different data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* In a real app, this would be a map of nearby caregivers */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="opacity-50 hover:opacity-100 transition-opacity">
                                <div className="bg-white rounded-3xl h-64 flex items-center justify-center border border-neutral-200 border-dashed">
                                    <p className="text-neutral-400 font-medium">Nearby Caregiver {i}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Mobile FAB */}
            <div className="fixed bottom-6 right-6 md:hidden z-50">
                <Link href="/search">
                    <Button size="lg" className="rounded-full w-14 h-14 shadow-strong bg-primary hover:bg-primary-600 text-white p-0 flex items-center justify-center">
                        <Search size={24} />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
