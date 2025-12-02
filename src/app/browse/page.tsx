"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Baby, Heart, PawPrint, Home, BookOpen, Accessibility, ArrowRight, MapPin, RefreshCw } from 'lucide-react';
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

    const categories = [
        { name: 'Child Care', icon: Baby, query: 'childCare', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
        { name: 'Senior Care', icon: Heart, query: 'seniorCare', color: 'bg-rose-50 text-rose-600 hover:bg-rose-100' },
        { name: 'Pet Care', icon: PawPrint, query: 'petCare', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
        { name: 'Housekeeping', icon: Home, query: 'housekeeping', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
        { name: 'Tutoring', icon: BookOpen, query: 'tutoring', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
        { name: 'Special Needs', icon: Accessibility, query: 'specialNeeds', color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
    ];

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

                        await new Promise(resolve => setTimeout(resolve, 2000));
                        const updatedUser = await api.users.me();

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

                if (user?.profiles?.lat && user?.profiles?.lng) {
                    lat = parseFloat(user.profiles.lat);
                    lng = parseFloat(user.profiles.lng);
                }

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
                    const response = await api.location.nearbyNannies(lat, lng, 10);

                    if (response.data && response.data.length > 0) {
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

    const filteredNearbyNannies = nearbyNannies.filter(nanny => !featuredIds.has(nanny.id));

    return (
        <ParentLayout>
            <div className="min-h-screen bg-stone-50 pb-20 md:pb-8">
                <main className="max-w-7xl mx-auto px-4 md:px-6 space-y-12 pt-8">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden rounded-3xl bg-stone-900 text-white">
                        <div className="absolute inset-0 opacity-10">
                            <Image
                                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop"
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-stone-700/30 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 p-8 md:p-12 lg:p-16">
                            <div className="max-w-2xl space-y-6">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-sm font-medium text-white/90">15,000+ verified caregivers</span>
                                </div>
                                
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    Find the perfect
                                    <span className="relative inline-block mx-2">
                                        <span className="relative z-10">caregiver</span>
                                        <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-400/40 -rotate-1" />
                                    </span>
                                    <br />for your family.
                                </h1>
                                
                                <p className="text-lg text-stone-300 max-w-lg leading-relaxed">
                                    Connect with trusted, verified professionals for child care, senior care, pet care, and more.
                                </p>
                                
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <Link href="/search">
                                        <Button className="h-12 px-6 bg-white hover:bg-stone-100 text-stone-900 rounded-xl font-semibold shadow-lg group">
                                            <Search className="w-5 h-5 mr-2" />
                                            Start Searching
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link href="/how-it-works">
                                        <Button variant="outline" className="h-12 px-6 border-white/30 text-white hover:bg-white/10 rounded-xl font-medium">
                                            How it Works
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Categories Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-stone-900">Browse by Category</h2>
                                <p className="text-stone-500 mt-1">Find care that fits your needs</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category) => {
                                const IconComponent = category.icon;
                                return (
                                    <Link href={`/search?service=${category.query}`} key={category.name}>
                                        <div className="group bg-white p-6 rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300 flex flex-col items-center gap-3 text-center cursor-pointer h-full justify-center">
                                            <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                                <IconComponent className="w-7 h-7" />
                                            </div>
                                            <span className="font-medium text-stone-900">{category.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* Featured Section */}
                    <FeaturedCaregivers onDataLoaded={handleFeaturedLoaded} />

                    {/* Nearby Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-stone-900">Nearby Caregivers</h2>
                                <p className="text-stone-500 mt-1">Caregivers in your area</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="outline" 
                                    onClick={handleUpdateLocation}
                                    disabled={updatingLocation}
                                    className="rounded-xl border-stone-200 text-stone-600 hover:bg-stone-50"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${updatingLocation ? 'animate-spin' : ''}`} />
                                    Update Location
                                </Button>
                                <Link href="/search?sort=distance">
                                    <Button variant="ghost" className="text-stone-600 hover:text-stone-900 font-medium">
                                        See All
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-stone-100">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-stone-500">Loading nearby caregivers...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">
                                <p>{error}</p>
                            </div>
                        ) : filteredNearbyNannies.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
                                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-stone-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-stone-900 mb-2">No caregivers found nearby</h3>
                                <p className="text-stone-500 mb-6">Try updating your location or browse all caregivers.</p>
                                <div className="flex items-center justify-center gap-3">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleUpdateLocation}
                                        className="rounded-xl border-stone-200"
                                    >
                                        Update Location
                                    </Button>
                                    <Link href="/search">
                                        <Button className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white">
                                            Browse All
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-max">
                                {filteredNearbyNannies.map((nanny: any) => (
                                    <ProfileCard
                                        key={nanny.id}
                                        name={`${nanny.profiles?.first_name || 'Caregiver'} ${nanny.profiles?.last_name || ''}`}
                                        rating={4.8}
                                        reviewCount={12}
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
                        <Button className="rounded-full w-14 h-14 shadow-xl bg-stone-900 hover:bg-stone-800 text-white p-0 flex items-center justify-center">
                            <Search size={24} />
                        </Button>
                    </Link>
                </div>
            </div>
        </ParentLayout>
    );
}
