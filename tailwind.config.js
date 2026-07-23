/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FACC15',
          ink: '#0A0A0A',
          paper: '#FFFFFF',
        },
        success: '#16A34A',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        body: ['16px', { lineHeight: '1.6' }],
      },
      animation: {
        'border-beam': 'border-beam 2.5s linear infinite',
        'border-beam-reverse': 'border-beam-reverse 3s linear infinite',
      },
      keyframes: {
        'border-beam': {
          to: { '--angle': '360deg' },
        },
        'border-beam-reverse': {
          to: { '--angle-reverse': '-360deg' },
        },
      },
    },
  },
  plugins: [],
};
