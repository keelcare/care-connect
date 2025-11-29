"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, ChevronLeft, ChevronRight, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/SearchInput';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { FilterSidebar, FilterState } from '@/components/features/FilterSidebar';
import { ProfileCard } from '@/components/features/ProfileCard';
import { Modal } from '@/components/ui/Modal';

import { api } from '@/lib/api';
import { User } from '@/types/api';
import ParentLayout from '@/components/layout/ParentLayout';
import { usePreferences } from '@/hooks/usePreferences';

export default function SearchPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { addToast } = useToast();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [nannies, setNannies] = useState<User[]>([]);
    const [filteredNannies, setFilteredNannies] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNearby, setIsNearby] = useState(false);
    const [updatingLocation, setUpdatingLocation] = useState(false);
    const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false); // Desktop filter sidebar
    const { preferences, updatePreferences } = usePreferences();

    const [filters, setFilters] = useState<FilterState>({
        services: {
            childCare: false,
            seniorCare: false,
            petCare: false,
            housekeeping: false,
            tutoring: false,
            specialNeeds: false,
        },
        verifiedOnly: false,
        priceRange: [10, 100],
    });

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
                        // Trigger a page reload to refresh user data
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

    // Calculate active filter count
    const activeServiceCount = Object.values(filters.services).filter(Boolean).length;
    const isPriceChanged = filters.priceRange[0] !== 10 || filters.priceRange[1] !== 100;
    const activeFilterCount = activeServiceCount + (filters.verifiedOnly ? 1 : 0) + (isPriceChanged ? 1 : 0);

    const fetchNannies = async () => {
        try {
            setLoading(true);
            setError(null);

            if (isNearby) {
                // Get current location
                if (!navigator.geolocation) {
                    setError('Geolocation is not supported by your browser');
                    setLoading(false);
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            const response = await api.location.nearbyNannies(latitude, longitude, 10); // 10km radius default
                            // Map nearby nannies to User type (adding distance info if needed later)
                            const mappedNannies = response.data.map(n => ({
                                ...n,
                                profiles: n.profile,
                                nanny_details: n.nanny_details
                            } as unknown as User));

                            setNannies(mappedNannies);
                            setFilteredNannies(mappedNannies);
                        } catch (err) {
                            console.error(err);
                            setError('Failed to fetch nearby caregivers');
                        } finally {
                            setLoading(false);
                        }
                    },
                    (err) => {
                        console.error(err);
                        setError('Unable to retrieve location. Please allow location access.');
                        setLoading(false);
                    }
                );
            } else {
                const response = await api.users.nannies();
                setNannies(response);
                setFilteredNannies(response);
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching caregivers');
            setLoading(false);
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        // Filtering is handled automatically by useEffect
    };


    // Initial fetch and re-fetch when filter changes
    useEffect(() => {
        fetchNannies();
    }, [isNearby]);

    // Filter nannies when search query or filters change
    useEffect(() => {
        let filtered = nannies;

        // 1. Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(nanny => {
                const firstName = nanny.profiles?.first_name?.toLowerCase() || '';
                const lastName = nanny.profiles?.last_name?.toLowerCase() || '';
                const address = nanny.profiles?.address?.toLowerCase() || '';
                const skills = nanny.nanny_details?.skills?.join(' ').toLowerCase() || '';

                return firstName.includes(query) ||
                    lastName.includes(query) ||
                    address.includes(query) ||
                    skills.includes(query);
            });
        }

        // 2. Verification
        if (filters.verifiedOnly) {
            filtered = filtered.filter(nanny => nanny.is_verified);
        }

        // 3. Price Range
        filtered = filtered.filter(nanny => {
            const rate = Number(nanny.nanny_details?.hourly_rate) || 0;
            return rate >= filters.priceRange[0] && rate <= filters.priceRange[1];
        });

        // 4. Services (Skills)
        const selectedServices = Object.entries(filters.services)
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);

        if (selectedServices.length > 0) {
            filtered = filtered.filter(nanny => {
                const nannySkills = nanny.nanny_details?.skills?.map(s => s.toLowerCase()) || [];
                // Map service keys to potential skill strings
                // This is a simple mapping, might need to be more robust based on actual skill data
                return selectedServices.some(service => {
                    if (service === 'childCare') return nannySkills.some(s => s.includes('child') || s.includes('baby') || s.includes('newborn'));
                    if (service === 'seniorCare') return nannySkills.some(s => s.includes('senior') || s.includes('elderly'));
                    if (service === 'petCare') return nannySkills.some(s => s.includes('pet') || s.includes('dog') || s.includes('cat'));
                    if (service === 'housekeeping') return nannySkills.some(s => s.includes('house') || s.includes('clean'));
                    if (service === 'tutoring') return nannySkills.some(s => s.includes('tutor') || s.includes('math') || s.includes('english') || s.includes('homework'));
                    if (service === 'specialNeeds') return nannySkills.some(s => s.includes('special') || s.includes('disability'));
                    return false;
                });
            });
        }

        setFilteredNannies(filtered);
    }, [searchQuery, nannies, filters]);


    // Mock data for demo purposes
    const MOCK_NANNIES: User[] = [
        {
            id: '1',
            email: 'sarah@example.com',
            role: 'nanny',
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profiles: {
                user_id: '1',
                first_name: 'Sarah',
                last_name: 'Jenkins',
                phone: '555-0123',
                address: 'Brooklyn, NY',
                lat: '40.6782',
                lng: '-73.9442',
                profile_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            nanny_details: {
                user_id: '1',
                skills: ['CPR Certified', 'First Aid', 'Early Childhood Education'],
                experience_years: 5,
                hourly_rate: '25.00',
                bio: 'Experienced nanny with a passion for child development. I have worked with children of all ages and love creating fun, educational activities.',
                availability_schedule: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        },
        {
            id: '2',
            email: 'michael@example.com',
            role: 'nanny',
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profiles: {
                user_id: '2',
                first_name: 'Michael',
                last_name: 'Chen',
                phone: '555-0124',
                address: 'Queens, NY',
                lat: '40.7282',
                lng: '-73.7949',
                profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            nanny_details: {
                user_id: '2',
                skills: ['Math Tutoring', 'Sports', 'Homework Help'],
                experience_years: 3,
                hourly_rate: '20.00',
                bio: 'Energetic and responsible caregiver. I specialize in active play and can help with homework and tutoring.',
                availability_schedule: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        },
        {
            id: '3',
            email: 'emily@example.com',
            role: 'nanny',
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profiles: {
                user_id: '3',
                first_name: 'Emily',
                last_name: 'Davis',
                phone: '555-0125',
                address: 'Manhattan, NY',
                lat: '40.7831',
                lng: '-73.9712',
                profile_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            nanny_details: {
                user_id: '3',
                skills: ['Newborn Care', 'Sleep Training', 'Organic Cooking'],
                experience_years: 8,
                hourly_rate: '35.00',
                bio: 'Professional nanny with extensive experience in newborn care. I am patient, reliable, and dedicated to providing the best care for your little ones.',
                availability_schedule: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        }
    ];


    return (
        <ParentLayout>
            <div className="h-screen flex flex-col overflow-hidden bg-neutral-50">
                {/* Enhanced Search Bar Section - Fixed */}
                <div className="flex-none z-30 bg-white border-b border-neutral-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                        {/* Main Search Row */}
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                            {/* Search Input - Prominent */}
                            <div className="flex-1 w-full">
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by name, location, or skills..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-neutral-200 focus:border-primary focus:outline-none text-neutral-900 placeholder:text-neutral-400 transition-colors"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                {user && (
                                    <div className="hidden md:flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200">
                                        <MapPin size={16} className="text-primary" />
                                        <span className="max-w-[150px] truncate font-medium">
                                            {user.profiles?.address || "Set Location"}
                                        </span>
                                        <button
                                            onClick={handleUpdateLocation}
                                            disabled={updatingLocation}
                                            className="text-primary hover:text-primary-600 font-bold ml-1 disabled:opacity-50 text-xs"
                                        >
                                            {updatingLocation ? '...' : 'Update'}
                                        </button>
                                    </div>
                                )}
                                <Button
                                    variant={isNearby ? "default" : "outline"}
                                    onClick={() => setIsNearby(!isNearby)}
                                    className={`rounded-xl h-12 px-5 flex items-center gap-2 font-medium ${isNearby ? 'bg-primary hover:bg-primary-600' : 'bg-white hover:bg-neutral-50'}`}
                                >
                                    <MapPin size={18} />
                                    Nearby
                                </Button>
                                <Button
                                    variant={isDesktopFilterOpen ? "default" : "outline"}
                                    onClick={() => setIsDesktopFilterOpen(!isDesktopFilterOpen)}
                                    className={`hidden lg:flex rounded-xl h-12 px-5 items-center gap-2 font-medium relative ${isDesktopFilterOpen ? 'bg-primary hover:bg-primary-600' : 'bg-white hover:bg-neutral-50'}`}
                                >
                                    <SlidersHorizontal size={18} />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden rounded-xl h-12 px-5 flex items-center gap-2 font-medium bg-white hover:bg-neutral-50 relative"
                                >
                                    <SlidersHorizontal size={18} />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-neutral-500">
                            {loading ? 'Loading...' : (
                                <>
                                    Showing <span className="font-bold text-neutral-900">{filteredNannies.length}</span> of <span className="font-bold text-neutral-900">{nannies.length}</span> caregivers
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 text-primary font-medium">
                                            • {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content - Scrollable */}
                <div className="flex-1 flex gap-6 overflow-hidden px-4 md:px-8 pb-4">
                    {/* Sidebar - Fixed/Scrollable independently */}
                    <div className={`hidden lg:block flex-shrink-0 overflow-y-auto h-full pb-20 custom-scrollbar overscroll-contain transition-all duration-300 ${isDesktopFilterOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}>
                        {isDesktopFilterOpen && (
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={setFilters}
                            />
                        )}
                    </div>

                    {/* Profiles List - Scrollable independently */}
                    <div className="flex-1 overflow-y-auto h-full pb-20 custom-scrollbar overscroll-contain mt-4">
                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

                        {loading ? (
                            <div className="text-center py-12 text-neutral-500">Loading...</div>
                        ) : filteredNannies.length === 0 && !error ? (
                            <div className="text-center py-16 bg-white rounded-[24px] border border-neutral-100 shadow-soft flex flex-col items-center justify-center">
                                <div className="w-32 h-32 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                                    <SlidersHorizontal size={48} className="text-neutral-300" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">No matches found</h3>
                                <p className="text-neutral-500 mb-6 max-w-md">We couldn&apos;t find any caregivers matching your search. Try adjusting your filters or search terms.</p>
                                <Button variant="default" onClick={() => {
                                    setNannies(MOCK_NANNIES);
                                    setFilteredNannies(MOCK_NANNIES);
                                }} className="rounded-full px-8 bg-primary hover:bg-primary-600">
                                    Load Demo Data
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredNannies.map((nanny) => (
                                    <ProfileCard
                                        key={nanny.id}
                                        compact={true}
                                        name={nanny.profiles?.first_name ? `${nanny.profiles.first_name} ${nanny.profiles.last_name}` : 'Caregiver'}
                                        rating={4.8}
                                        reviewCount={12}
                                        location={nanny.profiles?.address || 'Location not set'}
                                        description={nanny.nanny_details?.bio || 'No bio available'}
                                        hourlyRate={Number(nanny.nanny_details?.hourly_rate) || 0}
                                        experience={`${nanny.nanny_details?.experience_years || 0} years`}
                                        isVerified={nanny.is_verified}
                                        onViewProfile={() => window.location.href = `/caregiver/${nanny.id}`}
                                        onBook={() => {
                                            router.push(`/book/${nanny.id}`);
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {filteredNannies.length > 0 && (
                            <div className="flex justify-center gap-2 mt-12 mb-8">
                                <button className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 disabled:opacity-50" disabled><ChevronLeft size={20} /></button>
                                <button className="w-10 h-10 rounded-lg bg-primary text-white font-medium shadow-md">1</button>
                                <button className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"><ChevronRight size={20} /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Filter Modal */}
                <Modal
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    title="Filters"
                    footer={
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" onClick={() => setIsFilterOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
                            <Button variant="default" onClick={() => setIsFilterOpen(false)} className="flex-1 rounded-xl bg-primary hover:bg-primary-600 text-white">Apply</Button>
                        </div>
                    }
                >
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={setFilters}
                    />
                </Modal>


            </div>
        </ParentLayout>
    );
}
