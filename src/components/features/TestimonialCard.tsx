import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import styles from './TestimonialCard.module.css';

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authorName,
  authorRole,
  authorImage,
}) => {
  return (
    <div className={styles.card}>
      <Quote size={32} className={styles.quoteIcon} fill="currentColor" />
      <blockquote className={styles.quote}>&quot;{quote}&quot;</blockquote>
      <div className={styles.author}>
        <Image
          src={authorImage}
          alt={authorName}
          width={48}
          height={48}
          className={styles.avatar}
        />
        <div className={styles.authorInfo}>
          <span className={styles.name}>{authorName}</span>
          <span className={styles.role}>{authorRole}</span>
        </div>
      </div>
    </div>
  );
};
