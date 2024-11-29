/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  important: true,
  corePlugins: {
    preflight: false,
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {},
  },
  plugins: [
    //option: { nocompatible: true } <- only use this in modern browsers
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};