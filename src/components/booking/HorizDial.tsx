'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface HorizDialProps {
  ticks: Array<{ value: number; label: string; display?: string }>;
  current: number;
  onChange: (index: number) => void;
  accent?: string;
  label: string;
  subLabel?: string;
}

export function HorizDial({ 
  ticks, 
  current, 
  onChange, 
  accent = "#0D2B45", 
  label, 
  subLabel 
}: HorizDialProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const getIndexFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * (ticks.length - 1));
  }, [ticks.length]);

  const onDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = true;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    onChange(getIndexFromX(x));
  }, [getIndexFromX, onChange]);

  const onMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    onChange(getIndexFromX(x));
  }, [getIndexFromX, onChange]);

  const onUp = useCallback(() => { 
    dragging.current = false; 
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => onMove(e);
    const handleUp = () => onUp();
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false } as any);
    window.addEventListener('touchend', handleUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [onMove, onUp]);

  const pct = ticks.length > 1 ? (current / (ticks.length - 1)) * 100 : 0;
  const labelSet = new Set(ticks.filter(t => t.label).map(t => t.value));

  return (
    <div style={{ width: '100%', userSelect: 'none', padding: '4px 0 0' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
        <span style={{ 
          fontSize: '10px', 
          fontFamily: 'Arial,sans-serif', 
          fontWeight: 700, 
          letterSpacing: '1.1px', 
          color: '#7a8a7e', 
          textTransform: 'uppercase' 
        }}>
          {label}
        </span>
        <span style={{ 
          fontSize: '18px', 
          fontWeight: 700, 
          fontFamily: 'Georgia,serif', 
          letterSpacing: '-0.5px',
          color: accent 
        }}>
          {ticks[current]?.display ?? ticks[current]?.label ?? current}
        </span>
      </div>
      
      {subLabel && (
        <div style={{ fontSize: '11px', fontFamily: 'Arial,sans-serif', color: '#aab8b0', marginBottom: '8px' }}>
          {subLabel}
        </div>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          margin: '6px 0 0',
        }}
        onMouseDown={onDown}
        onTouchStart={onDown}
      >
        {/* Background rail */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '4px',
          borderRadius: '4px',
          background: '#e4ddd4',
        }} />

        {/* Filled portion */}
        <div style={{
          position: 'absolute',
          left: 0,
          height: '4px',
          borderRadius: '4px 0 0 4px',
          width: `${pct}%`,
          background: accent,
          pointerEvents: 'none',
        }} />

        {/* Tick marks */}
        {ticks.map((t) => {
          const tp = ticks.length > 1 ? (t.value / (ticks.length - 1)) * 100 : 0;
          const isCurrent = t.value === current;
          const hasLabel = labelSet.has(t.value);
          return (
            <div
              key={t.value}
              style={{
                position: 'absolute',
                width: '2px',
                height: hasLabel ? '10px' : '6px',
                borderRadius: '2px',
                background: t.value <= current ? accent : '#d4cdc4',
                opacity: isCurrent ? 0 : 1,
                transform: 'translateX(-50%) translateY(-50%)',
                top: '50%',
                left: `${tp}%`,
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Handle */}
        <div
          style={{
            position: 'absolute',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: '#fff',
            border: `2.5px solid ${accent}`,
            transform: 'translateX(-50%)',
            left: `${pct}%`,
            cursor: 'grab',
            transition: 'box-shadow 0.15s',
            zIndex: 2,
            boxShadow: `0 2px 10px ${accent}55`,
          }}
        />
      </div>

      {/* Label row below track */}
      <div style={{ position: 'relative', height: '18px', marginTop: '4px' }}>
        {ticks.filter(t => t.label).map((t) => {
          const tp = ticks.length > 1 ? (t.value / (ticks.length - 1)) * 100 : 0;
          return (
            <span
              key={t.value}
              style={{
                position: 'absolute',
                fontSize: '9px',
                fontFamily: 'Arial,sans-serif',
                left: `${tp}%`,
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                color: t.value === current ? accent : '#9aada3',
                fontWeight: t.value === current ? 700 : 400,
                transition: 'color 0.15s, font-weight 0.15s',
              }}
            >
              {t.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
