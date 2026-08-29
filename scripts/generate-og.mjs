// Generates public/og-image.png (1200x630) — the social-share card.
// Run with `npm run og`. Rendered from an inline SVG via sharp so the asset is
// reproducible and stays on-theme with src/styles/global.css design tokens.
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/og-image.png');

const C = {
  base: '#0e0e0e',
  ink: '#ece9e2',
  muted: '#8f8b82',
  accent: '#5aa9ff',
  accent2: '#8f8b82',
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// PLACEHOLDER IDENTITY: keep these in sync with src/data/site.ts by hand.
// This script is plain .mjs and cannot import the TypeScript config directly.
const name = esc('Alex Morgan');
const role = esc('AI Engineer');
const tagline = esc('Retrieval · Agents · Evaluation · Deployment');
const url = esc('example.com');

// Single quotes inside the family list so they don't collide with the
// double-quoted XML attribute delimiter.
const font = "Archivo, 'DejaVu Sans', 'Liberation Sans', Arial, sans-serif";
const mono = "'DejaVu Sans Mono', 'Liberation Mono', monospace";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="18%" cy="0%" r="80%">
      <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${C.accent}"/>
      <stop offset="100%" stop-color="${C.accent2}"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${C.base}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <text x="1140" y="600" text-anchor="end" font-family="${mono}" font-size="300"
        font-weight="700" fill="${C.ink}" fill-opacity="0.05">AM</text>

  <text x="80" y="150" font-family="${mono}" font-size="30" font-weight="700" fill="${C.accent}">AM</text>

  <text x="78" y="320" font-family="${font}" font-size="92" font-weight="700" fill="${C.ink}">${name}</text>

  <rect x="82" y="356" width="120" height="6" rx="3" fill="url(#rule)"/>

  <text x="80" y="430" font-family="${font}" font-size="44" font-weight="600" fill="${C.accent}">${role}</text>
  <text x="80" y="486" font-family="${font}" font-size="30" fill="${C.muted}">${tagline}</text>

  <text x="80" y="572" font-family="${mono}" font-size="26" fill="${C.muted}">${url}</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`Wrote ${OUT}`);
