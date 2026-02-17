'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Favorite } from '@/types/api';
import { ProfileCard } from '@/components/features/ProfileCard';
import ParentLayout from '@/components/layout/ParentLayout';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await api.favorites.list();
      // Ensure data is an array
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch favorites:', err);
      // Show more specific error message
      const errorMessage = err?.message || 'Failed to load favorites';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ParentLayout>
        <div className="min-h-dvh bg-stone-50 pt-24 pb-12">
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
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="min-h-dvh bg-stone-50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-stone-900 font-display">
                  My Favorites
                </h1>
                <p className="text-stone-500">
                  Your saved caregivers for quick access
                </p>
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
              <h2 className="text-xl font-semibold text-stone-900 mb-2">
                No favorites yet
              </h2>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                Start browsing caregivers and tap the heart icon to save your
                favorites for quick access later.
              </p>
              <Link href="/parent-dashboard">
                <Button className="bg-primary-900 hover:bg-primary-800 text-white rounded-xl">
                  Browse Caregivers
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favorites.map((favorite) => {
                // Backend returns nanny under this key
                const nanny =
                  favorite.users_favorite_nannies_nanny_idTousers ||
                  favorite.nanny;
                if (!nanny) return null;

                // Handle both full_name and first_name/last_name formats
                const fullName = nanny.profiles
                  ? nanny.profiles.full_name ||
                  `${nanny.profiles.first_name || ''} ${nanny.profiles.last_name || ''}`.trim()
                  : 'Caregiver';
                const hourlyRate = nanny.nanny_details?.hourly_rate
                  ? parseFloat(nanny.nanny_details.hourly_rate)
                  : 0;
                const experienceYears =
                  nanny.nanny_details?.experience_years || 0;
                const bio =
                  nanny.profiles?.bio ||
                  nanny.nanny_details?.bio ||
                  'Professional caregiver ready to help your family.';
                const location =
                  nanny.profiles?.address || 'Location not specified';

                return (
                  <ProfileCard
                    key={favorite.id}
                    name={fullName || 'Caregiver'}
                    rating={4.9}
                    reviewCount={12}
                    location={location}
                    description={bio}
                    hourlyRate={hourlyRate}
                    experience={`${experienceYears} years`}
                    isVerified={true}
                    onViewProfile={() =>
                      router.push(`/caregiver/${favorite.nanny_id}`)
                    }
                  // onBook={() => router.push(`/book/${favorite.nanny_id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
}
