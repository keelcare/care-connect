import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary-900 text-white shadow-2xl hover:bg-primary-800 hover:shadow-xl',
        primary:
          'bg-primary-900 text-white shadow-2xl hover:bg-primary-800 hover:shadow-xl font-semibold',
        secondary: 
          'bg-secondary text-white shadow-2xl hover:brightness-110 hover:shadow-xl font-semibold',
        accent:
          'bg-accent text-white shadow-2xl hover:bg-accent/90 hover:shadow-xl font-semibold',
        destructive: 
          'bg-error-600 text-white shadow-2xl hover:bg-error-700 hover:shadow-xl',
        outline:
          'border-2 border-primary-900 bg-transparent text-primary-900 hover:bg-primary-900 hover:text-white shadow-md hover:shadow-lg',
        ghost: 
          'text-neutral-700 hover:bg-neutral-100 hover:text-primary-900',
        link: 
          'text-primary-900 underline-offset-4 hover:underline hover:text-accent',
        text: 
          'text-neutral-700 hover:text-primary-900',
        icon: 
          'rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-primary-900',
      },
      size: {
        default: 'min-h-[44px] px-6 py-3 text-base rounded-full',
        sm: 'min-h-[44px] px-4 py-2 text-sm rounded-full',
        md: 'min-h-[44px] px-6 py-3 text-base rounded-full',
        lg: 'min-h-[52px] px-8 py-4 text-lg rounded-full font-semibold',
        icon: 'min-h-[44px] min-w-[44px] rounded-full',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  animated?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading,
      animated = false,
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(buttonVariants({ variant, size, fullWidth, className }));
    
    const buttonContent = isLoading ? (
      <>
        <svg
          className="animate-spin h-4 w-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {children}
      </>
    ) : (
      children
    );

    // Use asChild variant with Slot
    if (asChild) {
      return (
        <Slot
          className={buttonClasses}
          ref={ref}
          {...props}
        >
          {buttonContent}
        </Slot>
      );
    }

    // Use animated variant with Framer Motion
    if (animated) {
      // Filter out props that conflict with Framer Motion's drag/animation handlers
      const {
        onDrag: _onDrag,
        onDragStart: _onDragStart,
        onDragEnd: _onDragEnd,
        onAnimationStart: _onAnimationStart,
        onAnimationEnd: _onAnimationEnd,
        ...safeProps
      } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
      
      return (
        <motion.button
          className={buttonClasses}
          ref={ref}
          disabled={isLoading || props.disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          {...safeProps}
        >
          {buttonContent}
        </motion.button>
      );
    }

    // Default: standard button
    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
