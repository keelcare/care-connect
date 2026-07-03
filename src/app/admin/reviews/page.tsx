'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { EnhancedReview } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  AdminPageHeader,
  StatCard,
  SectionCard,
  EmptyState,
} from '@/components/admin/ui';

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<EnhancedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      const response = await api.enhancedAdmin.getReviews(1, 1000);
      setReviews(response.data || []);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.enhancedAdmin.approveReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.enhancedAdmin.rejectReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={cn(i < rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-200')} />
      ))}
    </div>
  );

  if (loading) {
    return <div className="h-[50vh] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader
        eyebrow="Moderation"
        title="Review Moderation"
        subtitle="Approve or reject user reviews before they appear publicly."
        icon={Star}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Pending Review" value={reviews.length} icon={Clock} tone="amber" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 mb-6 text-sm">{error}</div>
      )}

      {reviews.length === 0 ? (
        <SectionCard bodyClassName="p-0">
          <EmptyState icon={CheckCircle} title="All caught up!" description="No reviews pending moderation." />
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-[24px] border border-neutral-100 shadow-soft p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    {renderStars(review.rating)}
                    <span className="text-sm text-neutral-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>

                  {(review.rating_punctuality || review.rating_professionalism || review.rating_care_quality || review.rating_communication) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.rating_punctuality ? <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg">Punctuality {review.rating_punctuality}/5</span> : null}
                      {review.rating_professionalism ? <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg">Professionalism {review.rating_professionalism}/5</span> : null}
                      {review.rating_care_quality ? <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg">Care Quality {review.rating_care_quality}/5</span> : null}
                      {review.rating_communication ? <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg">Communication {review.rating_communication}/5</span> : null}
                    </div>
                  )}

                  <p className="text-neutral-600 mb-4">
                    {review.comment || <span className="italic text-neutral-400">No comment provided</span>}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
                    <span>By {review.reviewer?.profiles?.first_name || 'Anonymous'} {review.reviewer?.profiles?.last_name || ''}</span>
                    <span className="text-neutral-300">•</span>
                    <span>For {review.reviewee?.profiles?.first_name || 'User'} {review.reviewee?.profiles?.last_name || ''}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button onClick={() => handleReject(review.id)} disabled={actionLoading === review.id} variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50">
                    <XCircle size={18} className="mr-1" /> Reject
                  </Button>
                  <Button onClick={() => handleApprove(review.id)} disabled={actionLoading === review.id} className="bg-primary-900 hover:bg-primary-800 text-white rounded-xl">
                    <CheckCircle size={18} className="mr-1" /> Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
