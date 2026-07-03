'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/hooks/usePreferences';
import { UpdateUserDto } from '@/types/api';
import ParentLayout from '@/components/layout/ParentLayout';
import { LocationModal } from '@/components/features/LocationModal';
import {
  User,
  Phone,
  MapPin,
  Navigation,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

// Only the fields a parent account owns. Sending nanny-only keys (skills,
// bio, hourlyRate, …) makes the backend reject the whole request.
interface ParentProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  profileImageUrl: string;
}

export default function ParentSettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const { preferences, updatePreferences } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [form, setForm] = useState<ParentProfileForm>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profileImageUrl: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.profiles?.first_name || '',
        lastName: user.profiles?.last_name || '',
        phone: user.profiles?.phone || '',
        address: user.profiles?.address || '',
        profileImageUrl: user.profiles?.profile_image_url || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setMessage(null);

      const payload: UpdateUserDto = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        profileImageUrl: form.profileImageUrl,
      };
      await api.users.update(user.id, payload);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      await refreshUser();
    } catch (error) {
      logger.error('Failed to update profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Detect the current device location and save it as the matching location —
  // stored separately from the residential address, and mirrored into local
  // preferences because that's what parent search reads.
  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setMessage({
        type: 'error',
        text: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setUpdatingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          if (!user) return;

          let locationAddress = 'Current location';
          try {
            const res = await api.location.reverseGeocode(latitude, longitude);
            if (res?.success && res.data?.address) locationAddress = res.data.address;
          } catch {
            /* keep fallback label */
          }

          await api.users.update(user.id, {
            lat: latitude,
            lng: longitude,
            locationAddress,
          });

          updatePreferences({
            location: { lat: latitude, lng: longitude, address: locationAddress },
          });

          setMessage({ type: 'success', text: 'Matching location updated!' });
          await refreshUser();
        } catch (error) {
          logger.error('Error updating location:', error);
          setMessage({
            type: 'error',
            text: 'Failed to update location. Please try again.',
          });
        } finally {
          setUpdatingLocation(false);
        }
      },
      (error) => {
        let text = 'Unable to retrieve your location.';
        if (error.code === 1)
          text = 'Please allow location access in your browser settings.';
        else if (error.code === 2)
          text = 'Unable to determine your location. Check your Wi-Fi and Location Services.';
        else if (error.code === 3) text = 'Location request timed out. Please try again.';
        setMessage({ type: 'error', text });
        setUpdatingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const currentMatchingLocation =
    preferences.location?.address || user?.profiles?.location_address || '';

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action is irreversible and permanently anonymizes your data.'
      )
    ) {
      try {
        await api.users.deleteMe();
        alert('Account deleted successfully.');
        await logout();
      } catch (error) {
        logger.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const fullName =
    `${form.firstName} ${form.lastName}`.trim() ||
    user?.profiles?.first_name ||
    'Your profile';
  const initial = (form.firstName || user?.email || 'U').charAt(0).toUpperCase();

  if (loading) {
    return (
      <ParentLayout>
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900" />
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-0 pb-16">
        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[32px] bg-primary-900 px-8 py-10 md:px-12 md:py-12 mt-6"
        >
          {/* Ambient sky glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 right-0 w-72 h-72 rounded-full bg-sky-400/20 blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-56 h-56 rounded-full bg-secondary/20 blur-[100px]" />
          </div>

          <div className="relative flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 bg-white/10 flex items-center justify-center flex-shrink-0">
              {form.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.profileImageUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">{initial}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sky-200/80 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                Account
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white truncate">
                {fullName}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-white/70 text-sm">
                <ShieldCheck
                  size={15}
                  className={user?.is_verified ? 'text-emerald-300' : 'text-white/40'}
                />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : 'bg-red-50 border-red-100 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Personal information */}
          <section className="bg-white rounded-[28px] border border-neutral-100 shadow-soft p-7 md:p-9">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary-900">
                  Personal information
                </h2>
                <p className="text-sm text-neutral-500">
                  How caregivers and Keel reach you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  First name
                </label>
                <Input name="firstName" value={form.firstName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Last name
                </label>
                <Input name="lastName" value={form.lastName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone number
                </label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  leftIcon={<Phone size={16} />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Profile image URL
                </label>
                <Input
                  name="profileImageUrl"
                  value={form.profileImageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  leftIcon={<ImageIcon size={16} />}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Residential address
                </label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  leftIcon={<MapPin size={16} />}
                />
                <p className="text-xs text-neutral-400 mt-2">
                  Your home address. This is separate from the matching location
                  used for search — set that below.
                </p>
              </div>
            </div>
          </section>

          {/* Matching location */}
          <section className="bg-white rounded-[28px] border border-neutral-100 shadow-soft p-7 md:p-9">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Navigation size={18} />
              </div>
              <h2 className="font-display text-xl font-bold text-primary-900">
                Matching location
              </h2>
            </div>
            <p className="text-sm text-neutral-500 mb-5 ml-12">
              Used to find caregivers near you in search. Separate from your
              residential address.
            </p>

            <div className="ml-0 md:ml-12 flex flex-col sm:flex-row sm:items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleUpdateLocation}
                disabled={updatingLocation}
                className="rounded-xl border-neutral-200 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {updatingLocation ? (
                  'Detecting…'
                ) : (
                  <>
                    <Navigation size={16} />
                    Use current location
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowLocationModal(true)}
                className="rounded-xl text-primary-700 hover:bg-primary-50"
              >
                Enter manually
              </Button>
            </div>
            <div className="ml-0 md:ml-12 mt-4 flex items-center gap-2 text-sm">
              <MapPin size={15} className="text-neutral-400 flex-shrink-0" />
              <span className="text-neutral-600">
                {currentMatchingLocation || 'No matching location set yet'}
              </span>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl px-8 bg-primary-900 hover:bg-primary-800 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>

        {/* Danger zone */}
        <section className="mt-8 bg-red-50/60 rounded-[28px] border border-red-100 p-7 md:p-9">
          <h2 className="font-display text-lg font-bold text-red-900 flex items-center gap-2">
            <AlertCircle size={20} />
            Danger zone
          </h2>
          <p className="text-red-700/80 text-sm mt-2 mb-5">
            Deleting your account permanently removes all your data in compliance
            with DPDPA 2023. This cannot be undone.
          </p>
          <Button
            type="button"
            variant="destructive"
            className="rounded-xl px-6 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDeleteAccount}
          >
            Delete account
          </Button>
        </section>
      </div>

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </ParentLayout>
  );
}
