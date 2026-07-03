import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface UserPreferences {
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  searchFilters?: {
    maxRate?: number;
    requiredSkills?: string[];
    radius?: number;
  };
}

const STORAGE_KEY = 'user_preferences';
// Fired in the same tab when preferences change (the native `storage` event
// only fires in *other* tabs, so we need this to sync hook instances locally).
const PREFERENCES_EVENT = 'preferences-updated';

function readPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserPreferences) : {};
  } catch (error) {
    logger.error('Failed to load preferences:', error);
    return {};
  }
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [loading, setLoading] = useState(true);

  // Load on mount and keep every hook instance in sync with changes made
  // elsewhere — other tabs (`storage`) and other instances in this tab
  // (`preferences-updated`).
  useEffect(() => {
    setPreferences(readPreferences());
    setLoading(false);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setPreferences(readPreferences());
    };
    const handleLocal = () => setPreferences(readPreferences());

    window.addEventListener('storage', handleStorage);
    window.addEventListener(PREFERENCES_EVENT, handleLocal);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(PREFERENCES_EVENT, handleLocal);
    };
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    // Merge against the latest persisted value so concurrent instances don't
    // clobber each other's writes.
    const newPreferences = { ...readPreferences(), ...updates };
    setPreferences(newPreferences);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      window.dispatchEvent(new Event(PREFERENCES_EVENT));
    } catch (error) {
      logger.error('Failed to save preferences:', error);
    }
  };

  const clearPreferences = () => {
    setPreferences({});
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(PREFERENCES_EVENT));
    } catch (error) {
      logger.error('Failed to clear preferences:', error);
    }
  };

  return { preferences, updatePreferences, clearPreferences, loading };
}
