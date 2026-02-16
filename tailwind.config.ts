import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import containerQueries from '@tailwindcss/container-queries';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Standardized container configuration - 2026 Standard
  // @ts-ignore - Container typing not yet in @types/tailwindcss
  container: {
    center: true,
    padding: {
      DEFAULT: '1rem',
      sm: '2rem',
      lg: '4rem',
      xl: '5rem',
      '2xl': '6rem',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',   // Standard content width
      '2xl': '1440px', // Max for large monitors
    },
  } as any,
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Primary - Deep Forest (Trust)
        primary: {
          DEFAULT: '#1B3022',
          50: '#f2f7f4',
          100: '#e1ebe4',
          200: '#c5d9cd',
          300: '#9ebfad',
          400: '#759f8a',
          500: '#52806a',
          600: '#3d6350',
          700: '#324f41',
          800: '#2a4036',
          900: '#1B3022', // Base
          foreground: '#ffffff',
        },

        // Accent - Warm Cream (Comfort)
        accent: {
          DEFAULT: '#F9F7F2',
          50: '#ffffff',
          100: '#ffffff',
          200: '#F9F7F2', // Base
          300: '#ebe5d5',
          400: '#dbcfb0',
          500: '#c3ae85',
          600: '#a38b5f',
          700: '#826d46',
          800: '#68563b',
          900: '#564733',
          foreground: '#2C3330', // Charcoal Green text for contrast
        },

        // Secondary - Muted Sage (Calm)
        secondary: {
          DEFAULT: '#8DA399',
          foreground: '#ffffff',
        },

        // Muted - Light Gray
        muted: {
          DEFAULT: '#f1f3f5',
          foreground: '#495057',
        },

        // Neutral Grays - Clean & Minimal
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },

        // Semantic Colors
        success: {
          50: '#d1fae5',
          100: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fef3c7',
          100: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fee2e2',
          100: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50: '#dbeafe',
          100: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },

        // Destructive
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },

        // Card
        card: {
          DEFAULT: '#ffffff',
          foreground: '#212529',
        },

        // Popover
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#212529',
        },
        
        // Wellness Theme Tokens (Redesign)
          navy: '#1B3022',    // Deep Forest
          terracotta: '#CC7A68', // Adjusted slightly to harmonize (optional, keeping close) or keep as is? 
                                 // Keeping terracotta but maybe mapping it? 
                                 // Let's stick to the requested main palette.
                                 // User only gave 4 main colors. 
                                 // I will update 'navy' to match Primary as described in 'Old' config it was Brand Blue.
          mustard: '#EEDC82',
          text: '#2C3330',    // Charcoal Green

        childcare: {
          primary: '#1F6F5B',    // Primary Green
          mint: '#E5F1EC',       // Mint Background
          lavender: '#C9C6E5',   // Lavender
          mustard: '#F1B92B',    // Mustard
          coral: '#D85A4F',      // Coral
          teal: '#184C4A',       // Deep Teal
          neutral: '#F4F4F4',    // Neutral Background
          text: '#1F1F1F',
        },
        dashboard: {
          bg: '#F3F2EF',
          accent: {
            start: '#0B0F2A',
            end: '#1A2146',
          },
          sage: '#A9C1B3',
          success: '#6AAE8A',
          card: 'rgba(255, 255, 255, 0.6)',
          text: {
            primary: '#1B1B1B',
            secondary: '#6B7280',
          },
        },
      },

      // Typography
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        heading: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-lora)', 'serif'], // Fixed: Lora is a serif font
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'], // Lora as primary serif
        cormorant: ['var(--font-cormorant)', 'serif'],
      },
      
      // Fluid Typography Scale - 2026 Standard
      fontSize: {
        'fluid-xs': 'var(--text-xs)',
        'fluid-sm': 'var(--text-sm)',
        'fluid-base': 'var(--text-base)',
        'fluid-lg': 'var(--text-lg)',
        'fluid-xl': 'var(--text-xl)',
        'fluid-2xl': 'var(--text-2xl)',
        'fluid-3xl': 'var(--text-3xl)',
        'fluid-4xl': 'var(--text-4xl)',
        'fluid-5xl': 'var(--text-5xl)',
      },

      // Shadows - Clean & Subtle
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(30, 58, 95, 0.05)',
        'sm': '0 1px 3px 0 rgba(30, 58, 95, 0.1), 0 1px 2px -1px rgba(30, 58, 95, 0.1)',
        'md': '0 4px 6px -1px rgba(30, 58, 95, 0.1), 0 2px 4px -2px rgba(30, 58, 95, 0.1)',
        'lg': '0 10px 15px -3px rgba(30, 58, 95, 0.1), 0 4px 6px -4px rgba(30, 58, 95, 0.1)',
        'xl': '0 20px 25px -5px rgba(30, 58, 95, 0.1), 0 8px 10px -6px rgba(30, 58, 95, 0.1)',
        '2xl': '0 25px 50px -12px rgba(30, 58, 95, 0.25)',
        'premium': '0 8px 32px rgba(30, 58, 95, 0.12)',
        'soft': '0 1px 3px 0 rgba(30, 58, 95, 0.1), 0 1px 2px -1px rgba(30, 58, 95, 0.1)',
      },
      
      // Fluid Spacing Scale
      spacing: {
        'fluid-xs': 'var(--space-xs)',
        'fluid-sm': 'var(--space-sm)',
        'fluid-md': 'var(--space-md)',
        'fluid-lg': 'var(--space-lg)',
        'fluid-xl': 'var(--space-xl)',
      },

      // Border Radius - rem-based
      borderRadius: {
        'sm': '0.5rem',   // 8px
        'md': '0.75rem',  // 12px
        'lg': '1rem',     // 16px
        'xl': '1.25rem',  // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.75rem', // 28px
        '4xl': '2rem',    // 32px
      },
      
      // Minimum Heights - Tappable Targets
      minHeight: {
        'tap': '2.75rem',    // 44px - minimum tappable
        'tap-lg': '3rem',    // 48px - comfortable tap
        'button': '2.75rem', // 44px
      },
      
      // Minimum Widths
      minWidth: {
        'tap': '2.75rem',
        'button': '6rem',    // 96px - minimum button width
      },

      // Animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [
    animate,
    containerQueries, // Container queries support - 2026 Standard
  ],
};

export default config;
