import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge about our custom fluid font-size scale. Without this,
// classes like `text-fluid-sm` are treated as text-color and silently drop a
// co-existing `text-white`/`text-*` color class during merging.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'fluid-xs',
            'fluid-sm',
            'fluid-base',
            'fluid-lg',
            'fluid-xl',
            'fluid-2xl',
            'fluid-3xl',
            'fluid-4xl',
            'fluid-5xl',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
