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
        dark: {
          bg: '#0a0a0a',
          surface: '#151515',
          card: '#1a1a1a',
          border: '#2a2a2a',
          text: '#e5e5e5',
          'text-muted': '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
}

