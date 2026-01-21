import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
}) => {
  return (
    <div
      className={`${styles.spinner} ${styles[size]} ${styles[variant]} ${className || ''}`}
      role="status"
      aria-label="Loading"
    />
  );
};
