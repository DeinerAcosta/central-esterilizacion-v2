/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Asegura una fuente limpia
      },
      colors: {
        // Colores extraídos de tu diseño
        primary: {
          DEFAULT: '#0ea5e9', // Sky 500
          dark: '#0284c7',    // Sky 600
        },
        secondary: '#64748b', // Slate 500
        clinical: {
          bg: '#f8fafc',      // Fondo muy suave
          blue: '#3b82f6',    // Azul vibrante gráficas
          cyan: '#06b6d4',    // Cyan vibrante gráficas
          teal: '#14b8a6',    // Verde agua
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)', // Sombra difusa estilo dashboard médico
      },
      borderRadius: {
        '3xl': '1.5rem', // Bordes muy redondeados como en la imagen
      }
    },
  },
  plugins: [],
}