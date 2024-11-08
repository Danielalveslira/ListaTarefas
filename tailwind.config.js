/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", '*.{html,js}'],
  theme: {
    extend: {
      colors: {
        "bg-default": "#0d1117",
        "text-color": "#e6edf3",
        "button-color": "#3fb950",
        "bg-azul": "#2f81f7"
      }
    },
  },
  plugins: [],
}

