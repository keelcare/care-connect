"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, Clock, ShieldCheck, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { useAuth } from '@/context/AuthContext';

// Mock data for demo
const MOCK_USERS = {
    '1': {
        id: '1',
        email: 'sarah@example.com',
        role: 'nanny',
        is_verified: true,
        profiles: {
            first_name: 'Sarah',
            last_name: 'Jenkins',
            address: 'Brooklyn, NY',
            profile_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        },
        nanny_details: {
            hourly_rate: '25.00',
            experience_years: 5,
            bio: 'Experienced nanny with a passion for child development. I have worked with children of all ages and love creating fun, educational activities.',
            skills: ['CPR Certified', 'First Aid', 'Early Childhood Education'],
            availability_schedule: { monday: ['9:00-17:00'], tuesday: ['9:00-17:00'] }
        }
    },
    '2': {
        id: '2',
        email: 'michael@example.com',
        role: 'nanny',
        is_verified: false,
        profiles: {
            first_name: 'Michael',
            last_name: 'Chen',
            address: 'Queens, NY',
            profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
        },
        nanny_details: {
            hourly_rate: '20.00',
            experience_years: 3,
            bio: 'Energetic and responsible caregiver. I specialize in active play and can help with homework and tutoring.',
            skills: ['Math Tutoring', 'Sports', 'Homework Help'],
            availability_schedule: { wednesday: ['14:00-18:00'], thursday: ['14:00-18:00'] }
        }
    },
    '3': {
        id: '3',
        email: 'emily@example.com',
        role: 'nanny',
        is_verified: true,
        profiles: {
            first_name: 'Emily',
            last_name: 'Davis',
            address: 'Manhattan, NY',
            profile_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
        },
        nanny_details: {
            hourly_rate: '35.00',
            experience_years: 8,
            bio: 'Professional nanny with extensive experience in newborn care. I am patient, reliable, and dedicated to providing the best care for your little ones.',
            skills: ['Newborn Care', 'Sleep Training', 'Organic Cooking'],
            availability_schedule: { friday: ['8:00-16:00'] }
        }
    }
};



