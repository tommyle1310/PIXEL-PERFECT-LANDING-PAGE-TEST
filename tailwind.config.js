/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./**/*.js"
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '679px',
      'md-2': '750px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontSize: {
        xxs: '12px',
        xs: '13px',
        md: '16px'
      },
      fontFamily: {
        mont: ['Montserrat', 'sans-serif'],
        nunito: ['Nunito'],
        
      }
    },
  },
  plugins: [],
}
