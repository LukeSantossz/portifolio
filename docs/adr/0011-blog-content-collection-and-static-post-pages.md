# A Markdown blog content collection + build-time per-post pages

The portfolio proves *what* was built and *where* the author has been, but had no place for
long-form prose. The personal blog is a `blog` content collection (`src/content/blog/*.md`,
schema in `src/content.config.ts`) surfaced two ways: a `07 / WRITING` landing section listing
the most recent non-draft posts, and statically generated pages at `/blog/<slug>/` (plus a
`/blog/` index) emitted at build time via `getStaticPaths` + `astro:content` `render()`. No SSR,
no runtime data fetching, no new dependency — this reuses the same content-collection machinery
already used by `projects` and the existing `@astrojs/sitemap` integration.

## Status

Accepted.

## Considered Options

- **Markdown collection + build-time per-post pages (chosen)**: keeps the site fully static, keeps
  post copy content-decoupled (per CLAUDE.md), owns the SEO/identity, and adds a post by simply
  dropping a `.md`. Reading time is derived from the body (~200 wpm) so it never drifts; a
  `draft: true` post is excluded from the section, the index, and the built routes.
- **A landing-only section with no post pages**: rejected — a blog with no readable posts is a
  teaser, and the collection would carry content nothing renders.
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
  `title`/`description` for canonical/OG. Contact renumbered from `07` to `08 / CONTACT`.
