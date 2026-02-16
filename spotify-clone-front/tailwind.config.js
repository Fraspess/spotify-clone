/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Основна тема: червоний + чорний
        primary: '#E50914', // яскравий червоний
        'primary-dark': '#B20710',
        'primary-soft': '#FF3344',

        // Фони
        'bg-main': '#000000',
        'bg-elevated': '#121212',
        'bg-elevated-soft': '#181818',

        // Текст
        'text-main': '#FFFFFF',
        'text-muted': '#B3B3B3',

        // Акценти / межі
        'border-subtle': '#282828',
        'accent-danger': '#FF4B5C'
      },
      fontFamily: {
        sans: ['system-ui', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1rem'
      },
      boxShadow: {
        'soft-xl': '0 20px 45px rgba(0, 0, 0, 0.7)'
      }
    }
  },
  plugins: []
}


