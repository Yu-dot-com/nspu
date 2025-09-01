/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{ts,tsx,html}' ,
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'lgapp': '1000px', // custom breakpoint
      },
      fontFamily: {
        pixel: ['"VT323"', 'monospace'],
      },
      colors: {
        "bg-color": "#FDF7E4",
        "card": "#FAEED1",
        "bg-button": "#DED0B6",
        "text": "#BBAB8C",
        "dark": "#A0937D",
        "green": "#B6C7AA",
        "light": "#FFF9E5"
      }
    },
  },
  plugins: [],
}

