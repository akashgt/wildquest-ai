/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#06130D',
          900: '#0B2016',
          850: '#0F2A1D',
          800: '#133526',
          700: '#1B4332',
          600: '#2D5A44',
          500: '#407158',
          400: '#5A8A70',
          300: '#7FA892',
          200: '#A9C7B6',
          100: '#D5E5DC',
          50: '#EEF5F1'
        },
        sage: {
          50: '#F4F7F4',
          100: '#EDF4EE',
          200: '#D5E5D8',
          300: '#B2CFB8',
          400: '#8FBC8F',
          500: '#739E82',
          600: '#588066',
          700: '#41634D',
          800: '#2D4736',
          900: '#1C2E23'
        },
        ivory: {
          50: '#FDFBF7',
          100: '#FAF8F5',
          200: '#F4EFE6',
          300: '#EAE1D3',
          400: '#DCCFBD',
          500: '#C7B59F'
        },
        sunlight: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDF0BF',
          300: '#FCE8A6',
          400: '#F4D35E',
          500: '#E9C46A',
          600: '#D4A373',
          700: '#B27D48'
        },
        terracotta: {
          50: '#FDF5F2',
          100: '#FBE8E2',
          200: '#F5BCAB',
          300: '#EA9178',
          400: '#E07A5F',
          500: '#C86D51',
          600: '#A44D35',
          700: '#7D331F'
        }
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(11, 32, 22, 0.05)',
        'soft': '0 4px 20px -2px rgba(11, 32, 22, 0.06), 0 2px 6px -1px rgba(11, 32, 22, 0.04)',
        'soft-md': '0 8px 30px -4px rgba(11, 32, 22, 0.08), 0 4px 10px -2px rgba(11, 32, 22, 0.04)',
        'soft-lg': '0 16px 40px -6px rgba(11, 32, 22, 0.12), 0 8px 16px -4px rgba(11, 32, 22, 0.06)',
        'glow-sun': '0 0 25px -4px rgba(233, 196, 106, 0.35)',
        'glow-forest': '0 0 25px -4px rgba(27, 67, 50, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
