import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary, #D4AF37)',
          foreground: 'var(--primary-foreground, #FFFFFF)',
        },
        secondary: {
          DEFAULT: 'var(--secondary, #F4EAD4)',
          foreground: 'var(--secondary-foreground, #2C2A29)',
        },
        accent: {
          DEFAULT: 'var(--accent, #996515)',
          foreground: 'var(--accent-foreground, #FFFFFF)',
        },
        muted: {
          DEFAULT: 'var(--muted, #F5F5F0)',
          foreground: 'var(--muted-foreground, #737373)',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        script: ['var(--font-script)', 'Great Vibes', 'cursive'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
