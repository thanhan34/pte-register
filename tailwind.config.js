/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fc5d01",
        "primary-light": "#fd7f33",
        "primary-lighter": "#ffac7b",
        "primary-lightest": "#fdbc94",
        "primary-bg": "#fedac2",
        "primary-bg-light": "#fff5ef",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
