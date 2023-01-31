/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "card-base": "hsl(199, 100%, 12%)",
        "card-grayed": "hsl(221, 37%, 15%)"
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}