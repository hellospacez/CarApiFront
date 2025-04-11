/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'bg-0': 'rgb(202, 216, 228)',
        'bg-1': 'hsl(209, 36%, 86%)',
        'bg-2': 'hsl(224, 44%, 95%)',
        'theme-1': '#ff3e00',
        'theme-2': '#4075a6',
      },
      fontFamily: {
        'body': ['Arial', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        'mono': ['Fira Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
} 