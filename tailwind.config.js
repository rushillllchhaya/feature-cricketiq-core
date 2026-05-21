/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0D1117',
          secondary: '#161B22',
          tertiary: '#21262D',
        },
        accent: {
          teal: '#1D9E75',
        },
      },
      fontFamily: {
        ui: ['Syne', 'sans-serif'],
        ai: ['"Libre Baskerville"', 'serif'],
        stats: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
