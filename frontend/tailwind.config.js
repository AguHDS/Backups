import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  important: true,
  corePlugins: {
    preflight: false,
  },
  /* theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {},
  } */
  plugins: [
    tailwindScrollbar({ nocompatible: true }), //use this on true for compatibility with modern browsers
  ],
};
