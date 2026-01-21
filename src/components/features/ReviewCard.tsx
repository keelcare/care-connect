'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/types/api';
import styles from './ReviewCard.module.css';
import { Avatar } from '@/components/ui/avatar';

interface ReviewCardProps {
  review: Review;
  type?: 'received' | 'written';
}

export function ReviewCard({ review, type = 'received' }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const targetUser = type === 'received' ? review.reviewer : review.reviewee;

  const getTargetName = () => {
    if (targetUser?.profiles?.first_name && targetUser?.profiles?.last_name) {
      return `${targetUser.profiles.first_name} ${targetUser.profiles.last_name}`;
    }
    return targetUser?.email || 'Anonymous';
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <Avatar
              src={targetUser?.profiles?.profile_image_url || undefined}
              alt={getTargetName()}
              fallback={getTargetName().charAt(0).toUpperCase()}
              size="md"
              ringColor="bg-secondary/20"
            />
          </div>
          <div>
            <p className={styles.name}>{getTargetName()}</p>
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

      {review.comment && <p className={styles.comment}>{review.comment}</p>}
    </div>
  );
}
