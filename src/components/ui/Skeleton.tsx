import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className || ''}`}
      style={style}
      aria-hidden="true"
    />
  );
};
