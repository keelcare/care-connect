'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Baby,
  Heart,
  PawPrint,
  Home,
  BookOpen,
  Accessibility,
  ArrowRight,
  MapPin,
  RefreshCw,
  ShieldCheck,
  GraduationCap,
  HandHelping,
  HandHeart,
} from 'lucide-react';
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
  const { preferences, updatePreferences } = usePreferences();

  const categories = [
    {
      name: 'Child Care',
      icon: Baby,
      query: 'childCare',
      color: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
      description: 'Safe, nurturing care for your child',
      disabled: false,
    },
    {
      name: 'Special Needs',
      icon: HandHeart,
      query: 'specialNeeds',
      color: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
      description: 'Trained care with extra patience',
      disabled: false,
    },
    {
      name: 'Shadow Teacher',
      icon: GraduationCap,
      query: 'shadowTeacher',
      color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
      description: 'Academic support & guidance',
      disabled: false,
    },
    {
      name: 'Senior Care',
      icon: Heart,
      query: 'seniorCare',
      color: 'bg-stone-50 text-stone-300',
      description: 'Coming soon',
      disabled: true,
    },
    {
      name: 'Pet Care',
      icon: PawPrint,
      query: 'petCare',
      color: 'bg-stone-50 text-stone-300',
      description: 'Coming soon',
      disabled: true,
    },
    {
      name: 'Housekeeping',
      icon: Home,
      query: 'housekeeping',
      color: 'bg-stone-50 text-stone-300',
      description: 'Coming soon',
      disabled: true,
    },
  ];

  // Use a ref to prevent re-running update on every user object change if not needed
  const lastUpdateRef = React.useRef<number>(0);

  React.useEffect(() => {
    // Effect 1: Auto-update location on visit (Once per session)
    const updateLocation = () => {
      // Check session storage to see if we already updated this session
      if (
        typeof window !== 'undefined' &&
        sessionStorage.getItem('locationChecked')
      ) {
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;

              // Mark as checked for this session immediately to prevent double firing
              sessionStorage.setItem('locationChecked', 'true');

              // Reverse Geocoding to get Full Address
              let addressName = 'Current Location';
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                );
                const data = await response.json();

                // Use display_name for full address as requested
                // Or construct it if display_name is too messy.
                // User asked for "entire address". Nominatim display_name is usually "House, Road, Neighbourhood, City, County, State, Postcode, Country"
                if (data.display_name) {
                  addressName = data.display_name;
                } else {
                  // Fallback construction
                  const addr = data.address;
                  const parts = [
                    addr.road || addr.pedestrian,
                    addr.city || addr.town || addr.village,
                    addr.state,
                    addr.country,
                  ].filter(Boolean);
                  if (parts.length > 0) addressName = parts.join(', ');
                }
              } catch (error) {
                console.warn('Reverse geocoding failed', error);
              }

              if (user?.id) {
                lastUpdateRef.current = Date.now();
                // Update backend silently with address
                await api.users.update(user.id, {
                  lat: latitude,
                  lng: longitude,
                  address: addressName,
                });
                // Fetch updated user for address (optional since we have it, but ensures sync)
                // const updatedUser = await api.users.me();

                updatePreferences({
                  location: {
                    lat: latitude,
                    lng: longitude,
                    address: addressName,
                  },
                });
              } else {
                // Guest user
                updatePreferences({
                  location: {
                    lat: latitude,
                    lng: longitude,
                    address: addressName,
                  },
                });
              }
            } catch (e) {
              console.error('Silent location update failed', e);
            }
          },
          (e) => console.log('Silent location update denied/failed', e)
        );
      }
    };

    // Trigger the update on mount/user change
    updateLocation();
  }, [user, updatePreferences]);

  React.useEffect(() => {
    // Effect 2: Fetch data when preferences (location) change
    const fetchNearby = async () => {
      try {
        setLoading(true);

        let lat: number | null = null;
        let lng: number | null = null;

        // Prioritize preferences (latest), then user profile
        if (preferences.location?.lat && preferences.location?.lng) {
          lat = preferences.location.lat;
          lng = preferences.location.lng;
        } else if (user?.profiles?.lat && user?.profiles?.lng) {
          lat = parseFloat(user.profiles.lat);
          lng = parseFloat(user.profiles.lng);
        }

        // Fallback to direct geolocation if still missing
        if (lat === null || lng === null) {
          if (navigator.geolocation) {
            try {
              const position = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject);
                }
              );
              lat = position.coords.latitude;
              lng = position.coords.longitude;
            } catch (e) {
              console.log('Geolocation permission denied or failed', e);
            }
          }
        }

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
          try {
            // Use a reasonable radius (e.g. 50km) for "Nearby"
            const response = await api.location.nearbyNannies(lat, lng, 50);

            if (response.data && response.data.length > 0) {
              const mappedNannies = response.data.map(
                (n) =>
                  ({
                    ...n,
                    profiles: n.profile,
                    nanny_details: n.nanny_details,
                    distance: n.distance,
                  }) as unknown as User
              );
              setNearbyNannies(mappedNannies);
            } else {
              // Explicitly set empty if none found nearby
              setNearbyNannies([]);
            }
          } catch (e) {
            console.warn('Nearby fetch failed', e);
            setNearbyNannies([]);
            setError('Could not load nearby caregivers.');
          }
        } else {
          // If we don't have a location, we can't show "nearby".
          // User request implies strictness, so maybe show none or prompt for location?
          // Current behavior was fallback. Let's show all if NO location is known at all (guest),
          // but if location is known and no one is there, show none.
          // Actually, if lat/lng is null, we usually fallback to all.
          // But user said "make it radius based".
          // I will keep fallback ONLY if location is totally unknown.
          const allNannies = await api.users.nannies();
          setNearbyNannies(allNannies);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load nearby caregivers.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchNearby();
    }
  }, [user, preferences]);

  const filteredNearbyNannies = nearbyNannies.filter(
    (nanny) => !featuredIds.has(nanny.id)
  );

  return (
    <ParentLayout>
      <div className="min-h-screen bg-warm-white pb-20 md:pb-8">
        <main className="max-w-7xl mx-auto px-4 md:px-6 space-y-20 pt-8">
          {/* Categories Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  Browse by Category
                </h2>
                <p className="text-stone-500 mt-1">
                  Find care that fits your needs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                // @ts-ignore - disabled property added dynamically
                const isDisabled = category.disabled;

                const content = (
                  <div
                    className={`group bg-white p-6 rounded-2xl border ${isDisabled ? 'border-stone-100 opacity-60 cursor-not-allowed' : 'border-stone-100 hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/50 cursor-pointer'} transition-all duration-300 flex flex-col items-center gap-3 text-center h-full justify-center`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center transition-transform duration-300 ${!isDisabled && 'group-hover:scale-110'}`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span
                      className={`font-medium ${isDisabled ? 'text-stone-400' : 'text-stone-900'}`}
                    >
                      {category.name}
                    </span>
                    <span className="text-xs text-stone-500 px-2">
                      {category.description}
                    </span>
                  </div>
                );

                if (isDisabled) {
                  return <div key={category.name}>{content}</div>;
                }

                return (
                  <Link
                    href={`/search?service=${category.query}`}
                    key={category.name}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Safety Promise Section - Visual Break */}
          <section className="bg-white rounded-3xl p-8 md:p-12 border border-stone-100 shadow-xl shadow-stone-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full text-emerald-700 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Our Safety Promise</span>
                </div>
                <h2 className="text-3xl font-bold text-stone-900">
                  We take safety seriously, so you don't have to worry.
                </h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  Every caregiver on our platform goes through a rigorous
                  7-point background check, interview process, and ID
                  verification. We believe trust is earned, not given.
                </p>
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl text-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-stone-900 text-sm">
                    Background Checked
                  </p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl text-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                      ID
                    </div>
                  </div>
                  <p className="font-semibold text-stone-900 text-sm">
                    ID Verified
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Section */}
          <FeaturedCaregivers onDataLoaded={handleFeaturedLoaded} />

          {/* Nearby Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  Nearby Caregivers
                </h2>
                <p className="text-stone-500 mt-1">Caregivers in your area</p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/search?sort=distance">
                  <Button
                    variant="ghost"
                    className="text-stone-600 hover:text-stone-900 font-medium"
                  >
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
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  No caregivers found nearby
                </h3>
                <p className="text-stone-500 mb-6">
                  Try updating your location or browse all caregivers.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/search">
                    <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
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
                    location={
                      nanny.profiles?.address || 'Location not specified'
                    }
                    description={
                      nanny.nanny_details?.bio || 'No description available.'
                    }
                    hourlyRate={Number(nanny.nanny_details?.hourly_rate) || 20}
                    experience={`${nanny.nanny_details?.experience_years || 0} years`}
                    isVerified={nanny.is_verified}
                    distance={nanny.distance}
                    onViewProfile={() =>
                      (window.location.href = `/caregiver/${nanny.id}`)
                    }
                    onBook={() => (window.location.href = `/book/${nanny.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Mobile FAB */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <Link href="/search">
            <Button className="rounded-full w-14 h-14 shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white p-0 flex items-center justify-center">
              <Search size={24} />
            </Button>
          </Link>
        </div>
      </div>
    </ParentLayout>
  );
}
