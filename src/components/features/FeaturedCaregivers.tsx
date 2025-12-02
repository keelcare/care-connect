"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { useAuth } from '@/context/AuthContext';

interface CaregiverData {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    location: string;
    description: string;
    hourlyRate: number;
    experience: string;
    isVerified: boolean;
}

interface FeaturedCaregiversProps {
    onDataLoaded?: (ids: string[]) => void;
}

export const FeaturedCaregivers: React.FC<FeaturedCaregiversProps> = ({ onDataLoaded }) => {
    const router = useRouter();
    const { user } = useAuth();
    const [caregivers, setCaregivers] = useState<CaregiverData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCaregivers = async () => {
            try {
                setLoading(true);
                let nannies: any[] = [];

                // 1. If user is logged in and has location (lat/lng), fetch nearby nannies within 10km
                if (user?.profiles?.lat && user?.profiles?.lng) {
                    const lat = parseFloat(user.profiles.lat);
                    const lng = parseFloat(user.profiles.lng);

                    try {
                        // Fetch nannies within 10km radius
                        const response = await api.location.nearbyNannies(lat, lng, 10);
                        // Map NearbyNanny structure to User-like structure for transformation
                        nannies = response.data.map(n => ({
                            ...n,
                            profiles: n.profile,
                            nanny_details: n.nanny_details
                        }));
                    } catch (locErr) {
                        console.error("Failed to fetch nearby nannies:", locErr);
                        // Fallback to fetching all nannies if location search fails
                        nannies = await api.users.nannies();
                    }
                } else {
                    // 2. If no user or no location, fetch all nannies (default behavior)
                    nannies = await api.users.nannies();
                }

                // Transform the API data
                const transformedData: CaregiverData[] = nannies.slice(0, 3).map((nanny: any) => ({
                    id: nanny.id,
                    name: `${nanny.profiles?.first_name || ''} ${nanny.profiles?.last_name || ''}`.trim() || 'Anonymous',
                    rating: 4.8, // TODO: Calculate from reviews when available
                    reviewCount: 0, // TODO: Get from reviews API when available
                    location: nanny.profiles?.address || 'Location not specified',
                    description: nanny.nanny_details?.bio || 'Experienced caregiver',
                    hourlyRate: parseFloat(nanny.nanny_details?.hourly_rate || '0'),
                    experience: `${nanny.nanny_details?.experience_years || 0} years`,
                    isVerified: nanny.is_verified || false,
                }));

                setCaregivers(transformedData);
                if (onDataLoaded) {
                    onDataLoaded(transformedData.map(c => c.id));
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching caregivers:', err);
                setError('Failed to load caregivers');
                setCaregivers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCaregivers();
    }, [user]); // Re-run when user changes

    return (
        <section className="py-8">
            <div className="flex items-end justify-between mb-6 px-4 md:px-0">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 font-display">Featured Caregivers</h2>
                    <p className="text-neutral-500 mt-1">
                        {user ? "Professionals in your area" : "Highly rated professionals near you"}
                    </p>
                </div>
                <Link href="/search" className="hidden lg:block">
                    <Button variant="ghost" className="text-stone-600 hover:text-stone-900 hover:bg-stone-100">
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
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 text-center">
                    <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-900 font-medium mb-2">{error}</p>
                    {user && !user.profiles?.address && (
                        <Link href="/dashboard/settings">
                            <Button variant="outline" className="mt-2">
                                Update Location
                            </Button>
                        </Link>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && caregivers.length === 0 && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 text-center">
                    <p className="text-neutral-600 font-medium">No caregivers found in your area</p>
                    <p className="text-neutral-500 text-sm mt-2">Try expanding your search or check back later.</p>
                    <Link href="/search">
                        <Button variant="outline" className="mt-4">
                            Browse All
                        </Button>
                    </Link>
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
                                    onBook={() => router.push(`/book/${caregiver.id}`)}
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
