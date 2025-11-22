"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { User } from '@/types/api';

interface CaregiverData {
    id: string;
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
    location: string;
    description: string;
    hourlyRate: number;
    experience: string;
    isVerified: boolean;
}

export const FeaturedCaregivers: React.FC = () => {
    const router = useRouter();
    const [caregivers, setCaregivers] = useState<CaregiverData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCaregivers = async () => {
            try {
                setLoading(true);
                const nannies = await api.users.nannies();

                // Transform the API data to match the ProfileCard component's expected props
                const transformedData: CaregiverData[] = nannies.slice(0, 3).map((nanny: User) => ({
                    id: nanny.id,
                    name: `${nanny.profiles?.first_name || ''} ${nanny.profiles?.last_name || ''}`.trim() || 'Anonymous',
                    image: nanny.profiles?.profile_image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
                    rating: 4.8, // TODO: Calculate from reviews when available
                    reviewCount: 0, // TODO: Get from reviews API when available
                    location: nanny.profiles?.address || 'Location not specified',
                    description: nanny.nanny_details?.bio || 'Experienced caregiver',
                    hourlyRate: parseFloat(nanny.nanny_details?.hourly_rate || '0'),
                    experience: `${nanny.nanny_details?.experience_years || 0} years`,
                    isVerified: nanny.is_verified || false,
                }));

                setCaregivers(transformedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching caregivers:', err);
                setError('Failed to load caregivers');
                // Fallback to empty array on error
                setCaregivers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCaregivers();
    }, []);

    return (
        <section className="py-8">
            <div className="flex items-end justify-between mb-6 px-4 md:px-0">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 font-display">Featured Caregivers</h2>
                    <p className="text-neutral-500 mt-1">
                        Highly rated professionals near you
                    </p>
                </div>
                <Link href="/search" className="hidden lg:block">
                    <Button variant="ghost" className="text-primary hover:text-primary-600 hover:bg-primary-50">
                        View All <ArrowRight size={16} className="ml-2" />
                    </Button>
                </Link>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[85vw] md:min-w-[350px] snap-center">
                            <div className="bg-white rounded-3xl h-96 border border-neutral-200 animate-pulse">
                                <div className="p-6 space-y-4">
                                    <div className="w-full h-48 bg-neutral-200 rounded-2xl"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <p className="text-red-500 text-sm mt-2">Please try again later or contact support.</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && caregivers.length === 0 && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 text-center">
                    <p className="text-neutral-600 font-medium">No caregivers available at the moment</p>
                    <p className="text-neutral-500 text-sm mt-2">Check back later for featured caregivers.</p>
                </div>
            )}

            {/* Carousel Container */}
            {!loading && !error && caregivers.length > 0 && (
                <>
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide">
                        {caregivers.map((caregiver, index) => (
                            <div key={index} className="min-w-[85vw] md:min-w-[350px] snap-center">
                                <ProfileCard
                                    {...caregiver}
                                    onViewProfile={() => router.push(`/caregiver/${caregiver.id}`)}
                                    onMessage={() => console.log(`Message: ${caregiver.name}`)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 lg:hidden px-4">
                        <Link href="/search">
                            <Button variant="outline" className="w-full rounded-xl border-neutral-200">
                                View All Caregivers
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
};
