// tailwind.config.js

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // By defining the colors here with hex codes, you override the
        // default Tailwind palette that uses the oklch() format.
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          900: '#111827',
        },
        blue: {
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
        red: {
          100: '#fee2e2',
          500: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}