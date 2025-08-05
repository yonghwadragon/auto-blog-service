// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* 기본 회색·주색 팔레트 */
        slate: colors.slate,
        emerald: colors.emerald,
        lime: colors.lime,

        /*  shadcn-ui 변형들이 기대하는 CSS-var 기반 색상  */
        /*  ex) bg-accent => hsl(var(--accent))  */
        accent:       'hsl(var(--accent) / <alpha-value>)',
        'accent-foreground':
                      'hsl(var(--accent-foreground) / <alpha-value>)',
        ring:         'hsl(var(--ring) / <alpha-value>)',
        input:        'hsl(var(--input) / <alpha-value>)',
        background:   'hsl(var(--background) / <alpha-value>)',
        foreground:   'hsl(var(--foreground) / <alpha-value>)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // shadcn-ui 애니메이션
  ],
}