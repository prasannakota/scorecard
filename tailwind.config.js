/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
  ],
  darkMode: 'class', // because you use `.dark` class in CSS
  theme: {
    extend: {
      // You can add custom properties here if needed
    },
  },
  plugins: [
    require('tailwindcss-animate'), // for tw-animate-css support
  ],
};
