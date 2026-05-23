'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Only show if user is logged in and hasn't consented yet
    if (user) {
      const hasConsented = localStorage.getItem('dpdpa_consent_v1');
      if (!hasConsented) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
    }
  }, [user]);

  if (!isVisible) return null;

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await api.consents.create({ purpose: 'data_processing_and_storage', version: 'v1.0' });
      localStorage.setItem('dpdpa_consent_v1', 'true');
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to record consent:', error);
      alert('Failed to record consent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 md:p-6 z-[9999] flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-1 text-sm md:text-base text-neutral-700">
        <p>
          <strong>Privacy Update:</strong> We have updated our data processing practices in compliance with the Digital Personal Data Protection Act (DPDPA 2023). 
          By clicking &quot;Accept&quot;, you consent to the storage and processing of your personal data as described in our Privacy Policy.
        </p>
      </div>
      <div className="flex-shrink-0 w-full md:w-auto flex gap-3">
        <Button 
          onClick={handleAccept} 
          disabled={isSubmitting}
          className="w-full md:w-auto shadow-md"
        >
          {isSubmitting ? 'Processing...' : 'Accept & Continue'}
        </Button>
      </div>
    </div>
  );
}
