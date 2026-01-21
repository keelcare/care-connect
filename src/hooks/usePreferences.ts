import { useState, useEffect } from 'react';

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

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [loading, setLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save preferences whenever they change
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    try {
      localStorage.setItem('user_preferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const clearPreferences = () => {
    setPreferences({});
    try {
      localStorage.removeItem('user_preferences');
    } catch (error) {
      console.error('Failed to clear preferences:', error);
    }
  };

  return { preferences, updatePreferences, clearPreferences, loading };
}
