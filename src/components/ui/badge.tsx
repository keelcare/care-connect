import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg',
        secondary:
          'border-transparent bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md hover:shadow-lg',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-2 border-primary',
        success:
          'border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg',
        accent:
          'border-transparent bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md hover:shadow-lg',
        verified:
          'border-transparent bg-sky-100 text-sky-700 hover:bg-sky-100/80',
        experience:
          'border-transparent bg-mint-100 text-mint-700 hover:bg-mint-100/80',
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
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
