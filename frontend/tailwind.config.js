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
        primary: {
          DEFAULT: '#0ea5e9', 
          dark: '#0284c7',    
        },
        secondary: '#64748b', 
        clinical: {
          bg: '#f8fafc',     
          blue: '#3b82f6',  
          cyan: '#06b6d4',    
          teal: '#14b8a6',  
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '3xl': '1.5rem', 
      }
    },
  },
  plugins: [],
}