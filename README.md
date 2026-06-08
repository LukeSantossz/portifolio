![Astro](https://img.shields.io/badge/Astro-6.3-BC52EE?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

# Personal Portfolio — AI Engineering for Data, AI & Agribusiness

> A static, offline-first portfolio that frames every project as a business case study — problem → approach → measured result — so a technical recruiter gets the proof in the first scroll (e.g. "3rd of 1,300+ at FETEPS 2025", "~50% faster enterprise automation").

🌐 **Live demo:** [lukesz-portifolio.vercel.app](https://lukesz-portifolio.vercel.app/)

---

## What It Does

A single-page developer vitrine that turns a résumé into an evidence-driven landing page.

- **Case-study project cards** — each project is rendered from a Markdown file as *problem → approach → result*, with the headline metric highlighted.
- **Recruiter "smell test" hero** — role, availability, timezone and the three strongest measurable achievements above the fold.
- **Serverless contact form** — visitors send a message straight from the page, no backend to maintain.
- **Downloadable CV** — résumé served directly for one-click download.

## What It Is

This is a **static web app** that compiles to a fully pre-rendered landing page deployed on Vercel's CDN. It solves a concrete problem for one user — the author — by replacing a flat "list of repos" with a high-signal portfolio that proves capability to technical recruiters, academic peers, and industry stakeholders.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript 5, JavaScript |
| Framework / Runtime | Astro 6 (`output: 'static'`) |
| Styling | Tailwind CSS v4 (via PostCSS) |
| Content layer | Astro Content Collections + typed `src/data/*.ts` |
| Contact integration | Web3Forms (serverless form submission) |
| Hosting / CI | Vercel |

## Architecture

```mermaid
flowchart LR
    subgraph Data ["Decoupled content"]
        MD["src/content/projects/*.md"]
        TS["src/data/*.ts (site, skills, experience)"]
    end
    subgraph Build ["Astro 6 SSG"]
        Pages["index.astro + components"]
        Layout["Layout.astro"]
    end
    MD --> Pages
    TS --> Pages
    Pages --> Layout
    Layout -->|static build| UI["Pre-rendered page (Vercel CDN)"]
    UI -->|POST submission| W3F["Web3Forms API"]
```

Content (projects, skills, experience, identity) is fully decoupled from rendering: components never hold copy. Astro builds everything to static HTML at compile time, and the only runtime call is the client-side `fetch` to Web3Forms when a visitor submits the contact form.

## Engineering Decisions

| Decision | Alternative considered | Why this approach |
| --- | --- | --- |
| Tailwind v4 wired through PostCSS (`postcss.config.mjs`) | Default `@tailwindcss/vite` plugin | Astro 6's Rolldown-based Vite throws `Missing field tsconfigPaths` with the Vite plugin; PostCSS sidesteps the path-resolution bug with no performance cost. |
| Content in Markdown collections + `src/data/*.ts` | Hard-coding copy inside `.astro` components | Updating a project, skill, or metric is a content edit — no HTML/CSS/TS changes — keeping components reusable and maintenance cheap. |
| Serverless contact form (Web3Forms) | A dedicated backend + database for submissions | Keeps the app 100% static for SEO and CDN delivery while still supporting outreach, with zero server to run. |
| Access key via `import.meta.env.PUBLIC_WEB3FORMS_KEY` with a safe fallback | Committing the key inline | Keeps active integration keys out of public Git history. |

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Web3Forms](https://web3forms.com) access key (only for the contact form)

### Installation

```bash
git clone https://github.com/LukeSantossz/portifolio.git
cd portifolio

npm install
cp .env.example .env   # then set PUBLIC_WEB3FORMS_KEY
```

### Running

```bash
npm run dev      # dev server at http://localhost:4321
npm run build    # optimized static bundle in /dist
npm run preview  # serve the production build locally
```

## Project Structure

```
portifolio/
├── src/
│   ├── components/
│   │   ├── sections/      # page sections (Hero, About, Services, Skills, …)
│   │   ├── ui/            # reusable widgets (Icon, SocialLinks, ProjectCard)
│   │   └── layout/        # site chrome (Nav, Footer)
│   ├── content/projects/  # one Markdown file per project (case-study schema)
│   ├── data/              # typed site config, skills, experience
│   ├── layouts/           # base Layout.astro
│   ├── pages/             # index.astro (single entry point)
│   └── styles/            # global.css (Tailwind v4 @theme)
├── public/                # static assets (résumé PDF, favicon, robots.txt)
├── CLAUDE.md              # project memory → .claude/guidelines.md
├── astro.config.mjs       # Astro + sitemap config
└── postcss.config.mjs     # Tailwind v4 via PostCSS
```

## Project Status

**Status: complete — live in production**

### Done

- [x] Static landing page with hero, about, services, experience, skills, projects and contact sections
- [x] Decoupled content architecture (Markdown collections + typed data)
- [x] Serverless contact form via Web3Forms
- [x] Downloadable CV and SEO metadata (sitemap, OG image, robots.txt)
- [x] Deployed to Vercel
- [x] Continuous integration workflow (type-check + build on push/PR)
- [x] Automated Lighthouse / accessibility budget
- [x] Post-deploy smoke test against the live Vercel URL

### Pending

- [ ] Real banner images for the project case studies (currently gradient monograms)
- [ ] Linter / formatter config (Prettier)

## Known Issues & Limitations

- **Single static page** — there is no router or multi-page navigation; everything lives on `index.astro`. Acceptable because the goal is a focused, single-scroll vitrine.
- **Contact key is public by design** — Web3Forms uses a public access key (`PUBLIC_*`), so it ships to the client. This is expected for the service; abuse is mitigated on Web3Forms' side, not in this repo.
- **No automated tests** — a presentational static site has little logic to unit-test; correctness is verified through the build and manual review.

## Contact

Developed by **Lucas Gonçalves**.

- **Email:** [lucassg2015@gmail.com](mailto:lucassg2015@gmail.com)
- **LinkedIn:** [linkedin.com/in/lucas-gonçalvessz](https://www.linkedin.com/in/lucas-gon%C3%A7alvessz/)
- **GitHub:** [github.com/LukeSantossz](https://github.com/LukeSantossz)
