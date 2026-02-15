import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { switch: 'w-10 h-6', thumb: 'w-4 h-4', translate: 'translate-x-4' },
  md: { switch: 'w-12 h-7', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  lg: { switch: 'w-14 h-8', thumb: 'w-6 h-6', translate: 'translate-x-6' },
};

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className, disabled, id, size = 'md', ...props }, ref) => {
    const toggleId = id || `toggle-${React.useId()}`;
    const sizes = sizeClasses[size];

    return (
      <label
        htmlFor={toggleId}
        className={cn(
          'inline-flex items-center gap-3 cursor-pointer group',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            id={toggleId}
            className="peer sr-only"
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              'min-h-tap flex items-center rounded-full bg-neutral-300 transition-all duration-200',
              'peer-checked:bg-primary-900',
              'peer-focus-visible:ring-4 peer-focus-visible:ring-primary-100',
              'peer-disabled:bg-neutral-200 peer-disabled:cursor-not-allowed',
              !disabled && 'group-hover:bg-neutral-400 peer-checked:group-hover:bg-primary-800',
              sizes.switch
            )}
          >
            <div
              className={cn(
                'bg-white rounded-full shadow-md transition-transform duration-200 ml-1',
                'peer-checked:' + sizes.translate,
                sizes.thumb
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

Toggle.displayName = 'Toggle';
