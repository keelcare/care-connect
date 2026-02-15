import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'w-full h-12 px-4 py-3 font-body text-base text-neutral-900 bg-white border-2 border-neutral-300 rounded-xl transition-all duration-200 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      state: {
        default: '',
        error: 'border-error-500 focus:border-error-500 focus:ring-error-50',
      },
      hasIcon: {
        none: '',
        left: 'pl-12',
        right: 'pr-12',
        both: 'pl-12 pr-12',
      },
    },
    defaultVariants: {
      state: 'default',
      hasIcon: 'none',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof inputVariants>, 'state' | 'hasIcon'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      required,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${React.useId()}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Determine icon configuration
    const hasIcon = leftIcon && rightElement 
      ? 'both' 
      : leftIcon 
      ? 'left' 
      : rightElement 
      ? 'right' 
      : 'none';

    return (
      <div className="w-full mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({
                state: error ? 'error' : 'default',
                hasIcon,
              }),
              className
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-required={required}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="mt-1.5 text-sm text-neutral-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
