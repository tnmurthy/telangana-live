/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0f0d',
        'dark-bg-secondary': '#0f1a14',
        'telangana-green': '#00a86b',
        'telangana-green-light': '#00c97f',
        'heritage-gold': '#d4a843',
        'heritage-gold-light': '#ebd197',
        'text-muted': '#8ca093',
        'text-secondary': '#a8b7af',
        success: '#22c55e',
        surface: '#15181D',
        'surface-raised': '#1B1F26',
        amber: '#F0B429',
        'amber-text': '#F7CC5F',
        sky: '#38BDF8',
        'sky-text': '#7DD3FC',
        orange: '#F97316',
        'orange-text': '#FDA35C',
        pulsegreen: '#34D399',
        red: '#F87171',
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        sm: '10px',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'card-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        typewriter: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 100%': { 'border-color': 'transparent' },
          '50%': { 'border-color': '#00a86b' },
        },
        'banner-in': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'banner-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        'waveform': {
          '0%, 100%': { height: '4px' },
          '50%': { height: '14px' },
        },
      },
      animation: {
        ticker: 'ticker 40s linear infinite',
        'fade-in': 'fade-in 0.5s ease forwards',
        'slide-in': 'slide-in 0.4s ease forwards',
        'pulse-live': 'pulse-live 1.5s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        'card-shimmer': 'card-shimmer 1.4s ease infinite',
        typewriter: 'typewriter 2s steps(40) forwards',
        blink: 'blink 0.75s step-end infinite',
        'banner-in': 'banner-in 0.4s ease-out forwards',
        'banner-out': 'banner-out 0.4s ease-in forwards',
        waveform: 'waveform 0.5s ease-in-out infinite alternate',
        in: 'fade-in 0.6s ease both',
      },
    },
  },
  plugins: [],
};
