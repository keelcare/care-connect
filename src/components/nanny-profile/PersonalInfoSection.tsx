'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Avatar } from '@/components/ui/avatar';
import { PillSingleSelect, FieldLabel } from '@/components/nanny-profile/FormPrimitives';
import { GENDER_OPTIONS } from '@/constants/nannyOnboarding';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import { NannyProfileFormState } from '@/types/nannyProfileForm';

interface Props {
  form: NannyProfileFormState;
  update: (patch: Partial<NannyProfileFormState>) => void;
  email: string;
  onAvatarUploaded?: () => void | Promise<void>;
}

export function PersonalInfoSection({ form, update, email, onAvatarUploaded }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const handleAvatarSelect = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const { profileImageUrl } = await api.users.uploadAvatar(file);
      update({ profileImageUrl });
      await onAvatarUploaded?.();
    } catch (err: any) {
      addToast({ message: err.message || 'Failed to upload picture', type: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-7">
      {/* Profile picture */}
      <div>
        <FieldLabel hint="Upload a clear, recent photo of yourself. JPG, PNG or WEBP, up to 5MB.">
          Profile picture
        </FieldLabel>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="group relative rounded-full outline-none focus-visible:ring-4 focus-visible:ring-primary-100"
            aria-label="Upload profile picture"
          >
            <Avatar
              src={form.profileImageUrl || undefined}
              alt="Profile"
              fallback={form.firstName?.[0]?.toUpperCase() || 'K'}
              size="xl"
            />
            <span className="absolute inset-0 rounded-full bg-primary-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploading ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                <Camera size={18} className="text-white" />
              )}
            </span>
          </button>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm font-semibold text-primary-900 hover:text-primary-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : form.profileImageUrl ? 'Change photo' : 'Upload photo'}
            </button>
            <p className="text-xs text-neutral-400 mt-0.5">A friendly face builds trust with families.</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleAvatarSelect(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <Input
          label="First name"
          required
          value={form.firstName}
          onChange={(e) => update({ firstName: e.target.value })}
          className="rounded-xl"
        />
        <Input
          label="Last name"
          required
          value={form.lastName}
          onChange={(e) => update({ lastName: e.target.value })}
          className="rounded-xl"
        />
        <Input
          label="Age"
          type="number"
          required
          min={16}
          max={80}
          value={form.age}
          onChange={(e) => update({ age: e.target.value })}
          className="rounded-xl"
        />
        <Input
          label="Contact number"
          required
          value={form.phone}
          onChange={(e) => {
            let val = e.target.value;
            if (!val.startsWith('+91 ')) {
              val = '+91 ' + val.replace(/^\+?9?1?\s*/, '');
            }
            const rest = val.slice(4).replace(/\D/g, '').slice(0, 10);
            update({ phone: '+91 ' + rest });
          }}
          error={
            form.phone && form.phone.length > 4 && form.phone.slice(4).replace(/\D/g, '').length < 10
              ? 'Phone number must be 10 digits'
              : undefined
          }
          className="rounded-xl"
        />
      </div>

      <PillSingleSelect
        label="Gender"
        required
        options={GENDER_OPTIONS.map((g) => ({ value: g, label: g }))}
        value={form.gender}
        onChange={(g) => update({ gender: g })}
      />

      <Input label="Email address" value={email} disabled className="rounded-xl" />

      <Input
        label="Current residential address"
        required
        value={form.address}
        onChange={(e) => update({ address: e.target.value })}
        className="rounded-xl"
      />

      <div>
        <Checkbox
          label="My permanent address is the same as my current address"
          checked={form.sameAsCurrentAddress}
          onChange={(e) => update({ sameAsCurrentAddress: e.target.checked })}
        />
        {!form.sameAsCurrentAddress && (
          <Input
            label="Permanent address"
            value={form.permanentAddress}
            onChange={(e) => update({ permanentAddress: e.target.value })}
            className="rounded-xl mt-4"
          />
        )}
      </div>

      <Input
        label="City"
        required
        value={form.city}
        onChange={(e) => update({ city: e.target.value })}
        className="rounded-xl max-w-sm"
      />
    </div>
  );
}
