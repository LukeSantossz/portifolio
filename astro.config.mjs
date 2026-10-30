// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Tailwind CSS v4 is wired through the @tailwindcss/vite plugin (Astro 7 / Vite 8).
// `site` is the production URL — required for absolute canonical/OG URLs and the
// generated sitemap.
export default defineConfig({
  site: 'https://lukesz-portifolio.vercel.app/',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
