/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // "Dạy" PostCSS cách "hiểu" Tailwind v4
    '@tailwindcss/postcss': {}, 
  },
}

export default config