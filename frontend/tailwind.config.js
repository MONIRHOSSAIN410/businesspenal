/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefbfa',
          100: '#d4f5f2',
          200: '#aeeae5',
          300: '#78d9d2',
          400: '#41bfb8',
          500: '#22a39e',
          600: '#178783',
          700: '#166c6a',
          800: '#175655',
          900: '#174847',
          950: '#082928',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        sidebar: {
          DEFAULT: '#1e293b',
          hover: '#27374b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
