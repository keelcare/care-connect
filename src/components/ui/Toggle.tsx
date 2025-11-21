import React from 'react';
import styles from './Toggle.module.css';

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
    ({ label, className, disabled, ...props }, ref) => {
        return (
            <label className={`${styles.container} ${disabled ? styles.disabled : ''} ${className || ''}`}>
                <input
                    type="checkbox"
                    className={styles.input}
                    disabled={disabled}
                    ref={ref}
                    {...props}
                />
                <span className={styles.switch}>
                    <span className={styles.thumb} />
                </span>
                {label && <span className={styles.label}>{label}</span>}
            </label>
        );
    }
);

Toggle.displayName = 'Toggle';
