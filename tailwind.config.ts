import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0f17',
          elev: '#131826',
        },
        border: {
          DEFAULT: '#1f2640',
        },
        text: {
          DEFAULT: '#e7ecf3',
          dim: '#9aa3b8',
          muted: '#6b7488',
        },
        brand: {
          DEFAULT: '#c084fc',
          pink: '#f472b6',
          orange: '#fb923c',
        },
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        doc: '880px',
        site: '1100px',
      },
      animation: {
        'pulse-ring': 'pulseRing 3.5s ease-in-out infinite',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.35' },
          '50%':      { transform: 'scale(1.05)', opacity: '0.15' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
