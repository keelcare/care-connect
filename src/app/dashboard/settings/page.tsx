'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { MapPin, Navigation } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UpdateUserDto } from '@/types/api';
import styles from './page.module.css';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profileImageUrl: '',
    bio: '',
    hourlyRate: 0,
    experienceYears: 0,
    skills: [],
  });

  useEffect(() => {
    if (user) {
      // Initialize form data
      setFormData({
        firstName: user.profiles?.first_name || '',
        lastName: user.profiles?.last_name || '',
        phone: user.profiles?.phone || '',
        address: user.profiles?.address || '',
        profileImageUrl: user.profiles?.profile_image_url || '',
        bio: user.nanny_details?.bio || '',
        hourlyRate: user.nanny_details?.hourly_rate
          ? Number(user.nanny_details.hourly_rate)
          : 0,
        experienceYears: user.nanny_details?.experience_years || 0,
        skills: user.nanny_details?.skills || [],
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Prevent negative values for numeric fields
    if ((name === 'hourlyRate' || name === 'experienceYears') && Number(value) < 0) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'hourlyRate' || name === 'experienceYears'
          ? Number(value)
          : value,
    }));
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setUpdatingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          if (!user) return;
          // Update user location
          await api.users.update(user.id, {
            lat: latitude,
            lng: longitude,
          });

          // Wait for backend reverse geocoding to complete
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Fetch updated user data to get the address
          const updatedUser = await api.users.me();

          setFormData(prev => ({
            ...prev,
            address: updatedUser.profiles?.address || prev.address
          }));

          setMessage({ type: 'success', text: 'Location detected and updated!' });
          // Refresh auth context user
          await refreshUser();
        } catch (error) {
          console.error('Error updating location:', error);
          setMessage({ type: 'error', text: 'Failed to detect location.' });
        } finally {
          setUpdatingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve your location. Please allow location access.');
        setUpdatingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setMessage(null);

      // Filter out empty values or only send changed values ideally
      // For now sending all form data
      await api.users.update(user.id, formData);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Refresh user data to ensure sync
      await refreshUser();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">
            Account Settings
          </h1>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 font-display">
          Account Settings
        </h1>
        <p className="text-neutral-500 mt-2 text-lg">
          Manage your profile and account preferences
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success'
            ? 'bg-green-50 border-green-100 text-green-700'
            : 'bg-red-50 border-red-100 text-red-700'
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft p-8 md:p-10 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="rounded-xl"
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="rounded-xl"
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-xl"
              />
              <div className="md:col-span-2">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Input
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      helperText="This will be used to calculate distances for search results."
                      className="rounded-xl"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUpdateLocation}
                    disabled={updatingLocation}
                    className="mb-6 h-12 rounded-xl border-neutral-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    {updatingLocation ? (
                      '...'
                    ) : (
                      <>
                        <Navigation size={16} />
                        Get Location
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Profile Image URL"
                  name="profileImageUrl"
                  value={formData.profileImageUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {user?.role === 'nanny' && (
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
                Caregiver Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Hourly Rate (₹)"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate?.toString()}
                  onChange={handleChange}
                  className="rounded-xl"
                />
                <Input
                  label="Years of Experience"
                  name="experienceYears"
                  type="number"
                  min={0}
                  value={formData.experienceYears?.toString()}
                  onChange={handleChange}
                  className="rounded-xl"
                />
                <div className="md:col-span-2">
                  <Input
                    label="Skills (comma separated)"
                    name="skills"
                    value={formData.skills?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        skills: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="CPR, First Aid, Cooking"
                    className="rounded-xl"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    className="w-full rounded-xl border-neutral-200 focus:border-primary-900 focus:ring-primary-900 min-h-[120px] p-3"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell parents about yourself..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-100">
            <Button type="button" variant="ghost" className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl px-8 shadow-lg hover:shadow-xl transition-all"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
