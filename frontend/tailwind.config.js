import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  plugins: [
    tailwindScrollbar({ nocompatible: true }), //use this on true for compatibility with modern browsers
  ],
};
