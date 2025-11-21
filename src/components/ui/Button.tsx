import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'text' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const classes = [
            styles.button,
            styles[variant],
            styles[size],
            isLoading && styles.loading,
            disabled && styles.disabled,
            className
        ].filter(Boolean).join(' ');

        return (
            <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
                {isLoading ? <span className={styles.spinner} aria-label="Loading" /> : children}
            </button>
        );
    }
);

Button.displayName = 'Button';
