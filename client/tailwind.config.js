/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turquoise: {
          DEFAULT: '#4cc9b1',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#4cc9b1',
          500: '#2dd4bf',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        parchment: {
          DEFAULT: '#f4f1ec',
          50: '#fbfaf8',
          100: '#f4f1ec',
          200: '#ebe5dc',
          300: '#ded4c6',
        },
        bone: {
          DEFAULT: '#e2dbcb',
          50: '#faf9f6',
          100: '#f0ecdf',
          200: '#e2dbcb',
          300: '#d0c6b0',
          400: '#b8a98e',
        },
      },
    },
  },
  plugins: [],
}
