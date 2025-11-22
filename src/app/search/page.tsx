"use client";

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { ProfileCard } from '@/components/features/ProfileCard';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { User } from '@/types/api';

export default function SearchPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [nannies, setNannies] = useState<User[]>([]);
    const [filteredNannies, setFilteredNannies] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNannies = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.users.nannies();
            setNannies(response);
            setFilteredNannies(response);
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching caregivers');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        // Filtering is handled automatically by useEffect
    };


    // Initial fetch
    useEffect(() => {
        fetchNannies();
    }, []);

    // Filter nannies when search query changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredNannies(nannies);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = nannies.filter(nanny => {
            const firstName = nanny.profiles?.first_name?.toLowerCase() || '';
            const lastName = nanny.profiles?.last_name?.toLowerCase() || '';
            const address = nanny.profiles?.address?.toLowerCase() || '';
            const skills = nanny.nanny_details?.skills?.join(' ').toLowerCase() || '';

            return firstName.includes(query) ||
                lastName.includes(query) ||
                address.includes(query) ||
                skills.includes(query);
        });

        setFilteredNannies(filtered);
    }, [searchQuery, nannies]);


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
        <div className="space-y-8 min-h-screen bg-neutral-50 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[24px] shadow-soft border border-neutral-100 sticky top-24 z-10">
                <form className="flex-1 w-full" onSubmit={handleSearch}>
                    <SearchInput
                        placeholder="Search by name, location, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        className="w-full"
                    />
                </form>
                <div className="text-sm text-neutral-500 whitespace-nowrap">
                    {loading ? 'Loading...' : `Showing ${filteredNannies.length} of ${nannies.length} caregivers`}
                </div>
            </div>

            <div className="lg:hidden">
                <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="w-full rounded-full bg-white shadow-sm flex items-center justify-center gap-2 py-6">
                    <SlidersHorizontal size={16} /> Filters
                </Button>
            </div>

            <div className="flex gap-8 items-start">
                <div className="hidden lg:block w-80 flex-shrink-0 sticky top-48">
                    <FilterSidebar />
                </div>

                <div className="flex-1">
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

                    {loading ? (
                        <div className="text-center py-12 text-neutral-500">Loading...</div>
                    ) : (
                        <>
                            {filteredNannies.length === 0 && !error && (
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
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredNannies.map((nanny) => (
                                    <ProfileCard
                                        key={nanny.id}
                                        name={`${nanny.profiles?.first_name || 'Caregiver'} ${nanny.profiles?.last_name || ''}`}
                                        image={nanny.profiles?.profile_image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'}
                                        rating={4.8} // Mock data
                                        reviewCount={12} // Mock data
                                        location={nanny.profiles?.address || 'Location not specified'}
                                        description={nanny.nanny_details?.bio || 'No description available.'}
                                        hourlyRate={Number(nanny.nanny_details?.hourly_rate) || 20}
                                        experience={`${nanny.nanny_details?.experience_years || 0} years`}
                                        isVerified={nanny.is_verified}
                                        onViewProfile={() => window.location.href = `/caregiver/${nanny.id}`}
                                        onMessage={() => console.log(`Message ${nanny.id}`)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {filteredNannies.length > 0 && (
                        <div className="flex justify-center gap-2 mt-12">
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
                <FilterSidebar />
            </Modal>
        </div>
    );
}
