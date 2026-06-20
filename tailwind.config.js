/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FDFBF7',
          deep: '#F5F0E8',
        },
        paper: '#F9F6F0',
        card: '#FFFFFF',
        ink: {
          DEFAULT: '#2D2A26',
          muted: '#6B6560',
        },
        walnut: {
          DEFAULT: '#8B6914',
          deep: '#6B4F12',
        },
        sage: {
          DEFAULT: '#9CAF88',
          deep: '#6B8A5E',
        },
        sun: {
          DEFAULT: '#F5C542',
        },
        terracotta: '#D4956A',
        line: '#E5DFD5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'warm': '0 1px 3px rgba(107,79,18,0.06), 0 8px 24px rgba(107,79,18,0.12)',
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}