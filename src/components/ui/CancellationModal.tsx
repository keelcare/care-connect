'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Clock, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  type: 'request' | 'booking';
  startTime?: string; // For calculating cancellation fee
  title?: string;
}

const CANCELLATION_REASONS = {
  request: [
    'Change of plans',
    'Found alternative caregiver',
    'Schedule conflict',
    'Emergency situation',
    'No longer need service',
    'Other',
  ],
  booking: [
    'Emergency came up',
    'Schedule conflict',
    'Child is sick',
    'Found alternative arrangement',
    'Caregiver unavailable',
    'Change of plans',
    'Other',
  ],
};

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  startTime,
  title,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeeWarning, setShowFeeWarning] = useState(false);
  const [hoursUntilStart, setHoursUntilStart] = useState<number | null>(null);

  useEffect(() => {
    if (startTime && type === 'booking') {
      const start = new Date(startTime);
      const now = new Date();
      const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
      setHoursUntilStart(diffHours);
      setShowFeeWarning(diffHours <= 24 && diffHours > 0);
    }
  }, [startTime, type]);

  const handleSubmit = async () => {
    const reason = selectedReason === 'Other' ? customReason : selectedReason;
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      onClose();
      // Reset state
      setSelectedReason('');
      setCustomReason('');
    } catch (error) {
      console.error('Cancellation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = CANCELLATION_REASONS[type];
  const finalReason =
    selectedReason === 'Other' ? customReason : selectedReason;
  const canSubmit = finalReason.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || `Cancel ${type === 'request' ? 'Request' : 'Booking'}`}
    >
      <div className="space-y-6">
        {/* Warning Banner for Booking Cancellation Fee */}
        {type === 'booking' && showFeeWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">
                  Cancellation Fee Applies
                </h4>
                <p className="text-sm text-amber-700">
                  Since this booking starts within 24 hours (
                  {hoursUntilStart?.toFixed(1)} hours from now), a cancellation
                  fee may be charged to compensate the caregiver for their
                  reserved time.
                </p>
                <div className="mt-2 flex items-center gap-2 text-amber-800">
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-medium">
                    Estimated fee: Up to 25% of booking cost
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time Info */}
        {startTime && (
          <div className="flex items-center gap-2 text-sm text-stone-500 bg-stone-50 rounded-lg p-3">
            <Clock className="w-4 h-4" />
            <span>Scheduled for: {new Date(startTime).toLocaleString()}</span>
          </div>
        )}

        {/* Reason Selection */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Please select a reason for cancellation:
          </label>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedReason === reason
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
              >
                <input
                  type="radio"
                  name="cancellation-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-primary-600 border-stone-300 focus:ring-primary-500"
                />
                <span className="text-stone-700">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Reason Input */}
        {selectedReason === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Please specify:
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter your reason..."
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-stone-700"
            />
          </div>
        )}

        {/* Confirmation Text */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm text-red-700">
            <strong>Note:</strong> This action cannot be undone. The{' '}
            {type === 'request' ? 'caregiver' : 'other party'} will be notified
            of the cancellation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-stone-200"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Keep {type === 'request' ? 'Request' : 'Booking'}
          </Button>
          <Button
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            isLoading={isSubmitting}
          >
            Confirm Cancellation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
