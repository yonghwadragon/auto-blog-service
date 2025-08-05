// postcss.config.js
// TailwindCSS v4 + Turbopack PostCSS 설정
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ← 핵심
    autoprefixer: {},
  },
};