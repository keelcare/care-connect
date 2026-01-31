import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Primary - Deep Navy Blue (from logo)
        primary: {
          DEFAULT: '#1e3a5f',
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1e3a5f',
          foreground: '#ffffff',
        },

        // Accent - Bright Blue for CTAs
        accent: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          foreground: '#ffffff',
        },

        // Secondary - Clean Grays
        secondary: {
          DEFAULT: '#868e96',
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
      },

      // Typography
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['DM Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
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

      // Border Radius
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
    },
  },
  plugins: [animate],
};

export default config;
