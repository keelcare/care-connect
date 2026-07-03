'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { logger } from '@/lib/logger';

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
      logger.error('Failed to record consent:', error);
      alert('Failed to record consent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-neutral-200 shadow-xl rounded-xl p-4 z-[9999] flex flex-col gap-3">
      <div className="flex-1 text-xs text-neutral-600 leading-relaxed">
        <p>
          <strong>Privacy Update:</strong> We have updated our data processing practices in compliance with the Digital Personal Data Protection Act (DPDPA 2023). 
          By clicking &quot;Accept&quot;, you consent to the storage and processing of your personal data as described in our Privacy Policy.
        </p>
      </div>
      <div className="w-full">
        <Button 
          onClick={handleAccept} 
          disabled={isSubmitting}
          className="w-full text-xs h-9"
        >
          {isSubmitting ? 'Processing...' : 'Accept & Continue'}
        </Button>
      </div>
    </div>
  );
}
