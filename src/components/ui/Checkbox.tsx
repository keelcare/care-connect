import React from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, disabled, ...props }, ref) => {
    return (
      <label
        className={`${styles.container} ${disabled ? styles.disabled : ''} ${className || ''}`}
      >
        <input
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <span className={styles.checkmark}>
          <Check size={14} className={styles.icon} strokeWidth={3} />
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
