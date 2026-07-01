# A Markdown blog content collection + build-time per-post pages

The portfolio proves *what* was built and *where* the author has been, but had no place for
long-form prose. The personal blog is a `blog` content collection (`src/content/blog/*.md`,
schema in `src/content.config.ts`) surfaced as a **dedicated, separate area of the site** — a
`/blog/` index plus statically generated `/blog/<slug>/` post pages, emitted at build time via
`getStaticPaths` + `astro:content` `render()`. It is **not** a section of the single-page landing:
the blog is reached from a **`Blog` nav link placed after the `Resume` button** (a separate part
of the portfolio), so the landing stays focused on the pitch. No SSR, no runtime data fetching, no
new dependency — this reuses the same content-collection machinery already used by `projects` and
the existing `@astrojs/sitemap` integration.

## Status

Accepted.

## Considered Options

- **A dedicated `/blog/` area, linked from the nav after `Resume` (chosen)**: keeps the site fully
  static, keeps post copy content-decoupled (per CLAUDE.md), owns the SEO/identity, and adds a post
  by simply dropping a `.md`. The blog reads as a distinct part of the portfolio rather than
  competing for space in the landing pitch. Reading time is derived from the body (~200 wpm) so it
  never drifts; a `draft: true` post is excluded from the index and the built routes.
- **A blog section embedded in the landing page**: rejected — the blog is a separate concern from
  the one-page pitch; it earns its own page and a top-level nav entry rather than a landing slot.
- **Linking out to an external platform (Medium/Dev.to)**: rejected — sends visitors off-site,
  cedes the Concrete Terminal identity and SEO, and adds a third-party dependency for core content.
- **SSR / an edge adapter for posts**: rejected — breaks `output: 'static'`; every post page is
  knowable at build time via `getStaticPaths`.

## Consequences

- Post/index pages reuse the shared `Layout` (head/SEO/CRT/glow) with an added optional `tabTitle`
  prop, plus a subpage-safe header (`SubpageHeader.astro`) that links to `/` — NOT the landing's
  `#section` Nav, whose anchors only resolve on the single landing page.
- Rendered Markdown bodies use a scoped `.prose-terminal` typographic layer built entirely from
  the existing concrete ramp + accent (no new tokens).
- The sitemap integration picks up the new routes automatically; each post page sets its own
  `title`/`description` for canonical/OG. The landing keeps its original section numbering
  (Contact stays `07 / CONTACT`) since the blog no longer occupies a landing slot.
