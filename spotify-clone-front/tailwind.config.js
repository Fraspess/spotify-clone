/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Spotify Primary Green
        primary: '#1DB954',
        'primary-dark': '#1AA34A',
        'primary-soft': '#1ED760',

        // Backgrounds (Spotify dark theme)
        'bg-main': '#121212',
        'bg-elevated': '#181818',
        'bg-elevated-soft': '#202020',

        // Text
        'text-main': '#FFFFFF',
        'text-muted': '#B3B3B3',

        // Borders / accents
        'border-subtle': '#282828',
        'accent-danger': '#E91429'
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