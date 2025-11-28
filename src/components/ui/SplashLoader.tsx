"use client";

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

        // Start filling the heart after drawing is complete (2.5s + 100ms)
        const fillTimer = setTimeout(() => {
            setIsFilled(true);
        }, 2600);

        // Start fading out after fill is visible for a bit (2.6s + 0.5s fill + 0.2s pause)
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

    // Standard SVG Heart Path
    // Starts at bottom tip (12, 21.35), but for drawing effect we might want to start elsewhere?
    // Actually, let's use a path that starts at the top center dip for a natural drawing motion
    // M12 5 ...
    // But the standard path M12 21.35... draws from bottom.
    // Let's stick to the standard path, it draws from bottom -> left -> top -> center -> right -> bottom.
    const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35";

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#F7F9FC] transition-opacity duration-500 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="relative flex flex-col items-center">

                {/* Animation Container */}
                <div className="relative w-32 h-32">
                    <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                        {/* Background Trace (Optional, faint) */}
                        <path
                            d={HEART_PATH}
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="1"
                            className="opacity-30"
                        />

                        {/* The Drawing Heart */}
                        <path
                            d={HEART_PATH}
                            fill={isFilled ? "#FF6B6B" : "transparent"} // Fill color
                            stroke="#FF6B6B" // Primary color
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            pathLength={1}
                            className="transition-[stroke-dashoffset,fill] ease-linear"
                            style={{
                                strokeDasharray: 1,
                                strokeDashoffset: startAnimation ? 0 : 1,
                                transitionProperty: 'stroke-dashoffset, fill',
                                transitionDuration: '2500ms, 500ms',
                                transitionDelay: '0ms, 0ms' // Fill transition happens when isFilled changes
                            }}
                        />

                        {/* The Pencil */}
                        {/* We use a group with offset-path to follow the line */}
                        <g
                            style={{
                                offsetPath: `path('${HEART_PATH}')`,
                                offsetDistance: startAnimation ? '100%' : '0%',
                                transition: 'offset-distance 2500ms linear',
                                opacity: isFilled ? 0 : 1, // Hide pencil when filled
                                transitionDelay: isFilled ? '0ms' : '0ms',
                                transitionDuration: isFilled ? '200ms' : '2500ms'
                            } as React.CSSProperties}
                        >
                            {/* Pencil Graphic */}
                            {/* Scaled down and positioned so the tip is at (0,0) */}
                            {/* offset-rotate: auto aligns +x to tangent. We rotate the pencil to look natural. */}
                            <g transform="scale(0.15) translate(-2, -22) rotate(0)">
                                <path
                                    fill="#4A5568"
                                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                />
                                {/* Pencil Tip Color */}
                                <path
                                    fill="#FF6B6B"
                                    d="M3 21h3.75L3 17.25z"
                                />
                            </g>
                        </g>
                    </svg>
                </div>

                {/* Brand Name */}
                <div className="mt-4 text-center space-y-2">
                    <h1 className="text-4xl font-display font-bold text-neutral-900 tracking-tight">
                        Care<span className="text-primary">Connect</span>
                    </h1>
                    <p className="text-neutral-500 font-medium">
                        Connecting Families & Caregivers
                    </p>
                </div>

                {/* Loading Bar */}
                <div className="w-48 h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-6">
                    <div
                        className="h-full rounded-full transition-all ease-linear"
                        style={{
                            width: startAnimation ? '100%' : '0%',
                            backgroundColor: '#FF6B6B',
                            transitionDuration: '2500ms'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
