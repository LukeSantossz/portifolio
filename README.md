# Portfolio — Data & AI

Personal portfolio landing page. Built with [Astro](https://astro.build) and
[Tailwind CSS v4](https://tailwindcss.com), deployed on [Vercel](https://vercel.com).

Positioning: **Data / Automation / AI**. Single page, dark-tech design, English.

## Tech stack

- **Astro 6** — static output, fast and SEO-friendly.
- **Tailwind CSS v4** — design tokens live in `src/styles/global.css` (`@theme`).
- **Content Collections** — each project is a Markdown file in `src/content/projects/`.
- **Web3Forms** — contact form that works without a backend.
- **@astrojs/sitemap** — sitemap generated at build time.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # preview the production build
```

## Make it yours (editing checklist)

All content is centralized — you rarely need to touch the components.

1. **`src/data/site.ts`** — name, role, headline, email, GitHub/LinkedIn, SEO. Start here.
2. **`src/content/projects/*.md`** — one file per project. Duplicate an example and
   edit the frontmatter (`title`, `tagline`, `problem`, `approach`, `result`,
   `stack`, `repoUrl`, `demoUrl`, `featured`, `order`).
3. **`src/data/skills.ts`** — skill groups and items.
4. **`src/data/experience.ts`** — work + education timeline.
5. **`src/components/About.astro`** — rewrite the `paragraphs` in your own voice.

### Assets to add (in `public/`)

- `cv.pdf` — your résumé (the Download CV / Resume buttons link to it).
- `og-image.png` — social share image, ideally 1200×630.
- `images/profile.jpg` — your photo. Then swap the placeholder block in
  `About.astro` for an `<img>`.

### Design tokens

Colors and fonts are in `src/styles/global.css` under `@theme`. Change
`--color-accent` to recolor the whole site.

## Contact form (Web3Forms)

1. Get a free access key at <https://web3forms.com> (enter the email that should
   receive messages).
2. Paste it into `web3formsKey` in `src/data/site.ts`.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel — the Astro preset is detected automatically.
3. After deploy, set the real URL in `astro.config.mjs` (`site`) and
   `public/robots.txt`, then redeploy so the sitemap and Open Graph links are correct.
