'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/hooks/usePreferences';
import { useToast } from '@/components/ui/ToastProvider';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { updatePreferences } = usePreferences();
  const { addToast } = useToast();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.profiles?.address) {
      setAddress(user.profiles.address);
    }
  }, [isOpen, user]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast({
        message: 'Geolocation is not supported by your browser',
        type: 'error',
      });
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          let addressText = 'Current Location';

          // Try to reverse geocode
          try {
            const reverseRes = await api.location.reverseGeocode(latitude, longitude);
            if (reverseRes.success && reverseRes.data) {
              addressText = reverseRes.data.address;
              setAddress(addressText);
            }
          } catch (err) {
            console.warn('Reverse geocoding failed:', err);
          }

          // Update user profile if logged in
          if (user?.id) {
            await api.users.update(user.id, {
              lat: latitude,
              lng: longitude,
              address: addressText,
            });
          }

          // Always update preferences
          updatePreferences({
            location: {
              lat: latitude,
              lng: longitude,
              address: addressText,
            },
          });

          addToast({
            message: 'Location updated successfully',
            type: 'success',
          });
          onClose();
          window.location.reload(); // Refresh to apply location changes across app
        } catch (error: unknown) {
          console.error('Error updating location:', error);
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to update location';
          addToast({ message, type: 'error' });
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to retrieve your location';
        if (error.code === 1)
          errorMessage =
            'Location permission denied. Please enable it in your browser settings.';
        else if (error.code === 2)
          errorMessage = 'Location information is unavailable.';
        else if (error.code === 3)
          errorMessage = 'Location retrieval timed out.';

        addToast({ message: errorMessage, type: 'error' });
        setGeoLoading(false);
      }
    );
  };

  const handleManualUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    try {
      // Geocode the address
      const response = await api.location.geocode(address);
      if (response.success && response.data) {
        const { lat, lng } = response.data;

        if (user?.id) {
          await api.users.update(user.id, {
            lat,
            lng,
            address: address, // Update address string too
          });
        }

        updatePreferences({
          location: {
            lat,
            lng,
            address: address,
          },
        });

        addToast({ message: 'Location updated successfully', type: 'success' });
        onClose();
        window.location.reload();
      } else {
        addToast({ message: 'Could not find this location', type: 'error' });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      addToast({ message: 'Failed to update location', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Location"
      maxWidth="500px"
    >
      <div className="space-y-6">
        <Button
          variant="outline"
          className="w-full h-12 flex items-center justify-center gap-2 text-stone-900 border-stone-200 hover:bg-stone-100"
          onClick={handleUseCurrentLocation}
          disabled={geoLoading || loading}
        >
          {geoLoading ? (
            <span>Getting location...</span>
          ) : (
            <>
              <Navigation size={18} />
              Use Current Location
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-500">
              Or enter address
            </span>
          </div>
        </div>

        <form onSubmit={handleManualUpdate} className="space-y-4">
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Enter your city or zip code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-xl"
            disabled={loading || geoLoading || !address.trim()}
          >
            {loading ? 'Updating...' : 'Update Location'}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
