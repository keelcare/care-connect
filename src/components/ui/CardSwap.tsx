'use client';

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  children: React.ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-0 left-0 w-full h-full border border-white/20 bg-white rounded-2xl will-change-transform backface-hidden shadow-2xl overflow-hidden ${
        customClass ?? ''
      } ${rest.className ?? ''}`.trim()}
    />
  )
);
Card.displayName = 'Card';

// Helper to calculate positions
const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const CardSwap: React.FC<CardSwapProps> = ({
  width = '100%',
  height = '100%',
  cardDistance = 40,
  verticalDistance = 40,
  delay = 4000,
  pauseOnHover = false,
  children,
}) => {
  const container = useRef<HTMLDivElement>(null);
  
  // Convert children to array safely
  const childArr = useMemo(() => Children.toArray(children), [children]);
  
  // Dynamic refs based on children count
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Track order in a ref to persist across renders without triggering them
  const order = useRef<number[]>([]);

  // Initialize order when children change
  useEffect(() => {
    order.current = childArr.map((_, i) => i);
    // Reset refs array size
    refs.current = refs.current.slice(0, childArr.length);
  }, [childArr.length]);

  useGSAP(() => {
    if (childArr.length === 0) return;
    const total = childArr.length;

    // 1. Initial Setup
    refs.current.forEach((el, i) => {
      if (el) {
        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        gsap.set(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          transformOrigin: '50% 50%', 
        });
      }
    });

    // 2. The Swap Animation
    const swap = () => {
      if (order.current.length < 2) return;

      const [frontIndex, ...restIndices] = order.current;
      const frontCard = refs.current[frontIndex];
      
      if (!frontCard) return;

      const tl = gsap.timeline();

      // DYNAMIC DROP: Drop by height + buffer
      const dropDistance = (frontCard.offsetHeight || 300) + 100;

      // Drop front card
      tl.to(frontCard, {
        y: `+=${dropDistance}`,
        duration: 0.8,
        ease: 'power2.in',
        zIndex: 0, // Drop z-index immediately so it passes behind
      });

      // Move others forward
      tl.addLabel('move_others', '-=0.5'); // Overlap slightly
      restIndices.forEach((idx, i) => {
        const el = refs.current[idx];
        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        if (el) {
            tl.to(el, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                zIndex: slot.zIndex,
                duration: 0.6,
                ease: 'power2.out'
            }, 'move_others');
        }
      });

      // Return front card to back
      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      tl.to(frontCard, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        zIndex: backSlot.zIndex,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Update order ref at the very end
      tl.add(() => {
        order.current = [...restIndices, frontIndex];
      });
    };

    // 3. Loop
    let intervalId: NodeJS.Timeout;

    const startInterval = () => {
      clearInterval(intervalId);
      intervalId = setInterval(swap, delay);
    };

    startInterval();

    const onEnter = () => clearInterval(intervalId);
    const onLeave = () => startInterval();

    if (pauseOnHover && container.current) {
        container.current.addEventListener('mouseenter', onEnter);
        container.current.addEventListener('mouseleave', onLeave);
    }
    
    return () => {
        clearInterval(intervalId);
        if (pauseOnHover && container.current) {
            container.current.removeEventListener('mouseenter', onEnter);
            container.current.removeEventListener('mouseleave', onLeave);
        }
    };

  }, { dependencies: [cardDistance, verticalDistance, delay, childArr.length], scope: container });

  return (
    <div 
      ref={container} 
      className="relative perspective-[1000px] w-full h-full flex items-center justify-center p-12"
      style={{ width, height }}
    >
      <div className="relative w-full max-w-sm aspect-[4/5]">
        {childArr.map((child, i) => (
            <div
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                className="absolute top-0 left-0 w-full h-full"
            >
                {child}
            </div>
        ))}
      </div>
    </div>
  );
};

export default CardSwap;
