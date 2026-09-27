/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#F1F3F7',
          100: '#DDE2EB',
          200: '#B8C2D4',
          300: '#8C9BB8',
          400: '#5C6E90',
          500: '#3E4E6D',
          600: '#33415C',
          700: '#26314A',
          800: '#1A2338',
          900: '#10192B',
          950: '#0A0F1C',
        },
        paper: {
          50: '#FBFAF6',
          100: '#F6F4EE',
          200: '#EDEAE1',
          300: '#E1DCCE',
        },
        gold: {
          50: '#FBF3E4',
          100: '#F2DFB6',
          300: '#D8AD5F',
          500: '#B8873A',
          600: '#9C6F2C',
          700: '#7C5722',
        },
        civic: {
          50: '#EAF3EE',
          300: '#7FB89A',
          500: '#2F6B4F',
          600: '#255740',
        },
        signal: {
          50: '#F7EAE7',
          300: '#D08D7C',
          500: '#A63D2F',
          600: '#8A3226',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 25, 43, 0.06), 0 1px 1px rgba(16, 25, 43, 0.04)',
        raised: '0 8px 24px -8px rgba(16, 25, 43, 0.18)',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '10px',
      },
    },
  },
  plugins: [],
}
