'use client';

import React, { useEffect, useState } from 'react';

interface SplashLoaderProps {
  onFinish: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    // Start filling the logo after drawing is complete (~2.5s)
    const fillTimer = setTimeout(() => {
      setIsFilled(true);
    }, 2600);

    // Start fading out
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 3300);

    // Call onFinish after fade out
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3800);

    return () => {
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D2B45',
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'auto',
        transition: 'opacity 500ms ease',
      }}
    >
      {/* Keyframe animations — compatible with WKWebView & Android WebView */}
      <style>{`
        @keyframes keel-draw {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes keel-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .keel-path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: keel-draw 2500ms linear 150ms forwards;
        }
        .keel-bar {
          width: 0%;
          animation: keel-bar 2500ms linear 150ms forwards;
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* SVG Logo Animation */}
        <div style={{ width: 160, height: 160 }}>
          <svg
            viewBox="0 0 200 210"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            {/* Faint background trace */}
            <path
              d={PATH_LEFT}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="9"
            />
            <path
              d={PATH_RIGHT}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="9"
            />

            {/* Animated left stroke */}
            <path
              d={PATH_LEFT}
              fill={isFilled ? 'white' : 'transparent'}
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="miter"
              pathLength={1}
              className="keel-path"
              style={{ transition: 'fill 500ms ease' }}
            />

            {/* Animated right stroke */}
            <path
              d={PATH_RIGHT}
              fill={isFilled ? 'white' : 'transparent'}
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="miter"
              pathLength={1}
              className="keel-path"
              style={{ transition: 'fill 500ms ease' }}
            />
          </svg>
        </div>

        {/* Brand Name */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.5px',
              margin: 0,
              fontFamily: 'sans-serif',
            }}
          >
            Keel
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              marginTop: 8,
              fontSize: 14,
              fontFamily: 'sans-serif',
            }}
          >
            The backbone of Care
          </p>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: 192,
            height: 6,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 999,
            overflow: 'hidden',
            marginTop: 32,
          }}
        >
          <div
            className="keel-bar"
            style={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 999,
            }}
          />
        </div>
      </div>
    </div>
  );
};
