import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ringColor?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      fallback,
      size = 'md',
      ringColor = 'bg-primary/20',
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn('relative inline-block', className)}
        ref={ref}
        {...props}
      >
        {/* Offset Blob/Ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full transform translate-x-1 translate-y-1 -z-10',
            ringColor,
            sizeClasses[size]
          )}
        />

        {/* Image Container */}
        <div
          className={cn(
            'relative rounded-full overflow-hidden border-2 border-white bg-neutral-100 flex items-center justify-center',
            sizeClasses[size]
          )}
        >
          {src ? (
            <Image
              src={src}
              alt={alt || 'Avatar'}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-neutral-500 font-medium text-sm">
              {fallback || alt?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };
