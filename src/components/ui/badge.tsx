import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-900 text-white shadow-sm hover:shadow-md',
        accent:
          'border border-accent/30 bg-accent/10 text-accent shadow-sm hover:bg-accent/20',
        secondary:
          'border-transparent bg-neutral-600 text-white shadow-sm hover:shadow-md',
        destructive:
          'border-transparent bg-error-600 text-white hover:bg-error-700',
        outline: 'text-primary-900 border-2 border-neutral-300 hover:border-primary-900',
        success:
          'border-transparent bg-success-500 text-white shadow-sm hover:shadow-md',
        verified:
          'border border-accent/30 bg-accent/10 text-accent',
        experience:
          'border border-neutral-300 bg-neutral-100 text-neutral-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
