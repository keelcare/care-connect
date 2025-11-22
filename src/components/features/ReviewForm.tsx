"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { api } from '@/lib/api';
import { CreateReviewDto } from '@/types/api';
import { Button } from '@/components/ui/button';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
    bookingId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ReviewForm({ bookingId, onSuccess, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const reviewData: CreateReviewDto = {
                bookingId,
                rating,
                comment: comment.trim() || undefined
            };

            await api.reviews.create(reviewData);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Failed to submit review:', err);
            setError(err instanceof Error ? err.message : 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>Leave a Review</h3>

            <div className={styles.ratingSection}>
                <label className={styles.label}>Rating</label>
                <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={styles.starButton}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                size={32}
                                fill={star <= (hoveredRating || rating) ? '#FFC107' : 'none'}
                                stroke={star <= (hoveredRating || rating) ? '#FFC107' : '#D1D5DB'}
                                strokeWidth={2}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.commentSection}>
                <label className={styles.label} htmlFor="comment">
                    Comment (Optional)
                </label>
                <textarea
                    id="comment"
                    className={styles.textarea}
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    maxLength={500}
                />
                <span className={styles.charCount}>{comment.length}/500</span>
            </div>

            {error && (
                <div className={styles.error}>{error}</div>
            )}

            <div className={styles.actions}>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" variant="default" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </Button>
            </div>
        </form>
    );
}
