/** @type {import('tailwindcss').Config} */
export default {
  // Enable dark mode via the 'dark' class on <html>
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── Color Tokens ──────────────────────────────────────────
      // Mapped from CSS custom properties so both Tailwind classes
      // and raw CSS vars work together.
      colors: {
        background:       'var(--background)',
        surface:          'var(--surface)',
        'surface-secondary': 'var(--surface-secondary)',
        border:           'var(--border)',
        'border-strong':  'var(--border-strong)',

        // Semantic text
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':     'var(--text-muted)',

        // Brand
        primary:          'var(--primary)',
        'primary-hover':  'var(--primary-hover)',
        'primary-light':  'var(--primary-light)',

        // Status
        success:          'var(--success)',
        'success-light':  'var(--success-light)',
        warning:          'var(--warning)',
        'warning-light':  'var(--warning-light)',
        danger:           'var(--danger)',
        'danger-light':   'var(--danger-light)',
        neutral:          'var(--neutral)',
      },

      // ─── Typography ────────────────────────────────────────────
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'h1': ['28px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['15px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.5' }],
        'label': ['12px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0.08em' }],
        'code': ['13px', { lineHeight: '1.6' }],
      },

      // ─── Spacing (8px base grid) ────────────────────────────────
      spacing: {
        '4.5': '18px',
        '18':  '72px',
        '22':  '88px',
      },

      // ─── Border Radius ──────────────────────────────────────────
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '24px',
      },

      // ─── Box Shadow (minimal — no heavy shadows) ─────────────────
      boxShadow: {
        'sm':  '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'md':  '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'none': 'none',
      },

      // ─── Animation ──────────────────────────────────────────────
      transitionDuration: {
        '80':  '80ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '220': '220ms',
        '300': '300ms',
        '600': '600ms',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'count-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer:          'shimmer 1.4s infinite linear',
        'count-up':       'count-up 600ms ease-out',
        'slide-in-right': 'slide-in-right 220ms ease-out',
        'fade-up':        'fade-up 150ms ease-out',
      },
    },
  },
  plugins: [],
};
