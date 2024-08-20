/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      'xs': '460px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'primary': '#4198BD',
        'secondary': '#000000',
        'analogous': '#415ABD',
        'whitesmoke': '#f5f5f5',
        'link': '#0088ff'
      },
      fontFamily: {
        'primary': ['myriad-pro'],
      },
      boxShadow: {
        'default': '0 0px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('daisyui')
  ]
}