/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        card: '#111111',
        'card-foreground': '#ffffff',
        border: '#333333',
        muted: '#222222',
        'muted-foreground': '#888888',
        primary: '#4263eb',
        'primary-light': '#5c7cfa',
        'primary-dark': '#3b5bdb',
        secondary: '#0c8599',
      },
    },
  },
  plugins: [],
} 