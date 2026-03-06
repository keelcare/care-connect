import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
    'w-full min-h-[120px] px-4 py-3 font-body text-base text-neutral-900 bg-white border-2 border-neutral-300 rounded-xl transition-all duration-200 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70 resize-none',
    {
        variants: {
            state: {
                default: '',
                error: 'border-error-500 focus:border-error-500 focus:ring-error-50',
            },
        },
        defaultVariants: {
            state: 'default',
        },
    }
);

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            required,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId();
        const textareaId = id || `textarea-${generatedId}`;
        const errorId = `${textareaId}-error`;
        const helperId = `${textareaId}-helper`;

        return (
            <div className="w-full mb-4">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                        {label}
                        {required && <span className="text-error-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        textareaVariants({
                            state: error ? 'error' : 'default',
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

Textarea.displayName = 'Textarea';
