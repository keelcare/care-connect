'use client';

import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface RatingCategory {
  key: string;
  label: string;
  description: string;
}

const RATING_CATEGORIES: RatingCategory[] = [
  { key: 'rating', label: 'Overall', description: 'Overall experience' },
  {
    key: 'rating_punctuality',
    label: 'Punctuality',
    description: 'Arrived on time',
  },
  {
    key: 'rating_professionalism',
    label: 'Professionalism',
    description: 'Professional behavior',
  },
  {
    key: 'rating_care_quality',
    label: 'Care Quality',
    description: 'Quality of care provided',
  },
  {
    key: 'rating_communication',
    label: 'Communication',
    description: 'Clear communication',
  },
];

interface EnhancedReviewFormProps {
  bookingId: string;
  revieweeId: string;
  revieweeName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EnhancedReviewForm({
  bookingId,
  revieweeId,
  revieweeName,
  onSuccess,
  onCancel,
}: EnhancedReviewFormProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({
    rating: 0,
    rating_punctuality: 0,
    rating_professionalism: 0,
    rating_care_quality: 0,
    rating_communication: 0,
  });
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>(
    {}
  );
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleHover = (category: string, value: number) => {
    setHoveredRating((prev) => ({ ...prev, [category]: value }));
  };

  const handleHoverEnd = (category: string) => {
    setHoveredRating((prev) => ({ ...prev, [category]: 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ratings.rating === 0) {
      setError('Please provide an overall rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.enhancedReviews.create({
        bookingId,
        revieweeId,
        rating: ratings.rating,
        rating_punctuality: ratings.rating_punctuality || undefined,
        rating_professionalism: ratings.rating_professionalism || undefined,
        rating_care_quality: ratings.rating_care_quality || undefined,
        rating_communication: ratings.rating_communication || undefined,
        comment: comment.trim() || undefined,
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (category: string) => {
    const currentRating = hoveredRating[category] || ratings[category];

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            onMouseEnter={() => handleHover(category, star)}
            onMouseLeave={() => handleHoverEnd(category)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              size={24}
              className={cn(
                'transition-colors',
                star <= currentRating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-stone-300'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating =
    Object.values(ratings)
      .filter((r) => r > 0)
      .reduce((a, b) => a + b, 0) /
      Object.values(ratings).filter((r) => r > 0).length || 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-stone-900">
            Write a Review
          </h3>
          <p className="text-stone-500 text-sm">
            Share your experience with {revieweeName}
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} className="text-stone-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Categories */}
        <div className="space-y-4">
          {RATING_CATEGORIES.map((category, index) => (
            <div
              key={category.key}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl transition-colors',
                index === 0
                  ? 'bg-stone-50 border-2 border-stone-200'
                  : 'hover:bg-stone-50'
              )}
            >
              <div>
                <p
                  className={cn(
                    'font-medium text-stone-900',
                    index === 0 && 'text-lg'
                  )}
                >
                  {category.label}
                  {index === 0 && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-sm text-stone-500">{category.description}</p>
              </div>
              {renderStars(category.key)}
            </div>
          ))}
        </div>

        {/* Average Rating Display */}
        {averageRating > 0 && (
          <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 rounded-xl">
            <Star size={24} className="text-amber-400 fill-amber-400" />
            <span className="text-2xl font-bold text-amber-600">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-stone-500">average rating</span>
          </div>
        )}

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Your Review (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about your experience..."
            rows={4}
            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none"
          />
          <p className="text-xs text-stone-400 mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || ratings.rating === 0}
            isLoading={isSubmitting}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
          >
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
}
