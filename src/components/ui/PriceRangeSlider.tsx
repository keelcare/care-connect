'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './PriceRangeSlider.module.css';

export interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (range: [number, number]) => void;
  initialMin?: number;
  initialMax?: number;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step = 1,
  onChange,
  initialMin,
  initialMax,
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
  }, [minValue, maxValue, min, max, getPercent]);

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
    <div className={styles.container}>
      <div className={styles.label}>
        <span>Price Range</span>
        <span>
          ₹{minValue} - ₹{maxValue}/hr
        </span>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.track} />
        <div ref={rangeRef} className={styles.range} />

        {/* Native range inputs for accessibility and interaction */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className={styles.thumb}
          style={{
            left: `${getPercent(minValue)}%`,
            position: 'absolute',
            zIndex: minValue > max - 100 ? 5 : 3,
            width: '20px',
            height: '20px',
            opacity: 0, // Hide default appearance but keep interactive
            cursor: 'pointer',
          }}
          aria-label="Minimum price"
        />
        <div
          className={styles.thumb}
          style={{ left: `${getPercent(minValue)}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className={styles.thumb}
          style={{
            left: `${getPercent(maxValue)}%`,
            position: 'absolute',
            zIndex: 4,
            width: '20px',
            height: '20px',
            opacity: 0,
            cursor: 'pointer',
          }}
          aria-label="Maximum price"
        />
        <div
          className={styles.thumb}
          style={{ left: `${getPercent(maxValue)}%` }}
        />
      </div>

      <div className={styles.inputs}>
        <div className={styles.inputWrapper}>
          <span className={styles.currency}>₹</span>
          <input
            type="number"
            value={minValue}
            onChange={handleMinChange}
            className={styles.numberInput}
            min={min}
            max={maxValue - step}
          />
        </div>
        <div className={styles.inputWrapper}>
          <span className={styles.currency}>₹</span>
          <input
            type="number"
            value={maxValue}
            onChange={handleMaxChange}
            className={styles.numberInput}
            min={minValue + step}
            max={max}
          />
        </div>
      </div>
    </div>
  );
};
