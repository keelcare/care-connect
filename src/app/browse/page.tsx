"use client";

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { FeaturedCaregivers } from '@/components/features/FeaturedCaregivers';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { ProfileCard } from '@/components/features/ProfileCard';

import ParentLayout from '@/components/layout/ParentLayout';
import { usePreferences } from '@/hooks/usePreferences';

export default function BrowsePage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [featuredIds, setFeaturedIds] = React.useState<Set<string>>(new Set());

    const handleFeaturedLoaded = (ids: string[]) => {
        setFeaturedIds(new Set(ids));
    };
    const [nearbyNannies, setNearbyNannies] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [updatingLocation, setUpdatingLocation] = React.useState(false);
    const { preferences, updatePreferences } = usePreferences();

    const handleUpdateLocation = () => {
        if (!navigator.geolocation) {
            addToast({ message: "Geolocation is not supported by your browser", type: "error" });
            return;
        }

        setUpdatingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    if (user?.id) {
                        await api.users.update(user.id, {
                            lat: latitude,
                            lng: longitude,
                        });

                        // Wait for backend reverse geocoding to complete
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Fetch updated user data to get the address
                        const updatedUser = await api.users.me();

                        // Update preferences with location
                        updatePreferences({
                            location: {
                                lat: latitude,
                                lng: longitude,
                                address: updatedUser.profiles?.address || 'Current Location'
                            }
                        });

                        addToast({ message: "Location updated successfully", type: "success" });
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("Error updating location:", error);
                    addToast({ message: "Failed to update location", type: "error" });
                } finally {
                    setUpdatingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                addToast({ message: "Unable to retrieve your location", type: "error" });
                setUpdatingLocation(false);
            }
        );
    };

    React.useEffect(() => {
        const fetchNearby = async () => {
        try {
            setLoading(true);
            
            let lat: number | null = null;
            let lng: number | null = null;

            // 1. Try to get location from user profile first
            if (user?.profiles?.lat && user?.profiles?.lng) {
                lat = parseFloat(user.profiles.lat);
                lng = parseFloat(user.profiles.lng);
            }

            // 2. If not in profile, try browser geolocation
            if (lat === null || lng === null) {
                if (navigator.geolocation) {
                    try {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        });
                        lat = position.coords.latitude;
                        lng = position.coords.longitude;
                    } catch (e) {
                        console.log("Geolocation permission denied or failed", e);
                    }
                }
            }

            if (lat !== null && lng !== null) {
                // Use backend API with radius 10km
                const response = await api.location.nearbyNannies(lat, lng, 10);

                if (response.data && response.data.length > 0) {
                    // Map nearby nannies to User type
                    const mappedNannies = response.data.map(n => ({
                        ...n,
                        profiles: n.profile,
                        nanny_details: n.nanny_details,
                        distance: n.distance
                    } as unknown as User));

                    setNearbyNannies(mappedNannies);
                } else {
                    setNearbyNannies([]);
                }
            } else {
                // If no location, fetch all (unsorted)
                const allNannies = await api.users.nannies();
                setNearbyNannies(allNannies);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load nearby caregivers.");
        } finally {
            setLoading(false);
        }
    };

        if (user) {
            fetchNearby();
        }
    }, [user]);

    // Filter nearby nannies to exclude featured ones
    const filteredNearbyNannies = nearbyNannies.filter(nanny => !featuredIds.has(nanny.id));

    return (
        <ParentLayout>
            <div className="min-h-screen bg-neutral-50 pb-20 md:pb-8">


                <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 mt-8">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-50 via-white to-primary-50 border border-primary-100 shadow-soft">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
                        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-xl space-y-6">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight text-neutral-900">
                                    Find the perfect <span className="text-primary-600">caregiver</span> for your family.
                                </h1>
                                <p className="text-lg text-neutral-900 max-w-md leading-relaxed font-medium">
                                    Connect with trusted, verified professionals for child care, senior care, and more.
                                </p>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <Link href="/search">
                                        <Button size="lg" className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-bold px-8 h-12 shadow-lg min-w-[180px]">
                                            Start Searching
                                        </Button>
                                    </Link>
                                    <Link href="/how-it-works">
                                        <Button variant="outline" size="lg" className="rounded-full bg-white text-stone-900 border-stone-200 hover:bg-stone-50 font-medium px-8 h-12 min-w-[180px]">
                                            How it Works
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden md:block relative">
                                {/* Decorative elements could go here */}
                            </div>
                        </div>
                    </section>

                    {/* Categories Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 font-display mb-6">Browse by Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { name: 'Child Care', icon: '👶', query: 'childCare' },
                                { name: 'Senior Care', icon: '👵', query: 'seniorCare' },
                                { name: 'Pet Care', icon: '🐾', query: 'petCare' },
                                { name: 'Housekeeping', icon: '🧹', query: 'housekeeping' },
                                { name: 'Tutoring', icon: '📚', query: 'tutoring' },
                                { name: 'Special Needs', icon: '💙', query: 'specialNeeds' },
                            ].map((category) => (
                                <Link href={`/search?service=${category.query}`} key={category.name}>
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col items-center gap-3 text-center group cursor-pointer h-full justify-center">
                                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                                        <span className="font-medium text-neutral-900 group-hover:text-primary-700">{category.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                    {/* Featured Section */}
                    <FeaturedCaregivers onDataLoaded={handleFeaturedLoaded} />

                    {/* Nearby Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900 font-display">Nearby Caregivers</h2>
                            <Link href="/search?sort=distance">
                                <Button variant="ghost" className="text-stone-700 hover:text-stone-900 hover:bg-stone-100">
                                    See All
                                </Button>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-neutral-500">Loading nearby caregivers...</div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>
                        ) : filteredNearbyNannies.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-3xl border border-neutral-100">
                                <p className="text-neutral-500 mb-4">No other caregivers found nearby.</p>
                                <Link href="/dashboard/profile">
                                    <Button variant="outline" className="border-stone-200 text-stone-900">Update Location</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredNearbyNannies.map((nanny: any) => (
                                    <ProfileCard
                                        key={nanny.id}
                                        name={`${nanny.profiles?.first_name || 'Caregiver'} ${nanny.profiles?.last_name || ''}`}
                                        rating={4.8} // Mock data
                                        reviewCount={12} // Mock data
                                        location={nanny.profiles?.address || 'Location not specified'}
                                        description={nanny.nanny_details?.bio || 'No description available.'}
                                        hourlyRate={Number(nanny.nanny_details?.hourly_rate) || 20}
                                        experience={`${nanny.nanny_details?.experience_years || 0} years`}
                                        isVerified={nanny.is_verified}
                                        distance={nanny.distance}
                                        onViewProfile={() => window.location.href = `/caregiver/${nanny.id}`}
                                        onBook={() => window.location.href = `/book/${nanny.id}`}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                {/* Mobile FAB */}
                <div className="fixed bottom-6 right-6 md:hidden z-50">
                    <Link href="/search">
                        <Button size="lg" className="rounded-full w-14 h-14 shadow-xl bg-stone-900 hover:bg-stone-800 text-white p-0 flex items-center justify-center">
                            <Search size={24} />
                        </Button>
                    </Link>
                </div>
            </div>
        </ParentLayout>
    );
}
