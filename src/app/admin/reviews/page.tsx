'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { EnhancedReview } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<EnhancedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.enhancedAdmin.getReviews();
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.enhancedAdmin.approveReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to approve review:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.enhancedAdmin.rejectReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to reject review:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(
            i < rating ? 'text-accent-400 fill-accent-400' : 'text-neutral-300'
          )}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-dvh bg-neutral-50 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin')}
              className="rounded-xl"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-900 font-display">
                Review Moderation
              </h1>
              <p className="text-neutral-500">Approve or reject user reviews</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Pending Review</p>
                <p className="text-xl font-bold text-primary-900">
                  {reviews.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                All caught up!
              </h3>
              <p className="text-neutral-500">No reviews pending moderation.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-neutral-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Rating Categories */}
                    {(review.rating_punctuality ||
                      review.rating_professionalism ||
                      review.rating_care_quality ||
                      review.rating_communication) && (
                        <div className="flex flex-wrap gap-3 mb-3">
                          {review.rating_punctuality && (
                            <div className="text-xs bg-neutral-100 px-2 py-1 rounded-md">
                              Punctuality: {review.rating_punctuality}/5
                            </div>
                          )}
                          {review.rating_professionalism && (
                            <div className="text-xs bg-neutral-100 px-2 py-1 rounded-md">
                              Professionalism: {review.rating_professionalism}/5
                            </div>
                          )}
                          {review.rating_care_quality && (
                            <div className="text-xs bg-neutral-100 px-2 py-1 rounded-md">
                              Care Quality: {review.rating_care_quality}/5
                            </div>
                          )}
                          {review.rating_communication && (
                            <div className="text-xs bg-neutral-100 px-2 py-1 rounded-md">
                              Communication: {review.rating_communication}/5
                            </div>
                          )}
                        </div>
                      )}

                    <p className="text-neutral-600 mb-4">
                      {review.comment || (
                        <span className="italic text-neutral-400">
                          No comment provided
                        </span>
                      )}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>
                        By:{' '}
                        {review.reviewer?.profiles?.first_name || 'Anonymous'}{' '}
                        {review.reviewer?.profiles?.last_name || ''}
                      </span>
                      <span>•</span>
                      <span>
                        For: {review.reviewee?.profiles?.first_name || 'User'}{' '}
                        {review.reviewee?.profiles?.last_name || ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReject(review.id)}
                      disabled={actionLoading === review.id}
                      variant="outline"
                      className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle size={18} className="mr-1" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(review.id)}
                      disabled={actionLoading === review.id}
                      className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl"
                    >
                      <CheckCircle size={18} className="mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
