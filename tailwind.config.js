/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "main":{
          "1": "#283149",
          "2":"#404B69",
          "3":"#526D82",
          "4":"#DBEDF3",
          "5":"#3F3B6C",
          "6":"#3795BD",
          "7":"#52AA8A"

        },


      },

      'animation': {
        'gradient-x':'gradient-x 15s ease infinite',
        'gradient-y':'gradient-y 15s ease infinite',
        'gradient-xy':'gradient-xy 30s ease infinite',
      },
      'keyframes': {
        'gradient-y': {
          '0%, 100%': {
            'background-size':'400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size':'200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size':'200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size':'200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size':'400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size':'200% 200%',
            'background-position': 'right center'
          }
        }
      },
    },
  },
  plugins: [],
}

