'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Save,
  RefreshCw,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { SystemSetting } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { AdminPageHeader, SectionCard } from '@/components/admin/ui';

interface SettingConfig {
  key: string;
  label: string;
  description: string;
  type: 'number' | 'boolean' | 'text';
  icon: React.ReactNode;
  category: string;
}

const SETTING_CONFIGS: SettingConfig[] = [
  {
    key: 'matching_radius',
    label: 'Matching Radius',
    description: 'Default radius (in km) for matching nannies to requests',
    type: 'number',
    icon: <MapPin size={20} />,
    category: 'Matching',
  },
  {
    key: 'response_timeout',
    label: 'Response Timeout',
    description: 'Time (in minutes) for nannies to respond to assignments',
    type: 'number',
    icon: <Clock size={20} />,
    category: 'Matching',
  },
  {
    key: 'cancellation_fee_percentage',
    label: 'Cancellation Fee (%)',
    description: 'Percentage fee for late cancellations (within 24 hours)',
    type: 'number',
    icon: <DollarSign size={20} />,
    category: 'Payments',
  },
  {
    key: 'platform_fee_percentage',
    label: 'Platform Fee (%)',
    description: 'Percentage fee taken by the platform per booking',
    type: 'number',
    icon: <DollarSign size={20} />,
    category: 'Payments',
  },
  {
    key: 'require_verification',
    label: 'Require Verification',
    description: 'Require nannies to be verified before accepting bookings',
    type: 'boolean',
    icon: <Shield size={20} />,
    category: 'Security',
  },
  {
    key: 'enable_notifications',
    label: 'Enable Notifications',
    description: 'Enable in-app notifications for all users',
    type: 'boolean',
    icon: <Bell size={20} />,
    category: 'Notifications',
  },
];

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.enhancedAdmin.getSettings();
      const settingsMap: Record<string, any> = {};
      data.forEach((s: SystemSetting) => {
        settingsMap[s.key] = s.value;
      });
      setSettings(settingsMap);
    } catch (err) {
      // Use default values if fetch fails
      setSettings({
        matching_radius: 10,
        response_timeout: 15,
        cancellation_fee_percentage: 20,
        platform_fee_percentage: 10,
        require_verification: true,
        enable_notifications: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: any) => {
    setSaving(key);
    setError('');
    setSuccessMessage('');

    try {
      await api.enhancedAdmin.updateSetting(key, value);
      setSettings((prev) => ({ ...prev, [key]: value }));
      setSuccessMessage(`${key.replace(/_/g, ' ')} updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update setting');
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const categories = [...new Set(SETTING_CONFIGS.map((s) => s.category))];

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader
        eyebrow="System"
        title="System Settings"
        subtitle="Configure platform-wide matching, payments, and security rules."
        icon={Settings}
      />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 mb-6 text-sm">{error}</div>
      )}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-4 mb-6 text-sm capitalize">{successMessage}</div>
      )}

      <div className="space-y-6">
        {categories.map((category) => (
          <SectionCard key={category} title={category} bodyClassName="p-0">
            <div className="divide-y divide-neutral-50">
              {SETTING_CONFIGS.filter((s) => s.category === category).map((config) => (
                <div key={config.key} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-700 flex-shrink-0">
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{config.label}</h3>
                        <p className="text-sm text-neutral-500 mt-0.5">{config.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {config.type === 'boolean' ? (
                        <button
                          onClick={() => handleSave(config.key, !settings[config.key])}
                          disabled={saving === config.key}
                          className={cn(
                            'relative w-14 h-8 rounded-full transition-colors',
                            settings[config.key] ? 'bg-primary-600' : 'bg-neutral-300'
                          )}
                        >
                          <div
                            className={cn(
                              'absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform',
                              settings[config.key] ? 'translate-x-7' : 'translate-x-1'
                            )}
                          />
                        </button>
                      ) : (
                        <>
                          <input
                            type={config.type}
                            value={settings[config.key] || ''}
                            onChange={(e) =>
                              handleChange(
                                config.key,
                                config.type === 'number' ? Number(e.target.value) : e.target.value
                              )
                            }
                            className="w-24 px-3 py-2 border border-neutral-200 rounded-lg text-right focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none"
                          />
                          <Button
                            onClick={() => handleSave(config.key, settings[config.key])}
                            disabled={saving === config.key}
                            size="sm"
                            className="bg-primary-900 hover:bg-primary-800 text-white rounded-lg"
                          >
                            {saving === config.key ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
