# SPEC: feat(blog): a personal "Writing" section backed by a static blog content collection

## Problem

The portfolio proves *what* was built (Case studies) and *where* the author has been (Experience),
but never shows *how they think in prose* — the writing that recruiters and peers use to gauge
communication and depth. There is no place to publish short technical notes, and the single-page
layout has no route surface for long-form content. The site needs a first-class **personal blog**
that stays true to the Concrete Terminal identity and the `output: 'static'` constraint.

## Design Decision

Add a **`blog` content collection** (`src/content/blog/*.md`, Markdown bodies — unlike `projects`,
whose bodies are unused) and surface it two ways:

1. **A "Writing" landing section** (`07 / WRITING`, between Experience and Contact) that lists the
   most recent posts as cards (title, date, reading time, description, tags), each linking to its
   own page, plus a link to the full index. Contact renumbers to `08 / CONTACT`.
2. **Statically generated post pages** at `/blog/<slug>/` and an index at `/blog/` — one HTML file
   per post, emitted at build time via `getStaticPaths` (no SSR). Post pages reuse the shared
   `Layout` (head/SEO/CRT/glow) with a lightweight, subpage-safe header (a `/`-home link, not the
   landing's hash Nav) and render the Markdown body through a scoped **`.prose-terminal`** typographic
   layer.

- **Content is decoupled** (per CLAUDE.md): copy lives in `src/content/blog/*.md`; the schema is
  declared in `src/content.config.ts`. Components render frontmatter + body, never hard-coded copy.
- **Static-site-safe:** the site stays `output: 'static'`; pages come from `getStaticPaths` +
  `astro:content` `render()`. No SSR adapter, no runtime data fetching.
- **Reading time** is derived at build time from the raw body word count (~200 wpm), so it needs no
  extra frontmatter and cannot drift from the content.
- **Drafts:** a `draft: true` post is excluded from the listing, the index, and the generated
  routes (never emitted), so work-in-progress can live on the branch without shipping.
- **A11y + motion:** the section reuses the existing section shell (`bt-grain`, concrete ramp,
  accent label) and the `data-*-anim` GSAP entrance pattern (opacity-only, fail-safe, gated by
  `prefers-reduced-motion`); post pages are plain document flow (no motion dependency to read them).
- **SEO:** each post page passes its own `title`/`description` to `Layout`; `Layout` gains an
  optional `tabTitle` prop (defaulting to `site.tabTitle`) so post tabs read `<Post> · <name>` while
  the landing tab is unchanged. Canonical/OG URLs already derive from `Astro.url` per page, and the
  existing `@astrojs/sitemap` integration picks up the new routes automatically.

This introduces no new runtime dependency; it reuses Astro content collections (already used by
`projects`), the Concrete Terminal tokens, and the sitemap integration. The durable choice
(Markdown collection + build-time per-post pages for a static blog) is recorded in **ADR-0011**.

## Alternatives Considered

- **A landing-only section with no post pages** — rejected: a blog with no readable posts is a
  teaser, not a blog; the collection would carry content nothing renders.
- **Linking out to an external platform (Medium/Dev.to)** — rejected: sends visitors off-site,
  cedes the Concrete Terminal identity and SEO, and adds a third-party dependency for core content.
- **SSR / an edge adapter for posts** — rejected: breaks `output: 'static'`; per-post pages are
  fully knowable at build time via `getStaticPaths`.
- **Reusing the landing hash `Nav` on post pages** — rejected: its `#about`-style anchors resolve
  against the current path and would 404-scroll from `/blog/*`; post pages use a `/`-home header.
- **Reusing `ProjectCard` for posts** — rejected: it is a dense case-study card (metric hero, case
  moves); posts need a lighter title/date/excerpt card, so a dedicated `PostCard` is clearer.
- **A `readingTime`/`wordCount` frontmatter field** — rejected: derivable from the body, so storing
  it invites drift.

## Scope

- Includes:
  - `src/content.config.ts`: add a `blog` collection (glob `**/*.md` under `src/content/blog`) with
    schema `{ title, description, pubDate (coerced date), tags[]?, draft (default false) }`.
  - `src/content/blog/*.md`: two seed posts with realistic frontmatter + Markdown bodies.
  - `src/components/ui/PostCard.astro`: a post summary card (date, reading time, title, description,
    tags) linking to `/blog/<slug>/`.
  - `src/components/sections/Blog.astro`: the `07 / WRITING` section listing recent (non-draft)
    posts, newest first, with a link to `/blog/`; reuses the section shell + entrance-motion pattern.
  - `src/pages/blog/[...slug].astro`: `getStaticPaths` over non-draft posts → one page per post
    (title, date, reading time, tags, rendered body via `.prose-terminal`, a `/`-home header).
  - `src/pages/blog/index.astro`: the full listing of non-draft posts.
  - `src/components/layout/Nav.astro`: add a `Writing` (`#writing`) link (desktop + mobile).
  - `src/components/sections/Contact.astro`: renumber the label `07 / CONTACT` → `08 / CONTACT`.
  - `src/pages/index.astro`: import + render `<Blog />` between `<Experience />` and `<Contact />`.
  - `src/layouts/Layout.astro`: add an optional `tabTitle` prop (default `site.tabTitle`).
  - `src/styles/global.css`: add a scoped `.prose-terminal` typographic layer for post bodies.
  - `docs/adr/0011-...md` + a README Engineering Decisions row.
- Does NOT include:
  - SSR/edge rendering, comments, pagination, tag-filter pages, RSS, or search.
  - Any change to other sections' copy beyond the Contact label renumber.
  - A new runtime dependency or design system; changing the `projects` collection.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit harness,
per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds` / `typecheck_clean`: `npm run build` exit 0; `npm run check` 0 errors.
- `collection_defined` + `content_decoupled`: a `blog` collection exists in `src/content.config.ts`;
  all post copy lives in `src/content/blog/*.md` (no post prose hard-coded in `.astro`).
- `section_renders`: `#writing` renders as `07 / WRITING` between Experience and Contact, listing
  the non-draft posts newest-first with per-post links and a link to `/blog/`.
- `post_pages_static`: `/blog/<slug>/index.html` is emitted for each non-draft post and `/blog/`
  lists them; a `draft: true` post is absent from the section, the index, and `dist/`.
- `reading_time_derived`: each card/post shows a "N min read" derived from the body (no
  reading-time frontmatter field).
- `nav_updated` + `contact_renumbered`: the Nav (desktop + mobile) has a `Writing` → `#writing`
  link; the Contact label reads `08 / CONTACT` and no `07 / CONTACT` remains.
- `subpage_nav_safe`: post/index pages do not render the landing hash `Nav`; their header links to
  `/` (no `#about`-style anchors that would break off the landing).
- `seo_per_post`: each post page passes its own `title`/`description` to `Layout`; the tab title
  differs from the landing default; canonical/OG derive from the page URL; the sitemap includes the
  new routes.
- `static_preserved`: `output: 'static'` unchanged; no SSR adapter or new runtime dependency in
  `package.json` `dependencies`.
- `a11y_motion`: the section is keyboard-reachable, the entrance motion is opacity-only and gated by
  `prefers-reduced-motion`, and post bodies are readable with JS/motion off.
- `adr_recorded`: ADR-0011 exists and is linked from the README.
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes on `/`
  (accessibility ≥0.95, CLS ≤0.1, performance not regressed).

## Reproducibility

- Install: `npm install` (no new deps). Build: `npm run build`; type-check: `npm run check`.
- Post pages: after `npm run build`, `dist/blog/<slug>/index.html` exists for each non-draft post
  and `dist/blog/index.html` lists them; a `draft: true` post produces no file.
- Add a post: drop a `.md` in `src/content/blog/` with the frontmatter fields; it appears in the
  section (if among the most recent) and the index, and gets its own page.
- Static/fallback: load a post page with JS off → the article body reads normally; the landing
  section content is server-rendered and visible without motion.
- Reduced motion: emulate `prefers-reduced-motion: reduce` → the section entrance does not animate.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, Node 22.

## Risks and Assumptions

- Risk: hash `Nav` links break on `/blog/*`. Mitigation: post/index pages use a `/`-home header, not
  the landing Nav (`subpage_nav_safe`).
- Risk: an empty collection (all drafts / none) makes the section look broken. Mitigation: the
  section renders an "in progress" empty state and the seed posts ship non-draft.
- Risk: reading-time heuristic is approximate. Accepted: it is a soft signal (~200 wpm), derived so
  it never drifts from the body; exactness is not a requirement.
- Risk: the new routes add page weight / could regress Lighthouse. Mitigation: static HTML + the
  existing CSS layer, no new JS on post pages; budget re-checked on `/`.
- Invalidation: introducing SSR, an external content host, or hard-coding post copy in components
  invalidates this spec.
