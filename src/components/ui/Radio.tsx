import React from 'react';
import styles from './Radio.module.css';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, disabled, ...props }, ref) => {
    return (
      <label
        className={`${styles.container} ${disabled ? styles.disabled : ''} ${className || ''}`}
      >
        <input
          type="radio"
          className={styles.input}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <span className={styles.checkmark}>
          <span className={styles.dot} />
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