export default function CaregiverProfilePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [caregiver, setCaregiver] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'availability'>('about');

    const [messageLoading, setMessageLoading] = useState(false);

    useEffect(() => {
        const fetchCaregiver = async () => {
            if (!params.id) return;

            try {
                setLoading(true);
                // Cast params.id to string as useParams can return string | string[]
                const id = Array.isArray(params.id) ? params.id[0] : params.id;

                // Mock data check for demo IDs
                if (['1', '2', '3'].includes(id)) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const mockUser = MOCK_USERS[id as keyof typeof MOCK_USERS];
                    setCaregiver(mockUser as unknown as User);
                    setLoading(false);
                    return;
                }

                const data = await api.users.get(id);
                setCaregiver(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load caregiver profile');
            } finally {
                setLoading(false);
            }
        };

        fetchCaregiver();
    }, [params.id]);

    useEffect(() => {
        if (searchParams.get('book') === 'true') {
            router.push(`/book/${params.id}`);
        }
    }, [searchParams, params.id, router]);

    const handleMessage = async () => {
        if (!user || !caregiver) return;

        try {
            setMessageLoading(true);
            // Create or get existing chat
            const chat = await api.chat.create({
                participantId: caregiver.id
            });

            // Redirect to messages with this chat active
            router.push(`/dashboard/messages?chatId=${chat.id}`);
        } catch (err) {
            console.error('Failed to start chat:', err);
            // Fallback to messages page if creation fails
            router.push('/dashboard/messages');
        } finally {
            setMessageLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[50vh] text-neutral-500">Loading profile...</div>;
    if (error) return <div className="flex items-center justify-center min-h-[50vh] text-red-500">{error}</div>;
    if (!caregiver) return <div className="flex items-center justify-center min-h-[50vh] text-neutral-500">Caregiver not found</div>;

    const { profiles, nanny_details } = caregiver;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header Section */}
            <div className="relative mb-20">
                <div className="h-48 w-full bg-gradient-to-r from-teal-100 to-pink-100 rounded-b-[40px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                </div>
                <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-4 border-white shadow-strong overflow-hidden bg-white">
                        <Image
                            src={profiles?.profile_image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
                            alt={`${profiles?.first_name} ${profiles?.last_name}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 font-display mb-2">
                            {profiles?.first_name} {profiles?.last_name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                            {caregiver.is_verified && (
                                <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium flex items-center gap-1 border border-teal-100">
                                    <ShieldCheck size={14} />
                                    Verified
                                </span>
                            )}
                            <div className="flex items-center gap-1 text-neutral-600 text-sm bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
                                <MapPin size={16} />
                                {profiles?.address || 'Location hidden'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-warning-50 flex items-center justify-center text-warning-600 mb-2">
                                <Star size={20} fill="currentColor" />
                            </div>
                            <div className="font-bold text-neutral-900">4.9</div>
                            <div className="text-xs text-neutral-500">Rating</div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary mb-2">
                                <Clock size={20} />
                            </div>
                            <div className="font-bold text-neutral-900">{nanny_details?.experience_years || 0}y</div>
                            <div className="text-xs text-neutral-500">Experience</div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center text-secondary mb-2">
                                <Award size={20} />
                            </div>
                            <div className="font-bold text-neutral-900">{nanny_details?.skills?.length || 0}</div>
                            <div className="text-xs text-neutral-500">Skills</div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-neutral-200">
                        <button
                            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'about' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                            onClick={() => setActiveTab('about')}
                        >
                            About
                            {activeTab === 'about' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'reviews' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                            {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'availability' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                            onClick={() => setActiveTab('availability')}
                        >
                            Availability
                            {activeTab === 'availability' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[300px]">
                        {activeTab === 'about' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <section>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-3">About Me</h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {nanny_details?.bio || "No bio provided."}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-3">Skills & Certifications</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {nanny_details?.skills?.map((skill, index) => (
                                            <span key={index} className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-700 font-medium text-sm">
                                                {skill}
                                            </span>
                                        )) || <span className="text-neutral-500">No skills listed</span>}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed">
                                    <p className="text-neutral-500">Reviews coming soon</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'availability' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-3">
                                    {nanny_details?.availability_schedule ? (
                                        Object.entries(nanny_details.availability_schedule).map(([day, slots]) => (
                                            <div key={day} className="p-4 border border-neutral-100 rounded-xl bg-white flex items-center justify-between">
                                                <div className="font-semibold text-neutral-900 capitalize">{day}</div>
                                                <div className="text-sm font-medium text-primary bg-primary-50 px-3 py-1 rounded-lg">
                                                    {Array.isArray(slots) && slots.length > 0 ? slots.join(', ') : 'Unavailable'}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-neutral-500">Contact for availability</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Sticky Booking Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-[32px] shadow-strong border border-neutral-100 p-6 space-y-6">
                        <div className="flex items-end justify-between border-b border-neutral-100 pb-6">
                            <div>
                                <p className="text-neutral-500 text-sm mb-1">Hourly Rate</p>
                                <div className="text-3xl font-bold text-neutral-900">
                                    ₹{nanny_details?.hourly_rate || 20}
                                </div>
                            </div>
                            <div className="text-neutral-500 text-sm mb-1">per hour</div>
                        </div>

                        <div className="space-y-3">
                            {user ? (
                                <>
                                    <Button
                                        size="lg"
                                        className="w-full rounded-xl bg-secondary hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all h-12 text-lg font-medium"
                                        onClick={() => router.push(`/book/${caregiver.id}`)}
                                    >
                                        Request Booking
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full rounded-xl border-neutral-200 hover:bg-neutral-50 h-12"
                                        onClick={handleMessage}
                                        disabled={messageLoading}
                                    >
                                        {messageLoading ? 'Starting Chat...' : 'Message'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/signup" className="w-full">
                                        <Button
                                            size="lg"
                                            className="w-full rounded-xl bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl transition-all h-12 text-lg font-medium"
                                        >
                                            Sign up to Book
                                        </Button>
                                    </Link>
                                    <Link href="/auth/signup" className="w-full">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-full rounded-xl border-neutral-200 hover:bg-neutral-50 h-12"
                                        >
                                            Sign up to Message
                                        </Button>
                                    </Link>
                                    <p className="text-xs text-center text-neutral-500 pt-2">
                                        Already have an account? <Link href="/auth/login" className="text-primary hover:underline font-medium">Log in</Link>
                                    </p>
                                </>
                            )}
                        </div>

                        {user && (
                            <div className="text-center">
                                <p className="text-xs text-neutral-400">
                                    You won&apos;t be charged until the booking is confirmed.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
}
