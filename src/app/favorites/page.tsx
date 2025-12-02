"use client";

import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Star, Clock, Calendar, Trash2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Favorite, User } from '@/types/api';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const data = await api.favorites.list();
            setFavorites(data);
        } catch (err) {
            setError('Failed to load favorites');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFavorite = (nannyId: string) => {
        setFavorites(prev => prev.filter(f => f.nanny_id !== nannyId));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-50 pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-stone-200 rounded-lg w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 h-64" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-stone-900 font-display">My Favorites</h1>
                            <p className="text-stone-500">Your saved caregivers for quick access</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
                        {error}
                    </div>
                )}

                {favorites.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-stone-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-stone-900 mb-2">No favorites yet</h2>
                        <p className="text-stone-500 mb-6 max-w-md mx-auto">
                            Start browsing caregivers and tap the heart icon to save your favorites for quick access later.
                        </p>
                        <Link href="/browse">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                                Browse Caregivers
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((favorite) => {
                            const nanny = favorite.nanny;
                            if (!nanny) return null;

                            const fullName = nanny.profiles 
                                ? `${nanny.profiles.first_name || ''} ${nanny.profiles.last_name || ''}`.trim() 
                                : 'Caregiver';
                            const hourlyRate = nanny.nanny_details?.hourly_rate 
                                ? parseFloat(nanny.nanny_details.hourly_rate) 
                                : null;
                            const experience = nanny.nanny_details?.experience_years;
                            const skills = nanny.nanny_details?.skills || [];
                            const profileImage = nanny.profiles?.profile_image_url;

                            return (
                                <div 
                                    key={favorite.id}
                                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-stone-100">
                                        {profileImage ? (
                                            <img 
                                                src={profileImage} 
                                                alt={fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-20 h-20 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-stone-600">
                                                    {fullName.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                        )}
                                        {/* Favorite Button */}
                                        <div className="absolute top-3 right-3">
                                            <FavoriteButton 
                                                nannyId={favorite.nanny_id}
                                                initialFavorite={true}
                                                size="sm"
                                                onToggle={(isFavorite) => {
                                                    if (!isFavorite) {
                                                        handleRemoveFavorite(favorite.nanny_id);
                                                    }
                                                }}
                                            />
                                        </div>
                                        {/* Rate Badge */}
                                        {hourlyRate && (
                                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                                                <span className="text-lg font-bold text-stone-900">₦{hourlyRate.toLocaleString()}</span>
                                                <span className="text-stone-500 text-sm">/hr</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-stone-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                            {fullName}
                                        </h3>
                                        
                                        <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                                            {experience && (
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    <span>{experience} yrs exp</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                                <span>4.9</span>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        {skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {skills.slice(0, 3).map((skill, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {skills.length > 3 && (
                                                    <span className="text-xs text-stone-400">
                                                        +{skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link href={`/caregiver/${favorite.nanny_id}`} className="flex-1">
                                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm">
                                                    View Profile
                                                </Button>
                                            </Link>
                                            <Link href={`/book/${favorite.nanny_id}`}>
                                                <Button variant="outline" className="rounded-xl text-sm px-4">
                                                    <Calendar size={16} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
