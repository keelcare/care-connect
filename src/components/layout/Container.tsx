import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva(
  'mx-auto', // Always centered
  {
    variants: {
      maxWidth: {
        default: 'max-w-7xl',      // 1280px - Most pages
        text: 'max-w-4xl',          // 896px - Text-heavy content
        wide: 'max-w-screen-2xl',   // 1536px - Extra wide sections
        narrow: 'max-w-3xl',        // 768px - Forms, modals
        content: 'max-w-5xl',       // 1024px - Medium content
      },
      padding: {
        default: 'px-6',             // 24px - Standard responsive
        none: '',                    // No padding (for full-width)
        sm: 'px-4',                  // 16px - Tighter spacing
        lg: 'px-8',                  // 32px - More breathing room
        responsive: 'px-5 md:px-6',  // Match ParentLayout pattern
      },
    },
    defaultVariants: {
      maxWidth: 'default',
      padding: 'default',
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: 'div' | 'section' | 'article' | 'main';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, padding, as: Comp = 'div', ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(containerVariants({ maxWidth, padding, className }))}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';
