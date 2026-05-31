/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0c0c10',
          card: '#16161e',
          elevated: '#1e1e28',
        },
        border: {
          subtle: '#252530',
          DEFAULT: '#32323f',
        },
        accent: {
          yellow: '#F5C200',
          'yellow-dim': '#c49b00',
        },
        text: {
          primary: '#f0f0f0',
          secondary: '#9090a8',
          muted: '#555568',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'staff-lines': "repeating-linear-gradient(transparent, transparent 18px, rgba(255,255,255,0.04) 18px, rgba(255,255,255,0.04) 20px)",
      },
    },
  },
  plugins: [],
}
