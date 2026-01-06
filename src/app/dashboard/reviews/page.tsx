"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Review } from '@/types/api';
import { ReviewCard } from '@/components/features/ReviewCard';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';

export default function ReviewsDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
            return;
        }

        const fetchReviews = async () => {
            if (!user) return;

            try {
                setLoading(true);
                // Users see reviews *about* them mostly, or *by* them?
                // Typically "My Reviews" means reviews I've received.
                // But parents might want to see reviews they wrote?
                // Let's assume for now it shows reviews RECEIVED.
                const data = await api.reviews.getByUser(user.id);
                setReviews(data);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
                setError('Failed to load your reviews.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchReviews();
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 font-display">My Reviews</h1>
                    <p className="text-stone-500 mt-1">
                        See what others are saying about your experience properly.
                    </p>
                </div>

                {reviews.length > 0 && (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                        <div className="flex flex-col">
                            <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">Average Rating</span>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-stone-900">{averageRating}</span>
                                <div className="flex text-amber-400">
                                    <Star size={20} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-stone-100"></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">Total Reviews</span>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-stone-900">{reviews.length}</span>
                                <MessageSquare size={20} className="text-stone-300" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 border-dashed">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                            <Star size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-2">No reviews yet</h3>
                        <p className="text-stone-500 max-w-sm mx-auto">
                            When you complete bookings, reviews from others will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
