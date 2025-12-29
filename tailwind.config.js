/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*/.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens:{
      'md':'768px',
      'sm':'640px',
      'lg':'1024px',
      'xl':'1280px',
      '2xl':'1536px'
},
  },
  plugins: [],
}

