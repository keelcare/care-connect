import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const variantClasses = {
  text: 'h-4 w-full rounded-lg',
  title: 'h-6 w-3/5 rounded-lg',
  avatar: 'w-12 h-12 rounded-full',
  circle: 'rounded-full',
  card: 'w-full h-48 rounded-2xl',
  button: 'w-32 min-h-tap rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
        variantClasses[variant],
        className
      )}
      style={style}
      aria-hidden="true"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
