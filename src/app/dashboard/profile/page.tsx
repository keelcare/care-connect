"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShieldCheck, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import styles from './page.module.css';
import { usePreferences } from '@/hooks/usePreferences';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const { updatePreferences } = usePreferences();

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">My Profile</h1>
                </div>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">My Profile</h1>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                    <p className="text-red-600 mb-4">Please log in to view your profile.</p>
                    <Link href="/auth/login">
                        <Button>Log In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const { profiles, nanny_details } = user;
    const [updatingLocation, setUpdatingLocation] = React.useState(false);

    const handleUpdateLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setUpdatingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Update user location
                    await api.users.update(user.id, {
                        lat: latitude,
                        lng: longitude
                    });

                    // Wait for backend reverse geocoding to complete (typically takes 1-2 seconds)
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

                    // Reload window to refresh user data with the new address
                    window.location.reload();
                } catch (error) {
                    console.error("Error updating location:", error);
                    alert("Failed to update location.");
                    setUpdatingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location. Please allow location access.");
                setUpdatingLocation(false);
            }
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-neutral-900 font-display">My Profile</h1>
                <Link href="/dashboard/settings">
                    <Button variant="outline" size="sm" className="rounded-xl border-neutral-200">
                        <Edit size={16} className="mr-2" /> Edit Profile
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary-100 to-secondary-100"></div>
                <div className="px-8 pb-8 md:px-10 md:pb-10">
                    <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 -mt-12 mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                                <Image
                                    src={profiles?.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm capitalize">
                                {user.role}
                            </div>
                        </div>

                        <div className="pt-2 md:pt-14 flex-1">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                                {profiles?.first_name} {profiles?.last_name}
                            </h2>
                            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={16} className="text-neutral-400" />
                                    <span>{profiles?.address || 'No address set'}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleUpdateLocation}
                                        disabled={updatingLocation}
                                        className="h-6 px-2 text-xs text-primary hover:text-primary-700 hover:bg-primary-50 ml-2"
                                    >
                                        {updatingLocation ? 'Updating...' : 'Use current location'}
                                    </Button>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck size={16} className={user.is_verified ? "text-green-500" : "text-neutral-400"} />
                                    <span>{user.is_verified ? 'Verified Account' : 'Unverified'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {user.role === 'nanny' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-3 gap-4 bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary mb-1">₹{nanny_details?.hourly_rate || 0}</div>
                                    <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Hourly Rate</div>
                                </div>
                                <div className="text-center border-l border-neutral-200">
                                    <div className="text-2xl font-bold text-primary mb-1">{nanny_details?.experience_years || 0}</div>
                                    <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Years Exp.</div>
                                </div>
                                <div className="text-center border-l border-neutral-200">
                                    <div className="text-2xl font-bold text-primary mb-1">4.9</div>
                                    <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Rating</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-neutral-900">About</h3>
                                <p className="text-neutral-600 leading-relaxed">
                                    {nanny_details?.bio || 'No bio provided yet.'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-neutral-900">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {nanny_details?.skills?.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    )) || <span className="text-neutral-500 italic">No skills listed</span>}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100">
                                <Link href={`/caregiver/${user.id}`}>
                                    <Button className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all">
                                        View Public Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
