'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import {
  NannyProfileFormState,
  buildInitialFormState,
  toUpdateUserDto,
  toUpsertOnboardingDto,
} from '@/types/nannyProfileForm';
import { PersonalInfoSection } from '@/components/nanny-profile/PersonalInfoSection';
import { EducationExperienceSection } from '@/components/nanny-profile/EducationExperienceSection';
import { SkillsInterestsSection } from '@/components/nanny-profile/SkillsInterestsSection';
import { CompensationSection } from '@/components/nanny-profile/CompensationSection';
import { ConsentsSection } from '@/components/nanny-profile/ConsentsSection';
import { DocumentsSection } from '@/components/nanny-profile/DocumentsSection';

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [form, setForm] = useState<NannyProfileFormState>(buildInitialFormState(null));
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

  useEffect(() => {
    if (user) {
      setForm(buildInitialFormState(user));
      setBio(user.nanny_details?.bio || '');
      setSkills((user.nanny_details?.skills || []).join(', '));
      setExperienceYears(
        user.nanny_details?.experience_years != null
          ? String(user.nanny_details.experience_years)
          : ''
      );
      setLoading(false);
    }
  }, [user]);

  const update = (patch: Partial<NannyProfileFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

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
          // Resolve a human-readable label for the detected coordinates
          let locationAddress = 'Current location';
          try {
            const res = await api.location.reverseGeocode(latitude, longitude);
            if (res?.success && res.data?.address) locationAddress = res.data.address;
          } catch {
            /* keep fallback label */
          }
          // Save the matching location — kept separate from the residential address
          await api.users.update(user.id, {
            lat: latitude,
            lng: longitude,
            locationAddress,
          });
          setMessage({ type: 'success', text: 'Matching location updated!' });
          await refreshUser();
        } catch (error) {
          logger.error('Error updating location:', error);
          setMessage({ type: 'error', text: 'Failed to detect location.' });
        } finally {
          setUpdatingLocation(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        if (error.code === 1) errorMessage = 'Please allow location access in your browser settings';
        else if (error.code === 2) errorMessage = 'Unable to determine your location. Please check your Wi-Fi and Location Services';
        else if (error.code === 3) errorMessage = 'Location request timed out. Please try again';
        alert(errorMessage);
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

      await api.users.update(user.id, {
        ...toUpdateUserDto(form),
        bio,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        experienceYears: experienceYears ? Number(experienceYears) : undefined,
      });
      await api.nannyOnboarding.update(toUpsertOnboardingDto(form));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      await refreshUser();

      setTimeout(() => setMessage(null), 5000);
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

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible and permanently anonymizes your data.')) {
      try {
        await api.users.deleteMe();
        alert('Account deleted successfully.');
        await logout();
      } catch {
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const handleExportData = async () => {
    try {
      const data = await api.users.exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keel-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export data. Please try again.');
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

  const isNanny = user?.role === 'nanny';

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
          className={`p-4 rounded-xl flex items-center gap-3 sticky top-24 z-10 animate-in fade-in slide-in-from-top-4 shadow-sm ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8 md:p-10">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
            Personal Information
          </h2>
          <PersonalInfoSection form={form} update={update} email={user?.email || ''} onAvatarUploaded={refreshUser} />

          <div className="mt-6 pt-6 border-t border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900">Matching location</p>
            <p className="text-xs text-neutral-400 mt-1 mb-3">
              Used to match you with nearby families. This is separate from your residential address above.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={handleUpdateLocation}
                disabled={updatingLocation}
                className="rounded-xl border-neutral-200 flex items-center gap-2 whitespace-nowrap"
              >
                {updatingLocation ? 'Detecting…' : (<><Navigation size={16} />Use current location</>)}
              </Button>
              <span className="text-sm text-neutral-500">
                {user?.profiles?.location_address
                  ? user.profiles.location_address
                  : 'No matching location set yet'}
              </span>
            </div>
          </div>
        </div>

        {isNanny && (
          <>
            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8 md:p-10">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
                Education & Experience
              </h2>
              <EducationExperienceSection form={form} update={update} />
            </div>

            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8 md:p-10">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
                Skills & Interests
              </h2>
              <SkillsInterestsSection form={form} update={update} />
              <div className="mt-6 grid grid-cols-1 gap-6">
                <Input
                  label="Years of Experience (overall)"
                  type="number"
                  min={0}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="rounded-xl max-w-xs"
                />
                <Input
                  label="Other Skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="CPR, First Aid, Cooking"
                  className="rounded-xl"
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Bio</label>
                  <textarea
                    className="w-full rounded-xl border-neutral-200 focus:border-primary-900 focus:ring-primary-900 min-h-[120px] p-3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell parents about yourself..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8 md:p-10">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
                Compensation & Logistics
              </h2>
              <CompensationSection form={form} update={update} />
            </div>

            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8 md:p-10">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
                Consents
              </h2>
              <ConsentsSection form={form} update={update} />
            </div>

            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8 md:p-10">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
                Documents
              </h2>
              <DocumentsSection
                documents={user?.identity_documents || []}
                onUploaded={refreshUser}
              />
            </div>

          </>
        )}

        <div className="flex items-center justify-end gap-4 pt-4">
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
      </form>

      <div className="bg-red-50 rounded-[32px] border border-red-100 shadow-sm p-8 md:p-10 space-y-4">
        <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
          <AlertCircle size={20} />
          Danger Zone
        </h2>
        <p className="text-red-700 text-sm">
          Deleting your account will permanently remove all your data in compliance with DPDPA 2023. This action cannot be undone.
        </p>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl px-6"
          onClick={handleExportData}
        >
          Download My Data
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="rounded-xl px-6 bg-red-600 hover:bg-red-700 text-white"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
