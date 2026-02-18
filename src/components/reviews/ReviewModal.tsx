import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/ToastProvider';

interface ReviewModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [canReview, setCanReview] = useState(false);

  const checkEligibility = React.useCallback(async () => {
    try {
      setCheckingEligibility(true);
      const response = await api.reviews.checkEligibility(bookingId);

      if (response.canReview) {
        setCanReview(true);
      } else {
        setCanReview(false);
        setEligibilityError(
          response.reason || 'You cannot review this booking.'
        );
      }
    } catch (error) {
      console.error('Failed to check eligibility:', error);
      setEligibilityError('Failed to check review eligibility.');
      setCanReview(false);
    } finally {
      setCheckingEligibility(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (isOpen && bookingId) {
      checkEligibility();
      // Reset form
      setRating(0);
      setComment('');
      setEligibilityError(null);
    }
  }, [isOpen, bookingId, checkEligibility]);

  const handleSubmit = async () => {
    if (rating === 0) {
      addToast({ type: 'error', message: 'Please select a rating' });
      return;
    }

    try {
      setLoading(true);
      await api.reviews.create({
        bookingId,
        rating,
        comment,
      });
      addToast({ type: 'success', message: 'Review submitted successfully!' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      addToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to submit review',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave a Review"
      maxWidth="lg"
    >
      {checkingEligibility ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !canReview ? (
        <div className="text-center py-6">
          <p className="text-red-600 mb-4">{eligibilityError}</p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={32}
                    className={`${
                      (hoverRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-neutral-500 h-5">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-sm font-medium text-neutral-700"
            >
              Comment (Optional)
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full rounded-xl border border-neutral-200 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
            />
            <div className="text-right text-xs text-neutral-400">
              {comment.length}/1000
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || rating === 0}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
