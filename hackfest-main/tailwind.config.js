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
          DEFAULT: '#000000', // Premium Black
          dark: '#0f0f0f',    // Rich Black
          light: '#1a1a1a',   // Soft Black
        },
        secondary: {
          DEFAULT: '#d4af37', // Metallic Gold
          light: '#f1c40f',   // Bright Gold
          dark: '#aa8c2c',    // Dark Gold
        },
        accent: '#333333',    // Dark Gray (Borders/Accents)
        text: {
            DEFAULT: '#ffffff',
            muted: '#9ca3af'
        }
      },
    },
  },
  plugins: [],
}
