// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Tailwind CSS v4 is wired through PostCSS (postcss.config.mjs) rather than the
// @tailwindcss/vite plugin, for compatibility with Astro 6's Rolldown-based Vite.
// TODO: replace with your production URL once deployed on Vercel.
export default defineConfig({
  site: 'https://your-domain.vercel.app',
  integrations: [sitemap()],
});
