/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray10: '#E1E3E3',
        gray50: '#ECF0FF',
        gray100: '#ECECEC',
        gary200: '#828282',
        gary300: '#9C9AA5',
        dark100: '#605E5C',
        blue10: '#465FF166',
        blue50: '#4285F4',
        blue100: '#96BFFF',
        blue200: '#0D8DFF',
        blue300:'#1B2937',

        
        neutral30: '#444748',
        neutral50: '#747878',        
        neutral60:'#8E9192',
        neutral70:'#A9ACAC',
        neutral90: '#E1E3E3',

        white50: '#F1F1F1',
        white100: '#F8F8F8',
        
        black100: '#131525',
        black200: '#0A2540',
        black300: '#0D0D0D',
        black400: '#26203B',
        black350: '#2E3132',
        black500: '#0C1E2E',

        violet100: '#6641D3',
        violet50: '#F5EEFF',
        primary: {
           DEFAULT: '#4D9078',
            50:  '#f1f8f6',
            100: '#d9eee6',
            200: '#b2ddcc',
            300: '#8acdb3',
            400: '#62bd99',
            500: '#4D9078',
            600: '#3e715f',
            700: '#305347',
            800: '#22352f',
            900: '#141717',
          },
        secondary: {
          DEFAULT: '#64748b',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Avenir', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // for tw-animate-css support
  ],
};
