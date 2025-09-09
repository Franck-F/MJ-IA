/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-cinzel)', 'serif'],
        sans: ['var(--font-lato)', 'sans-serif'],
        'medieval-heading': ['"Cinzel Decorative"', 'cursive'], // New font
        'medieval-body': ['"Merriweather"', 'serif'], // New font
      },
      colors: {
        'parchment': '#f5e5c7',
        'stone': {
          'light': '#4a5568',
          'DEFAULT': '#2d3748',
          'dark': '#1a202c',
        },
        'dragon-red': '#9b2c2c',
        // New medieval colors
        'wood-dark': '#4a382d',
        'iron-dark': '#2c3e50',
        'iron-light': '#7f8c8d',
        'medieval-red': '#8b0000',
        'medieval-green': '#228b22',
        'gold-accent': '#d4af37',
      },
    },
  },
  plugins: [],
}