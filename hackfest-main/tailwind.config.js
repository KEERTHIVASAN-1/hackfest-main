/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          DEFAULT: '#d4af37', // Metallic Gold
          light: '#f1c40f',   // Bright Gold
          dark: '#aa8c2c',    // Dark Gold
        },
      },
    },
  },
  plugins: [],
}
