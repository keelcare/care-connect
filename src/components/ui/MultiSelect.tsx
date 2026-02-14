import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectProps {
    label?: string;
    placeholder?: string;
    options: { label: string; value: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export function MultiSelect({
    label,
    placeholder = 'Select options',
    options,
    value,
    onChange,
    error,
    className = '',
    disabled = false,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggleOption = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const removeOption = (e: React.MouseEvent, optionValue: string) => {
        e.stopPropagation();
        onChange(value.filter((v) => v !== optionValue));
    };

    return (
        <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-neutral-700">{label}</label>
            )}
            <div className="relative">
                <div
                    className={`
            w-full min-h-[46px] px-3 py-2 bg-white border rounded-xl text-neutral-900 
            focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 
            transition-all duration-200 cursor-pointer flex items-center justify-between
            ${error ? 'border-red-500' : 'border-neutral-200'}
            ${disabled ? 'bg-neutral-50 cursor-not-allowed' : ''}
          `}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <div className="flex flex-wrap gap-2 mr-2">
                        {value.length > 0 ? (
                            value.map((val) => {
                                const option = options.find((opt) => opt.value === val);
                                return (
                                    <span
                                        key={val}
                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100"
                                    >
                                        {option?.label || val}
                                        <button
                                            type="button"
                                            onClick={(e) => removeOption(e, val)}
                                            className="ml-1 hover:text-primary-900 focus:outline-none"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                );
                            })
                        ) : (
                            <span className="text-neutral-400 py-1">{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown
                        size={16}
                        className={`text-neutral-500 shrink-0 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                            }`}
                    />
                </div>

                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {options.length > 0 ? (
                            <div className="p-1 space-y-0.5">
                                {options.map((option) => {
                                    const isSelected = value.includes(option.value);
                                    return (
                                        <div
                                            key={option.value}
                                            className={`
                        flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors
                        ${isSelected ? 'bg-primary-50 text-primary-900' : 'hover:bg-neutral-50 text-neutral-700'}
                      `}
                                            onClick={() => handleToggleOption(option.value)}
                                        >
                                            <div className={`
                        w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors
                        ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-neutral-300'}
                      `}>
                                                {isSelected && <X size={10} className="text-white" />}
                                            </div>
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-sm text-neutral-500">
                                No options available
                            </div>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
        </div>
    );
}
