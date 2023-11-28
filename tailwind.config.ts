import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      spacing: {
        '15': '3.99rem',
        '85': '20rem',
        '88': '22rem',
        '92': '23rem',
        '93': '23.5rem',
        '94': '24.5rem',// Add this line
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config

