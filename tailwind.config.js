/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'dark': "url('../src/assets/images/dark.jpg')",
      },
      colors:{
        "1": "#283149",
        "2":"#404B69",
        "3":"#00818A",
        "4":"#DBEDF3",

      }
    },
  },
  plugins: [],
}

