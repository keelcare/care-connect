import React from 'react';
import { Search, X } from 'lucide-react';
import { Input, InputProps } from './Input';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends Omit<
  InputProps,
  'leftIcon' | 'rightElement'
> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={className}
        leftIcon={<Search size={20} />}
        rightElement={
          value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="min-h-tap min-w-tap flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors rounded-full hover:bg-neutral-50 -mr-1"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          ) : undefined
        }
        value={value}
        onChange={onChange}
        type="search"
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
