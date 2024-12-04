/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#121212',
          800: '#1a1a1a',
          700: '#2d2d2d',
        },
        purple: {
          500: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
};