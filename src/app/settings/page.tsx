'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UpdateUserDto } from '@/types/api';
import ParentLayout from '@/components/layout/ParentLayout';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Image,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function ParentSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'hourlyRate' || name === 'experienceYears'
          ? Number(value)
          : value,
    }));
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
      <ParentLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              Account Settings
            </h1>
          </div>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
          </div>
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-8 px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            Account Settings
          </h1>
          <p className="text-stone-500 mt-2 text-lg">
            Manage your profile and account preferences
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-red-50 border-red-100 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50 p-8 md:p-10 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100 flex items-center gap-2">
                <User size={20} className="text-stone-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="rounded-xl border-stone-200 focus:border-stone-400 focus:ring-stone-900/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="rounded-xl border-stone-200 focus:border-stone-400 focus:ring-stone-900/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                    <Phone size={14} className="text-stone-500" />
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-xl border-stone-200 focus:border-stone-400 focus:ring-stone-900/10"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-stone-500" />
                    Address
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="rounded-xl border-stone-200 focus:border-stone-400 focus:ring-stone-900/10"
                  />
                  <p className="text-xs text-stone-500 mt-2">
                    This will be used to calculate distances for search results.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                    <Image size={14} className="text-stone-500" />
                    Profile Image URL
                  </label>
                  <Input
                    name="profileImageUrl"
                    value={formData.profileImageUrl || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="rounded-xl border-stone-200 focus:border-stone-400 focus:ring-stone-900/10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-stone-100">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl px-8 shadow-lg hover:shadow-xl transition-all bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </ParentLayout>
  );
}
