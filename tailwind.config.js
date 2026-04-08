/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // ─────────────────────────────────────────────
      // Color Palette (PRD §3.2)
      // ─────────────────────────────────────────────
      colors: {
        primary: {
          DEFAULT: '#4F46E5',   // Slate Blue — calm & technical
          50:  '#EEEEFE',
          100: '#DDDCFD',
          200: '#BDBAFB',
          300: '#9D97F8',
          400: '#7C75F4',
          500: '#4F46E5',       // base
          600: '#3730C1',
          700: '#2A249A',
          800: '#1E1972',
          900: '#120F4B',
        },
        teal: {
          DEFAULT: '#0D9488',   // Teal — alternate primary
          50:  '#E6FBF9',
          100: '#CCF7F4',
          200: '#99EFE8',
          300: '#66E7DD',
          400: '#33DFD1',
          500: '#0D9488',       // base
          600: '#0A7A70',
          700: '#086158',
          800: '#054840',
          900: '#032E28',
        },
        accent: {
          DEFAULT: '#F59E0B',   // Soft Orange — warmth & CTA
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',       // base
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        background: '#F8FAFC', // Off-white — reduced eye strain
        surface: '#FFFFFF',    // Card / panel background
        border: '#E2E8F0',     // Subtle dividers
        text: {
          DEFAULT: '#1E293B',  // Dark Charcoal — high contrast
          muted:   '#64748B',  // Secondary / meta text
          inverted: '#F8FAFC', // Text on dark backgrounds
        },
      },

      // ─────────────────────────────────────────────
      // Typography (PRD §3.3)
      // ─────────────────────────────────────────────
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Cascadia Code"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },

      // ─────────────────────────────────────────────
      // Border Radius — friendly round corners (PRD §3.1)
      // ─────────────────────────────────────────────
      borderRadius: {
        'sm':  '0.375rem',   // 6px
        DEFAULT: '0.5rem',   // 8px
        'md':  '0.75rem',    // 12px  ← card default
        'lg':  '1rem',       // 16px
        'xl':  '1.5rem',     // 24px
        '2xl': '2rem',       // 32px
      },

      // ─────────────────────────────────────────────
      // Box Shadow — depth for cards & panels
      // ─────────────────────────────────────────────
      boxShadow: {
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'nav':        '0 1px 0 0 #E2E8F0',
      },

      // ─────────────────────────────────────────────
      // Spacing — generous whitespace (PRD §3.1)
      // ─────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ─────────────────────────────────────────────
      // Transitions — smooth hover animations (PRD §3.3)
      // ─────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '200ms',
        'fast': '150ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ─────────────────────────────────────────────
      // Typography plugin scale overrides
      // ─────────────────────────────────────────────
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body':         theme('colors.text.DEFAULT'),
            '--tw-prose-headings':     theme('colors.text.DEFAULT'),
            '--tw-prose-links':        theme('colors.primary.DEFAULT'),
            '--tw-prose-bold':         theme('colors.text.DEFAULT'),
            '--tw-prose-counters':     theme('colors.text.muted'),
            '--tw-prose-bullets':      theme('colors.text.muted'),
            '--tw-prose-hr':           theme('colors.border'),
            '--tw-prose-quotes':       theme('colors.text.muted'),
            '--tw-prose-quote-borders': theme('colors.primary.200'),
            '--tw-prose-captions':     theme('colors.text.muted'),
            '--tw-prose-code':         theme('colors.primary.600'),
            '--tw-prose-pre-code':     '#e2e8f0',
            '--tw-prose-pre-bg':       '#0f172a',
            '--tw-prose-th-borders':   theme('colors.border'),
            '--tw-prose-td-borders':   theme('colors.border'),
            maxWidth: 'none',
            a: {
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.primary.600'),
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              },
            },
            'code::before': { content: '""' },
            'code::after':  { content: '""' },
            code: {
              backgroundColor: theme('colors.primary.50'),
              borderRadius: theme('borderRadius.sm'),
              padding: '0.15em 0.4em',
              fontWeight: '500',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
