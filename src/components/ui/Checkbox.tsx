import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  inputClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, inputClassName, disabled, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${React.useId()}`;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-3 cursor-pointer group',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            id={checkboxId}
            className={cn('peer sr-only', inputClassName)}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              'min-h-tap min-w-tap w-6 h-6 flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white transition-all duration-200',
              'peer-focus-visible:ring-4 peer-focus-visible:ring-primary-100 peer-focus-visible:border-primary-500',
              'peer-checked:bg-primary-900 peer-checked:border-primary-900',
              'peer-disabled:bg-neutral-100 peer-disabled:cursor-not-allowed',
              !disabled && 'group-hover:border-primary-500'
            )}
          >
            <Check
              size={16}
              strokeWidth={3}
              className="text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
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

Checkbox.displayName = 'Checkbox';
