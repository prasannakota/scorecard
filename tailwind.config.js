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
        gray10: '#616161',
        gray50: '#ECF0FF',
        gary70: '#383432',
        gray100: '#ECECEC',
        gary200: '#828282',
        gary300: '#9C9AA5',


        dark100: '#605E5C',

        blue10:  '#465FF166',
        blue50:  '#4285F4',
        blue100: '#96BFFF',
        blue200: '#0D8DFF',
        blue300: '#0B2035',
        blue400: '#092540',
        blue500: '#3B6AFF',

        
        neutral30: '#444748',
        neutral50: '#747878',        
        neutral60: '#8E9192',
        neutral70: '#A9ACAC',
        neutral80: '#C4C7C7',
        neutral90: '#E1E3E3',
        neutral100: '#D4D4D4',

        white05: '#FFFFFF0D',
        white10: '#FFFFFF1C',
        white40: '#FFFFFF75',
        white50: '#F1F1F1',
        white60: '#F6F6F6',
        white100: '#F8F8F8', 
        white90: '#F8FAFA', 
        white100:'#FAF8FF',    
        
        black100: '#131525',      
        black200: '#0A2540',
        black300: '#0D0D0D',
        black400: '#26203B',
        black350: '#2E3132',
        black500: '#0C1E2E',
        black600: '#011917',
        black650: '#01100F',
        black700: '#5C5F5F',

        green100: '#01473D',
        green200: '#12B28C',
        green300: '#22B72C',

        orage100: '#DF9F20',

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
