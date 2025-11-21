import React from 'react';
import { Search, X } from 'lucide-react';
import { Input, InputProps } from './Input';
import styles from './SearchInput.module.css';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightElement'> {
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
                            className={styles.clearButton}
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    ) : undefined
                }
                value={value}
                onChange={onChange}
                type="text"
                {...props}
            />
        );
    }
);

SearchInput.displayName = 'SearchInput';
