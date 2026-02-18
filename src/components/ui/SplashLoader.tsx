'use client';

import React, { useEffect, useState } from 'react';

interface SplashLoaderProps {
  onFinish: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    // Start animation shortly after mount
    const startTimer = setTimeout(() => setStartAnimation(true), 100);

    // Start filling the logo after drawing is complete (2.5s + 100ms)
    const fillTimer = setTimeout(() => {
      setIsFilled(true);
    }, 2600);

    // Start fading out after fill is visible for a bit
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 3300);

    // Call onFinish after fade out
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3800);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(fillTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const PATH_LEFT =
    'M 91,20 A 25,25 0 0 0 66,45 L 66,155 L 30,155 A 72,72 0 0 0 91,195 Z';
  const PATH_RIGHT =
    'M 109,20 A 25,25 0 0 1 134,45 L 134,155 L 170,155 A 72,72 0 0 1 109,195 Z';

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-opacity duration-500 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animation Container */}
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 200 210" className="w-full h-full overflow-visible">
            {/* Background Trace (Optional, faint) */}
            <path
              d={PATH_LEFT}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="9"
              className="opacity-30"
            />
            <path
              d={PATH_RIGHT}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="9"
              className="opacity-30"
            />

            {/* The Drawing Logo Left */}
            <path
              d={PATH_LEFT}
              fill={isFilled ? 'white' : 'transparent'}
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="miter"
              pathLength={1}
              className="transition-[stroke-dashoffset,fill] ease-linear"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: startAnimation ? 0 : 1,
                transitionProperty: 'stroke-dashoffset, fill',
                transitionDuration: '2500ms, 500ms',
                transitionDelay: '0ms, 0ms',
              }}
            />

            {/* The Drawing Logo Right */}
            <path
              d={PATH_RIGHT}
              fill={isFilled ? 'white' : 'transparent'}
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="miter"
              pathLength={1}
              className="transition-[stroke-dashoffset,fill] ease-linear"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: startAnimation ? 0 : 1,
                transitionProperty: 'stroke-dashoffset, fill',
                transitionDuration: '2500ms, 500ms',
                transitionDelay: '0ms, 0ms',
              }}
            />
          </svg>
        </div>

        {/* Brand Name */}
        <div className="mt-8 text-center space-y-2">
          <h1 className="text-5xl font-display font-bold text-white tracking-tight">
            Keel
          </h1>
          <p className="text-white font-medium tracking-wide">
            The backbone of Care
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden mt-8">
          <div
            className="h-full rounded-full transition-all ease-linear"
            style={{
              width: startAnimation ? '100%' : '0%',
              backgroundColor: 'white',
              transitionDuration: '2500ms',
            }}
          />
        </div>
      </div>
    </div>
  );
};
