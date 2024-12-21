/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js}", '*.{html,js}'],
  theme: {
    extend: {
      colors: {
        "text-color": "#0d1117",
        "button-color": "#3fb950",
        "bg-azul": "#2f81f7",
        'bg-default': '#C6E7FF', // cor de fundo do modo claro
        'bg-dark': '#0d1117', // cor de fundo do modo escuro
        'text-light': '#1a202c', // cor do texto no modo claro
        'text-dark': '#ffffff', // cor do texto no modo escuro
      }
    },
  },
  plugins: [],
}

