/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d4af37', // Metallic Gold (User's "Primary Accent")
          light: '#f1c40f',   // Bright Gold
          dark: '#aa8c2c',    // Dark Gold
        },
        secondary: {
          DEFAULT: '#c20e0e', // Deep Red (User's "Secondary Accent")
        },
        richblack: '#0a0a0a', // Rich Black text
      },
    },
  },
  plugins: [],
}
