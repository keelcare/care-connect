"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/types/api';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getReviewerName = () => {
        if (review.reviewer?.profiles?.first_name && review.reviewer?.profiles?.last_name) {
            return `${review.reviewer.profiles.first_name} ${review.reviewer.profiles.last_name}`;
        }
        return review.reviewer?.email || 'Anonymous';
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {review.reviewer?.profiles?.profile_image_url ? (
                            <img
                                src={review.reviewer.profiles.profile_image_url}
                                alt={getReviewerName()}
                            />
                        ) : (
                            <span>{getReviewerName().charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div>
                        <p className={styles.name}>{getReviewerName()}</p>
                        <p className={styles.date}>{formatDate(review.created_at)}</p>
                    </div>
                </div>
                <div className={styles.rating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={16}
                            fill={star <= review.rating ? '#FFC107' : 'none'}
                            stroke={star <= review.rating ? '#FFC107' : '#D1D5DB'}
                            strokeWidth={2}
                        />
                    ))}
                </div>
            </div>

            {review.comment && (
                <p className={styles.comment}>{review.comment}</p>
            )}
        </div>
    );
}
