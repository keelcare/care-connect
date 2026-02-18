'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (range: [number, number]) => void;
  initialMin?: number;
  initialMax?: number;
  currency?: string;
  label?: string;
  className?: string;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step = 1,
  onChange,
  initialMin,
  initialMax,
  currency = '₹',
  label = 'Price Range',
  className,
}) => {
  const [minValue, setMinValue] = useState(initialMin || min);
  const [maxValue, setMaxValue] = useState(initialMax || max);
  const rangeRef = useRef<HTMLDivElement>(null);

  // Convert value to percentage
  const getPercent = React.useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = getPercent(minValue);
      const maxPercent = getPercent(maxValue);
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minValue, maxValue, getPercent]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(value);
    onChange([value, maxValue]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(value);
    onChange([minValue, value]);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-semibold text-primary-900">
          {currency}{minValue} - {currency}{maxValue}/hr
        </span>
      </div>

      <div className="relative h-12 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-2 bg-neutral-200 rounded-full" />
        
        {/* Active Range */}
        <div
          ref={rangeRef}
          className="absolute h-2 bg-primary-900 rounded-full"
        />

        {/* Min Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className={cn(
            'absolute w-full h-12 appearance-none bg-transparent pointer-events-none',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-900',
            '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6',
            '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-900',
            '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md'
          )}
          style={{ zIndex: minValue > max - 100 ? 5 : 3 }}
          aria-label="Minimum price"
        />

        {/* Max Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className={cn(
            'absolute w-full h-12 appearance-none bg-transparent pointer-events-none',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-900',
            '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6',
            '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-900',
            '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md'
          )}
          style={{ zIndex: 4 }}
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
};
<<<<<<< HEAD
=======
  
>>>>>>> feat/redesign
