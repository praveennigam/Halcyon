/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#241f1b',
        paper: '#f6f3ed',
        card: '#fffcf8',
        line: '#e5ddd2',
        mute: '#6e655d',
        pine: {
          DEFAULT: '#1d6b45',
          dark: '#154e33',
          soft: '#e6f3eb',
        },
        clay: '#9c4034',
      },
      fontFamily: {
        sans: ['"Avenir Next"', '"Segoe UI"', 'sans-serif'],
        serif: ['"Iowan Old Style"', 'Palatino', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
