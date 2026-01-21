'use client';

import React, { useState } from 'react';
import { MapPin, Shield, Bell, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeofenceSettingsProps {
  bookingId: string;
  defaultRadius?: number; // in kilometers
  onSave?: (settings: GeofenceSettingsData) => Promise<void>;
  isLoading?: boolean;
}

export interface GeofenceSettingsData {
  radius: number;
  enableAlerts: boolean;
  alertOnExit: boolean;
  alertOnReturn: boolean;
}

const PRESET_RADII = [
  { value: 0.1, label: '100m', description: 'Very close - within building' },
  { value: 0.25, label: '250m', description: 'Close - within block' },
  { value: 0.5, label: '500m', description: 'Nearby - short walk' },
  { value: 1, label: '1km', description: 'Local area' },
  { value: 2, label: '2km', description: 'Neighborhood' },
  { value: 5, label: '5km', description: 'Extended area' },
];

export function GeofenceSettings({
  bookingId,
  defaultRadius = 0.5,
  onSave,
  isLoading = false,
}: GeofenceSettingsProps) {
  const [settings, setSettings] = useState<GeofenceSettingsData>({
    radius: defaultRadius,
    enableAlerts: true,
    alertOnExit: true,
    alertOnReturn: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleRadiusChange = (radius: number) => {
    setSettings((prev) => ({ ...prev, radius }));
    setSaved(false);
  };

  const handleToggle = (key: keyof Omit<GeofenceSettingsData, 'radius'>) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave(settings);
      setSaved(true);
    } catch (error) {
      console.error('Failed to save geofence settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-stone-50 to-emerald-50 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Shield size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Geofence Settings</h3>
            <p className="text-sm text-stone-500">
              Configure location monitoring alerts
            </p>
          </div>
        </div>
      </div>

      {/* Radius Selection */}
      <div className="p-5 border-b border-stone-100">
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Alert Radius
        </label>
        <p className="text-xs text-stone-500 mb-4">
          You'll be notified if the caregiver moves beyond this distance from
          the designated location.
        </p>

        <div className="grid grid-cols-3 gap-2">
          {PRESET_RADII.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleRadiusChange(preset.value)}
              className={`p-3 rounded-xl border transition-all text-left ${
                settings.radius === preset.value
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <div
                className={`text-lg font-bold ${
                  settings.radius === preset.value
                    ? 'text-emerald-700'
                    : 'text-stone-900'
                }`}
              >
                {preset.label}
              </div>
              <div
                className={`text-xs ${
                  settings.radius === preset.value
                    ? 'text-emerald-600'
                    : 'text-stone-500'
                }`}
              >
                {preset.description}
              </div>
            </button>
          ))}
        </div>

        {/* Visual Indicator */}
        <div className="mt-4 p-4 bg-stone-50 rounded-xl">
          <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
            <MapPin size={16} className="text-emerald-600" />
            <span>
              Alerts trigger when distance exceeds{' '}
              <strong className="text-emerald-700">
                {settings.radius < 1
                  ? `${settings.radius * 1000}m`
                  : `${settings.radius}km`}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Alert Toggles */}
      <div className="p-5 space-y-4">
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Notification Preferences
        </label>

        {/* Enable Alerts */}
        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Bell size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-stone-900">
                Enable Geofence Alerts
              </p>
              <p className="text-xs text-stone-500">
                Receive real-time location alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('enableAlerts')}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              settings.enableAlerts ? 'bg-emerald-600' : 'bg-stone-300'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                settings.enableAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {settings.enableAlerts && (
          <>
            {/* Alert on Exit */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl ml-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Alert on Exit</p>
                  <p className="text-xs text-stone-500">
                    Notify when leaving the area
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('alertOnExit')}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  settings.alertOnExit ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.alertOnExit ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Alert on Return */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl ml-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MapPin size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Alert on Return</p>
                  <p className="text-xs text-stone-500">
                    Notify when returning to area
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('alertOnReturn')}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  settings.alertOnReturn ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.alertOnReturn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="px-5 py-4 bg-stone-50 border-t border-stone-100">
          <Button
            onClick={handleSave}
            disabled={saving || isLoading}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Save size={18} className="mr-2" />
                Settings Saved
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
