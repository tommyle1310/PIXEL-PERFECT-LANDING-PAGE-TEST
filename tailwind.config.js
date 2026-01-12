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
      'md-3': '769px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontSize: {
        xxs: '12px',
        xs: '13px',
        sm: '14px',
        md: '16px',
        lg: '18px',
      },
      fontFamily: {
        mont: ['Montserrat', 'sans-serif'],
        nunito: ['Nunito'],
        
      }
    },
  },
  plugins: [],
}
