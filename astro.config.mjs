// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Tailwind CSS v4 is wired through PostCSS (postcss.config.mjs) rather than the
// @tailwindcss/vite plugin, for compatibility with Astro 6's Rolldown-based Vite.
// `site` is the production URL — required for absolute canonical/OG URLs and the
// generated sitemap.
export default defineConfig({
  // PLACEHOLDER while the identity is fictional; restore the real domain with
  // the rest of the identity data (see docs/specs/0001-...).
  site: 'https://example.com/',
  integrations: [sitemap()],
});
