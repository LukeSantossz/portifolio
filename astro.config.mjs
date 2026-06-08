// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Tailwind CSS v4 is wired through PostCSS (postcss.config.mjs) rather than the
// @tailwindcss/vite plugin, for compatibility with Astro 6's Rolldown-based Vite.
// `site` is the production URL — required for absolute canonical/OG URLs and the
// generated sitemap.
export default defineConfig({
  site: 'https://lukesz-portifolio.vercel.app/',
  integrations: [sitemap()],
});
