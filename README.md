![Astro](https://img.shields.io/badge/Astro-6.3-BC52EE?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)

# Personal Portfolio, AI Engineer

> A static portfolio built as an editorial index: the work comes second, each project is a numbered row that opens into a full engineering record (problem, constraints, decision, what was rejected, measured result, known limits), and the whole page ships with no external JavaScript file.
>
> **Note:** the identity in `src/data/` and `src/content/projects/` is currently placeholder data while the design is being built. See [SPEC-0001](docs/specs/0001-ai-engineer-editorial-restructure.md).

🌐 **Live demo:** [lukesz-portifolio.vercel.app](https://lukesz-portifolio.vercel.app/)

---

## What It Does

A single-page developer vitrine that turns a résumé into an evidence-driven landing page.

- **A numbered project index** — each row carries the headline metric and its domain so the index scans without opening anything; opening a row reveals the six-move case-study record built from the project's Markdown frontmatter.
- **Recruiter "smell test" hero** — role, availability, timezone, résumé, GitHub and LinkedIn above the fold at every width.
- **Serverless contact form** — visitors send a message straight from the page, no backend to maintain.
- **Downloadable CV** — résumé served directly for one-click download.

## What It Is

This is a **static web app** that compiles to a fully pre-rendered landing page deployed on Vercel's CDN. It solves a concrete problem for one user — the author — by replacing a flat "list of repos" with a high-signal portfolio that proves capability to technical recruiters, academic peers, and industry stakeholders.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript 6, JavaScript |
| Framework / Runtime | Astro 6 (`output: 'static'`) |
| Styling | Tailwind CSS v4 (via PostCSS), Archivo Variable + IBM Plex Mono |
| Content layer | Astro Content Collections + typed `src/data/*.ts` |
| Contact integration | Web3Forms (serverless form submission) |
| Hosting / CI | Vercel |

## Architecture

```mermaid
flowchart LR
    subgraph Data ["Decoupled content"]
        MD["src/content/projects/*.md + blog/*.md"]
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
| Presentation-only verification (build + type-check + Lighthouse + manual) instead of unit TDD | Minimal or full unit-test harness | A static vitrine has no business logic to unit-test; the four gates catch real regressions at lower cost. See [ADR-0001](docs/adr/0001-presentation-only-verification-policy.md). |
| Industrial-brutalist "Concrete Terminal" design language, shipped in phases | Heavier "Blueprint" industrial, quiet brutalist, big-bang redesign | A phased pilot delivers a distinctive recruiter-facing identity at low risk; other sections migrate later. See [ADR-0002](docs/adr/0002-industrial-brutalist-design-language.md). |
| Adaptive mobile experience: mobile-only sticky action bar + divergent feature treatments below `md` | One responsive layout stretched to all widths; a dedicated mobile information architecture | Recruiters mostly arrive on phones and decide in seconds, so mobile gets thumb-zone contact/CV, scannable static skills, a compacted hero, and a hidden decorative map — while desktop is untouched and there is no dual-IA to maintain. See [ADR-0008](docs/adr/0008-adaptive-mobile-experience.md). |
| Defensive hardening: response headers + report-only CSP, env-gated form hCaptcha, SHA-pinned Actions, security.txt | Enforcing CSP immediately; no captcha; major dependency bumps now | Closes real hardening gaps with zero behavior change and zero breakage risk; CSP observes before enforcing, and the captcha is off until configured. See [ADR-0010](docs/adr/0010-security-hardening.md). |
| Landing page as five asymmetric blocks (Hero, Work, Experience, About, Contact), with projects as a numbered index of expanding records | Seven symmetric numbered sections with a project card grid; a sortable project table | The evidence moves to second position, and the record keeps the density a table cell cannot hold. Seven of nine well-regarded engineer portfolios use no card grid; the one that does is the most-cloned template on the web. See [ADR-0014](docs/adr/0014-editorial-index-restructure.md). |
| One CSS + IntersectionObserver reveal for page motion, no animation library | GSAP core with ScrollTrigger (previous approach); GSAP core for the project index only | The disclosure is native `<details>`, which left the library one two-column fade to justify 70 KB. Shipped JS fell from 119,460 bytes across two chunks to ~8 KB inline with no external script file, and the hidden state is one class no inline style can outlive. Supersedes ADR-0003 and ADR-0004. See [ADR-0014](docs/adr/0014-editorial-index-restructure.md). |
| Blue as the single accent, plus a reactive WebGL background field on the hero | Green accent (previous); blue as a second accent beside green; no 3D at all | The cool signal reads as instrumentation rather than agriculture, and one chromatic signal is easier to keep coherent than two. The field is decoration and is recorded as such: three.js loads after `load` inside `requestIdleCallback`, so no external script blocks first paint (measured: LCP 1.7s to 1.8s, TBT 0ms to 60ms, CLS unchanged). See [ADR-0015](docs/adr/0015-blue-accent-and-ambient-field.md). |
| Personal blog as a dedicated `/blog/` area (Markdown collection + build-time per-post pages), linked from the nav after Resume | A section embedded in the landing page; an external host (Medium/Dev.to); SSR post pages | A separate `/blog/` index + `/blog/<slug>/` pages generated statically from `src/content/blog/*.md` — kept off the one-page pitch, content-decoupled, SEO-owned, no new dependency, no SSR; drafts are excluded from the build. See [ADR-0011](docs/adr/0011-blog-content-collection-and-static-post-pages.md). |
| Automatic light/dark theme via `prefers-color-scheme` (same palette, no toggle) | Dark-only; a manual theme toggle with persistence; a duplicate light stylesheet | Flip the Tailwind `@theme` custom properties under a `prefers-color-scheme: light` media query so every utility re-themes with no per-component edits; follows the visitor's system setting. See [ADR-0012](docs/adr/0012-automatic-light-dark-theme.md). |
| Temper above-the-fold visual complexity (fainter grain + softer cursor glow) for the first-impression halo | Remove the CRT/grain entirely; leave the dense hero as-is | Research shows aesthetic first impressions form in ~50 ms and halo onto trust, and low visual complexity maximizes appeal; dial intensity down while keeping the Concrete Terminal + CRT identity. See [ADR-0013](docs/adr/0013-temper-hero-visual-complexity.md). |

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
│   ├── content/blog/      # one Markdown file per blog post (title/date/tags/body)
│   ├── data/              # typed site config, skills, experience
│   ├── layouts/           # base Layout.astro
│   ├── pages/             # index.astro + blog/ (index + [...slug] post pages)
│   └── styles/            # global.css (Tailwind v4 @theme)
├── public/                # static assets (résumé PDF, favicon, robots.txt)
├── docs/adr/              # architecture decision records
├── CLAUDE.md              # project memory and development conventions
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
- **No unit-test harness** — a presentational static site has little logic to unit-test, so correctness is verified by the build, type-check, the Lighthouse budget, and a manual checklist rather than unit tests. This is a documented, scoped deviation from test-first; see [ADR-0001](docs/adr/0001-presentation-only-verification-policy.md).

## Security

- **Response headers** (via `vercel.json`): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and a Content-Security-Policy in **Report-Only** mode (observe-before-enforce).
- **Contact form**: a honeypot plus an optional hCaptcha widget rendered via the own-sitekey integration. Set `PUBLIC_HCAPTCHA_SITEKEY` to your hCaptcha sitekey and also add the matching hCaptcha secret to your Web3Forms dashboard so Web3Forms validates the token. The report-only CSP allows the hCaptcha origins. The public Web3Forms key should also be domain-restricted in the Web3Forms dashboard.
- **Supply chain**: GitHub Actions pinned to commit SHAs; dependencies tracked via Dependabot.
- **Disclosure**: see [`/.well-known/security.txt`](public/.well-known/security.txt).

See [ADR-0010](docs/adr/0010-security-hardening.md) for the rationale.

## Contact

Developed by **Lucas Gonçalves**.

- **Email:** [lucassg2015@gmail.com](mailto:lucassg2015@gmail.com)
- **LinkedIn:** [linkedin.com/in/lucas-gonçalvessz](https://www.linkedin.com/in/lucas-gon%C3%A7alvessz/)
- **GitHub:** [github.com/LukeSantossz](https://github.com/LukeSantossz)
