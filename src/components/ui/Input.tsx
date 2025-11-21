import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, leftIcon, rightElement, required, disabled, ...props }, ref) => {
        const inputClasses = [
            styles.input,
            error && styles.errorInput,
            className
        ].filter(Boolean).join(' ');

        const wrapperClasses = [
            styles.inputWrapper,
            leftIcon && styles.hasLeftIcon,
            rightElement && styles.hasRightElement
        ].filter(Boolean).join(' ');

        return (
            <div className={styles.container}>
                {label && (
                    <label className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}
                <div className={wrapperClasses}>
                    {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
                    <input
                        ref={ref}
                        className={inputClasses}
                        disabled={disabled}
                        aria-invalid={!!error}
                        {...props}
                    />
                    {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
                </div>
                {error && <p className={`${styles.helperText} ${styles.errorText}`}>{error}</p>}
                {!error && helperText && <p className={styles.helperText}>{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
