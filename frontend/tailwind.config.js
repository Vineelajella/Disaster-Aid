/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        'dark-bg': '#111827',
        'dark-card': '#1F2937',
        'dark-text': '#E5E7EB',
        'dark-text-secondary': '#9CA3AF',
        'dark-border': '#374151',
      }
    },
  },
  plugins: [],
}