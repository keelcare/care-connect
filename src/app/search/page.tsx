"use client";

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { ProfileCard } from '@/components/features/ProfileCard';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import styles from './page.module.css';

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
        <div className={styles.container}>
            <div className={styles.header}>
                <form className={styles.searchBar} onSubmit={handleSearch}>
                    <SearchInput
                        placeholder="Search by name, location, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                    />
                </form>
                <div className={styles.stats}>
                    {loading ? 'Loading...' : `Showing ${filteredNannies.length} of ${nannies.length} caregivers`}
                </div>
            </div>

            <div className={styles.mobileFilterBtn}>
                <Button variant="secondary" onClick={() => setIsFilterOpen(true)} style={{ width: '100%' }}>
                    <SlidersHorizontal size={16} style={{ marginRight: 8 }} /> Filters
                </Button>
            </div>

            <div className={styles.content}>
                <div className={styles.sidebar}>
                    <FilterSidebar />
                </div>

                <div className={styles.results}>
                    {error && <div style={{ color: 'red', padding: '20px' }}>{error}</div>}

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                    ) : (
                        <>
                            {filteredNannies.length === 0 && !error && (
                                <div className={styles.noResults}>
                                    <p>No caregivers found{searchQuery ? ' matching your search' : ''}.</p>
                                    <Button variant="primary" onClick={() => {
                                        setNannies(MOCK_NANNIES);
                                        setFilteredNannies(MOCK_NANNIES);
                                    }}>
                                        Load Demo Data
                                    </Button>
                                </div>
                            )}
                            <div className={styles.resultsGrid}>
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
                        <div className={styles.pagination}>
                            <button className={styles.pageBtn} disabled><ChevronLeft size={20} /></button>
                            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                            <button className={styles.pageBtn}><ChevronRight size={20} /></button>
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
                    <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" onClick={() => setIsFilterOpen(false)} style={{ flex: 1 }}>Cancel</Button>
                        <Button variant="primary" onClick={() => setIsFilterOpen(false)} style={{ flex: 1 }}>Apply</Button>
                    </div>
                }
            >
                <FilterSidebar />
            </Modal>
        </div>
    );
}
