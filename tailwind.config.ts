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
        // Exact match to the Flutter app's AppTheme so the site and app feel
        // like one product, not two.
        bg: {
          DEFAULT: '#07060F',
          elev:    '#15131F',
          soft:    '#1E1B2D',
        },
        border: {
          DEFAULT: '#2A2640',
          soft:    '#1f1b35',
        },
        text: {
          DEFAULT: '#F9FAFB',
          dim:     '#94A3B8',
          muted:   '#64748B',
        },
        brand: {
          DEFAULT: '#8B5CF6',
          purple:  '#8B5CF6',
          pink:    '#E91E63',
          violet:  '#A78BFA',
        },
        coin: '#FACC15',
        ok:   '#22C55E',
        bad:  '#EF4444',
        warn: '#F59E0B',
        live: '#FF3D71',
      },
      backgroundImage: {
        'brand-grad':
          'linear-gradient(135deg, #8B5CF6 0%, #E91E63 100%)',
        'brand-grad-soft':
          'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(233,30,99,0.18) 100%)',
        'mesh-hero':
          // gradient mesh blob behind the hero
          'radial-gradient(at 20% 10%, rgba(139,92,246,0.45) 0px, transparent 50%), ' +
          'radial-gradient(at 80% 0%,  rgba(233,30,99,0.35) 0px, transparent 50%), ' +
          'radial-gradient(at 50% 90%, rgba(168,85,247,0.25) 0px, transparent 50%)',
        'grid':
          'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), ' +
          'linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      maxWidth: {
        doc:  '880px',
        site: '1240px',
      },
      animation: {
        'pulse-ring': 'pulseRing 3.5s ease-in-out infinite',
        'float':      'float 8s ease-in-out infinite',
        'gradient':   'gradient 8s ease infinite',
        'fade-up':    'fadeUp 0.7s ease-out both',
        'marquee':    'marquee 30s linear infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.35' },
          '50%':      { transform: 'scale(1.05)', opacity: '0.15' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-20px) rotate(2deg)' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%':   { 'background-position': '-1000px 0' },
          '100%': { 'background-position': '1000px 0' },
        },
      },
      boxShadow: {
        'brand': '0 20px 60px -15px rgba(139, 92, 246, 0.45)',
        'pink':  '0 20px 60px -15px rgba(233, 30, 99, 0.45)',
        'card':  '0 8px 32px -8px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
