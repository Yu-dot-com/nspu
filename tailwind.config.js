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
        "bg-color": "#FFFFFF",//background
        "card": "#5AAAC7",
        "bg-button": "#7FC8DF",//searchbar outline/button and sidebar hover
        "text": "#5AAAC7",//sidebar
        "dark": "#FFFFFF",
        "green": "#2288A8",
        "light": "#"
      }
    },
  },
  plugins: [],
}

