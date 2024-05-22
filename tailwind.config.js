/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        15: '3.75rem' // 60px
      },
      colors: {
        white: 'hsla(0, 0%, 100%, .9);',
        card: 'hsla(0, 0%, 100%, .5);'
      }
    }
  },
  plugins: []
}
