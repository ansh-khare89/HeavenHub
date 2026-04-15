/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        navy: {
          950: '#050b14',
          900: '#0a1628',
        },
        premium: {
          dark: '#030014',
          panel: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(56, 189, 248, 0.45)',
        'glow-sm': '0 0 40px -16px rgba(56, 189, 248, 0.35)',
        'neon-purple': '0 0 40px -10px rgba(168, 85, 247, 0.5)',
        'neon-cyan': '0 0 40px -10px rgba(34, 211, 238, 0.5)',
      },
      animation: {
        'fade-up': 'hh-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up-delay': 'hh-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both',
        float: 'hh-float 14s ease-in-out infinite',
        aurora: 'hh-aurora 18s ease-in-out infinite',
        shimmer: 'hh-shimmer 2.2s ease-in-out infinite',
        'pulse-dot': 'hh-pulse-dot 2s ease-in-out infinite',
      },
      keyframes: {
        'hh-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'hh-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(2%, -3%) scale(1.03)' },
          '66%': { transform: 'translate(-3%, 2%) scale(0.98)' },
        },
        'hh-aurora': {
          '0%, 100%': { opacity: '0.45', transform: 'translateX(-5%) scale(1)' },
          '50%': { opacity: '0.75', transform: 'translateX(5%) scale(1.05)' },
        },
        'hh-shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'hh-pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.35)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
