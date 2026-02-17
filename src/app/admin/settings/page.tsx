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
      <div className="min-h-dvh bg-stone-50 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-stone-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin')}
              className="rounded-xl"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-stone-200 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-stone-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 font-display">
                System Settings
              </h1>
              <p className="text-stone-500">Configure platform-wide settings</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl p-4 mb-6">
            {successMessage}
          </div>
        )}

        {/* Settings by Category */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div
              key={category}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
            >
              <div className="px-6 py-4 bg-stone-50 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900">
                  {category}
                </h2>
              </div>
              <div className="divide-y divide-stone-100">
                {SETTING_CONFIGS.filter((s) => s.category === category).map(
                  (config) => (
                    <div key={config.key} className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-600 flex-shrink-0">
                            {config.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-stone-900">
                              {config.label}
                            </h3>
                            <p className="text-sm text-stone-500 mt-0.5">
                              {config.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {config.type === 'boolean' ? (
                            <button
                              onClick={() =>
                                handleSave(config.key, !settings[config.key])
                              }
                              disabled={saving === config.key}
                              className={cn(
                                'relative w-14 h-8 rounded-full transition-colors',
                                settings[config.key]
                                  ? 'bg-emerald-600'
                                  : 'bg-stone-300'
                              )}
                            >
                              <div
                                className={cn(
                                  'absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform',
                                  settings[config.key]
                                    ? 'translate-x-7'
                                    : 'translate-x-1'
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
                                    config.type === 'number'
                                      ? Number(e.target.value)
                                      : e.target.value
                                  )
                                }
                                className="w-24 px-3 py-2 border border-stone-200 rounded-lg text-right focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                              />
                              <Button
                                onClick={() =>
                                  handleSave(config.key, settings[config.key])
                                }
                                disabled={saving === config.key}
                                size="sm"
                                className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg"
                              >
                                {saving === config.key ? (
                                  <RefreshCw
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Save size={16} />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
