// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // FIXED: Add the typography plugin here to activate markdown list and header styles
  plugins: [
    require('@tailwindcss/typography'),
  ],
}