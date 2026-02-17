import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, disabled, id, ...props }, ref) => {
    const radioId = id || `radio-${React.useId()}`;

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'inline-flex items-center gap-3 cursor-pointer group',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative">
          <input
            type="radio"
            id={radioId}
            className="peer sr-only"
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              'min-h-tap min-w-tap w-6 h-6 flex items-center justify-center rounded-full border-2 border-neutral-300 bg-white transition-all duration-200',
              'peer-focus-visible:ring-4 peer-focus-visible:ring-primary-100 peer-focus-visible:border-primary-500',
              'peer-checked:border-primary-900',
              'peer-disabled:bg-neutral-100 peer-disabled:cursor-not-allowed',
              !disabled && 'group-hover:border-primary-500'
            )}
          >
            <div
              className={cn(
                'w-3 h-3 rounded-full bg-primary-900 scale-0 transition-transform duration-200',
                'peer-checked:scale-100'
              )}
            />
          </div>
        </div>
        {label && (
          <span
            className={cn(
              'text-base text-neutral-900 select-none',
              disabled && 'text-neutral-500'
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
