'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, MessageCircle, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { EnhancedReview } from '@/types/api';
import { cn } from '@/lib/utils';

interface ReviewActionsProps {
  review: EnhancedReview;
  isOwner: boolean;
  isReviewee: boolean;
  onUpdate?: (updatedReview: EnhancedReview) => void;
  onDelete?: () => void;
}

export function ReviewActions({
  review,
  isOwner,
  isReviewee,
  onUpdate,
  onDelete,
}: ReviewActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedComment, setEditedComment] = useState(review.comment || '');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = async () => {
    setLoading(true);
    setError('');
    try {
      const updated = await api.enhancedReviews.update(review.id, {
        rating: editedRating,
        comment: editedComment,
      });
      onUpdate?.(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await api.enhancedReviews.delete(review.id);
      onDelete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  const handleResponse = async () => {
    if (!responseText.trim()) return;

    setLoading(true);
    setError('');
    try {
      const updated = await api.enhancedReviews.addResponse(review.id, {
        response: responseText,
      });
      onUpdate?.(updated);
      setIsResponding(false);
      setResponseText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add response');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value: number, onChange?: (v: number) => void) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={cn(
            'p-0.5',
            onChange && 'cursor-pointer hover:scale-110 transition-transform'
          )}
        >
          <Star
            size={18}
            className={cn(
              star <= value ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
            )}
          />
        </button>
      ))}
    </div>
  );

  // Edit Modal
  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-stone-900">
              Edit Review
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 hover:bg-stone-100 rounded-full"
            >
              <X size={20} className="text-stone-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Rating
              </label>
              {renderStars(editedRating, setEditedRating)}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Comment
              </label>
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-accent-200 focus:border-accent-400 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={loading}
                isLoading={loading}
                className="flex-1 bg-accent hover:bg-accent-600 text-white rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Delete Confirmation
  if (isDeleting) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              Delete Review?
            </h3>
            <p className="text-stone-500">
              This action cannot be undone. Your review will be permanently
              removed.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleting(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              isLoading={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Response Modal
  if (isResponding) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-stone-900">
              Respond to Review
            </h3>
            <button
              onClick={() => setIsResponding(false)}
              className="p-2 hover:bg-stone-100 rounded-full"
            >
              <X size={20} className="text-stone-500" />
            </button>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 mb-4">
            <div className="flex gap-2 mb-2">{renderStars(review.rating)}</div>
            <p className="text-stone-600 text-sm">
              {review.comment || 'No comment'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Your Response
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Thank you for your feedback..."
                rows={4}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-accent-200 focus:border-accent-400 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsResponding(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleResponse}
                disabled={loading || !responseText.trim()}
                isLoading={loading}
                className="flex-1 bg-accent hover:bg-accent-600 text-white rounded-xl"
              >
                Send Response
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Action Buttons
  return (
    <div className="flex gap-2">
      {isOwner && (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors group"
            title="Edit review"
          >
            <Edit2
              size={16}
              className="text-stone-400 group-hover:text-stone-600"
            />
          </button>
          <button
            onClick={() => setIsDeleting(true)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Delete review"
          >
            <Trash2
              size={16}
              className="text-stone-400 group-hover:text-red-600"
            />
          </button>
        </>
      )}
      {isReviewee && !review.response && (
        <button
          onClick={() => setIsResponding(true)}
          className="p-2 hover:bg-accent-50 rounded-lg transition-colors group"
          title="Respond to review"
        >
          <MessageCircle
            size={16}
            className="text-stone-400 group-hover:text-accent"
          />
        </button>
      )}
    </div>
  );
}
