// Tailwind CSS v4 via PostCSS.
// Used instead of @tailwindcss/vite because Astro 6 ships a Rolldown-based Vite
// that the Vite plugin doesn't yet support. See withastro/astro#16542.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
