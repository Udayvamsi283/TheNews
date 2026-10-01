/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070D17', // Dark mode background
          900: '#0B1F3A', // Primary Deep Navy
          850: '#0D1726', // Dark mode surface
          800: '#132B4F', // Secondary Navy
          750: '#111E31', // Dark mode card
          700: '#1E293B', // Dark mode border
        },
        editorial: {
          red: '#C2413B',       // Warm Red Accent
          'red-hover': '#A93631', // Warm Red Hover
          'red-dark': '#E0524A',  // Dark Mode Warm Red
        },
        slate: {
          50: '#F8FAFC',  // Light Mode Background
          100: '#F1F5F9',
          200: '#E2E8F0', // Light Mode Border
          500: '#64748B', // Light Secondary Text
          400: '#94A3B8', // Dark Secondary Text
          900: '#0F172A', // Light Primary Text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      screens: {
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
}
