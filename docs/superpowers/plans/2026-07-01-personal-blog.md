# Personal Blog Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a personal blog — a `07 / WRITING` landing section (between Experience and Contact) that lists recent posts, plus statically generated `/blog/<slug>/` pages and a `/blog/` index — backed by a Markdown `blog` content collection, in the Concrete Terminal design language, fully `output: 'static'`.

**Architecture:** A `blog` collection (`src/content/blog/*.md`, schema in `src/content.config.ts`) supplies frontmatter + Markdown bodies. `Blog.astro` reads non-draft posts (newest first) and renders `PostCard`s linking to `/blog/<slug>/`; `src/pages/blog/[...slug].astro` uses `getStaticPaths` + `astro:content` `render()` to emit one page per post, and `src/pages/blog/index.astro` lists them all. Post pages reuse `Layout` (head/SEO/CRT/glow) with a subpage-safe `/`-home header (NOT the landing hash `Nav`) and a scoped `.prose-terminal` body layer. Reading time is derived from the body word count. ADR-0011 records the decision.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind v4, TypeScript 6. No new dependencies — reuses `astro:content` (already used by `projects`) and `@astrojs/sitemap`.

## Global Constraints

Values from `SPEC.md`.

- Static Astro only — no SSR/edge adapter, no runtime data fetching, **no new runtime dependency.**
- **Content-decoupled** (CLAUDE.md): all post copy lives in `src/content/blog/*.md`; components render frontmatter/body, never hard-coded prose.
- `draft: true` posts are excluded from the section, the index, and the generated routes (never emitted).
- Reading time is **derived at build time** from the raw body (~200 wpm); no reading-time frontmatter field.
- Post/index pages must be **subpage-nav-safe:** a `/`-home header, never the landing `#anchor` Nav.
- Reuse the section shell (`bt-grain`, `--color-concrete-*`, `--color-accent`, `text-label`, the `data-*-anim` opacity-only GSAP entrance gated by `prefers-reduced-motion`).
- Conventional Commits; **no co-author trailer.** Verify by gates (ADR-0001): `npm run check` 0 + `npm run build` 0 + greps + a manual browser check + Lighthouse on `/`.
- Section numbering: Blog = `07 / WRITING`; Contact renumbers `07` → `08`.

---

### Task 1: Data layer — `blog` collection + seed posts

**Files:** `src/content.config.ts`, `src/content/blog/*.md` (create)

- [ ] **Step 1: Add the `blog` collection to `src/content.config.ts`**

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // card excerpt + meta description
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
```

- [ ] **Step 2: Create two seed posts** in `src/content/blog/` (e.g. `building-a-rag-agent-that-knows-when-it-is-unsure.md`, `forecasting-temperature-across-211-countries.md`) with the full frontmatter and a few sections of real Markdown body (headings, paragraphs, a list, a code block, a link) drawn from the author's project domains. Both `draft: false`.

- [ ] **Step 3: Verify**

Run: `grep -c "blog = defineCollection" src/content.config.ts` → `1`; `grep -c "collections = { projects, blog }" src/content.config.ts` → `1`.
Run: `ls src/content/blog/*.md | wc -l` → `>= 2`.
Run: `npm run check` → `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/blog
git commit -m "feat(content): add the blog collection and seed posts"
```

---

### Task 2: `PostCard` + `Blog` section + wire into the page/nav

**Files:** `src/components/ui/PostCard.astro` (create), `src/components/sections/Blog.astro` (create), `src/pages/index.astro`, `src/components/layout/Nav.astro`, `src/components/sections/Contact.astro`

**Interfaces:** consumes the `blog` collection, `--color-concrete-*`/`--color-accent`, `.bt-grain`, `text-label`. Produces `#writing` + `/blog/<slug>/` links. A shared `readingTime(body)` helper (word count / 200, min 1) lives in `src/data/blog.ts` so the card and the post page agree.

- [ ] **Step 1: Create `src/data/blog.ts`** — a tiny helper module:

```ts
/** Approximate reading time in whole minutes (~200 wpm), min 1. */
export const readingTime = (body = '') =>
  Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 200));

/** Shared date format for post metadata. */
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
```

- [ ] **Step 2: Create `src/components/ui/PostCard.astro`** — props `{ slug, title, description, pubDate, tags, minutes }`; a bordered concrete card linking to `/blog/${slug}/` with a mono date · reading-time line, an uppercase mono title, the description, and tag chips (reusing the ProjectCard chip style). The whole card is a link (or the title is; keep one accessible primary link).

- [ ] **Step 3: Create `src/components/sections/Blog.astro`** — section shell (`id="writing"`, `border-t-2 border-concrete-50 bg-concrete-950`, `.bt-grain`, `relative z-10 mx-auto max-w-5xl px-6 py-24 md:py-28`). Header: `07 / WRITING` accent label, `Writing` h2, one intro line. Read + sort posts:

```astro
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
const recent = posts.slice(0, 4);
```

Render `recent` as a grid of `PostCard`s (compute `minutes={readingTime(post.body)}`), each `data-writing-anim`. If `posts.length === 0`, render a concrete "New notes are in progress" empty state. Add a `View all writing →` link to `/blog/` when `posts.length > recent.length` (and always, if any posts). Append the same opacity-only GSAP entrance `<script>` as `Experience.astro`, scoped to `#writing [data-writing-anim]`.

- [ ] **Step 4: Wire `<Blog />` into `src/pages/index.astro`** — import it and place `<Blog />` between `<Experience />` and `<Contact />`.

- [ ] **Step 5: Add the Nav link** — in `src/components/layout/Nav.astro`, add `{ href: '#writing', label: 'Writing' }` to `links` after the `experience` entry (renders in both desktop + mobile menus; scroll-spy picks it up automatically).

- [ ] **Step 6: Renumber Contact** — in `src/components/sections/Contact.astro`, change `07 / CONTACT` → `08 / CONTACT`.

- [ ] **Step 7: Verify**

Run: `grep -c 'id="writing"' src/components/sections/Blog.astro` → `1`; `grep -c "07 / WRITING" src/components/sections/Blog.astro` → `1`.
Run: `grep -c "Blog" src/pages/index.astro` → `>= 2` (import + element); confirm order Experience → Blog → Contact.
Run: `grep -c "#writing" src/components/layout/Nav.astro` → `1`.
Run: `grep -c "08 / CONTACT" src/components/sections/Contact.astro` → `1`; `grep -c "07 / CONTACT" src/components/sections/Contact.astro` → `0`.
Run: `npm run check` → `0 errors`; `npm run build` → exit 0; `grep -c 'id="writing"' dist/index.html` → `1`.

- [ ] **Step 8: Commit**

```bash
git add src/data/blog.ts src/components/ui/PostCard.astro src/components/sections/Blog.astro src/pages/index.astro src/components/layout/Nav.astro src/components/sections/Contact.astro
git commit -m "feat(ui): add the Writing section listing recent posts"
```

---

### Task 3: Post pages + `/blog/` index + prose styles

**Files:** `src/pages/blog/[...slug].astro` (create), `src/pages/blog/index.astro` (create), `src/layouts/Layout.astro`, `src/styles/global.css`

- [ ] **Step 1: Extend `Layout`** — add an optional `tabTitle?: string` prop, defaulting to `site.tabTitle`, used for the `<title>`. The landing (no prop) is unchanged.

- [ ] **Step 2: Add `.prose-terminal` to `src/styles/global.css`** — a scoped typographic layer for post bodies (headings in the sans display ramp, `--color-concrete-50`; body/`li` in `--color-concrete-300` with relaxed leading; `a` in `--color-accent` underlined; `code`/`pre` in the mono font on `--color-concrete-900` with a `--color-concrete-700` hairline; `blockquote` with an accent left border). No new tokens — reuse the ramp.

- [ ] **Step 3: Create `src/pages/blog/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import { site } from '../../data/site.ts';
import { readingTime, formatDate } from '../../data/blog.ts';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const minutes = readingTime(post.body);
---

<Layout
  title={`${post.data.title} · ${site.name}`}
  description={post.data.description}
  tabTitle={`${post.data.title} · ${site.name}`}
>
  <!-- subpage-safe header: links to `/`, NOT the landing hash Nav -->
  <header class="…fixed top bar…">
    <a href="/">&gt; {site.initials}</a>
    <a href="/blog/">All writing</a>
  </header>
  <main id="main" class="…concrete bg…">
    <article class="mx-auto max-w-3xl px-6 py-28">
      <a href="/blog/">← All writing</a>
      <p class="…mono meta…">{formatDate(post.data.pubDate)} · {minutes} min read</p>
      <h1>{post.data.title}</h1>
      <!-- tag chips -->
      <div class="prose-terminal"><Content /></div>
    </article>
  </main>
</Layout>
```

(Note: with the `glob` loader the per-entry key is `post.id`; use it for both the route `slug` param and links.)

- [ ] **Step 4: Create `src/pages/blog/index.astro`** — same Layout + subpage header; lists ALL non-draft posts (newest first) reusing `PostCard`. Title `Writing · <name>`.

- [ ] **Step 5: Verify**

Run: `npm run check` → `0 errors`; `npm run build` → exit 0.
Run: for each non-draft seed slug, `test -f dist/blog/<slug>/index.html && echo OK`; `test -f dist/blog/index.html && echo OK`.
Run: `grep -c "prose-terminal" src/styles/global.css` → `>= 1`.
Run: `grep -rc "getStaticPaths" src/pages/blog/[...slug].astro` → `1`; `grep -rc "output: 'server'" astro.config*` → `0`.
Run (draft excluded): add a temporary `draft: true` post, build, confirm no `dist/blog/<that-slug>/` is emitted, then remove it.

- [ ] **Step 6: Commit**

```bash
git add src/pages/blog src/layouts/Layout.astro src/styles/global.css
git commit -m "feat(blog): generate static post pages and the writing index"
```

---

### Task 4: ADR-0011 + README row

**Files:** `docs/adr/0011-blog-content-collection-and-static-post-pages.md` (create), `README.md`

- [ ] **Step 1: Create the ADR** — record: a Markdown `blog` content collection + build-time per-post pages (`getStaticPaths`) for a static personal blog; reading time derived from the body; drafts excluded from build; post pages use a subpage-safe header (not the landing hash Nav) and a scoped `.prose-terminal` layer. Status: Accepted. Considered options: this (chosen), landing-only teaser (rejected), external host (rejected), SSR (rejected). Consequences: no new runtime dep; sitemap auto-covers routes; adding a post = dropping a `.md`.

- [ ] **Step 2: Add a README Engineering Decisions row** after the ADR-0007 row, linking `docs/adr/0011-blog-content-collection-and-static-post-pages.md` with a one-line summary; also reflect the blog in any "content" section of the README if present.

- [ ] **Step 3: Verify + commit**

Run: `test -f docs/adr/0011-blog-content-collection-and-static-post-pages.md && echo OK`; `grep -c "0011-blog-content-collection" README.md` → `1`; `npm run build` → exit 0.

```bash
git add docs/adr/0011-blog-content-collection-and-static-post-pages.md README.md
git commit -m "docs: record ADR-0011 for the blog content collection"
```

---

### Task 5: Acceptance verification sweep + push

**Files:** none (verification only), then push.

- [ ] **Step 1: gates** — `npm run check` → `0 errors`; `npm run build` → exit 0.
- [ ] **Step 2: `collection_defined`/`content_decoupled`** — `blog` collection present; no post prose hard-coded in `.astro`.
- [ ] **Step 3: `section_renders`/`post_pages_static`/`reading_time_derived`** — `#writing` in `dist/index.html`; `dist/blog/<slug>/index.html` per non-draft post + `dist/blog/index.html`; a `draft:true` post is absent; "min read" present, no reading-time frontmatter field.
- [ ] **Step 4: `nav_updated`/`contact_renumbered`/`subpage_nav_safe`/`static_preserved`** — Nav has `#writing`; Contact reads `08`; post pages have no `#about`-style Nav; `output: 'static'` unchanged; no new dep in `dependencies`.
- [ ] **Step 5: `seo_per_post`/`a11y_motion`/`adr_recorded`/`lighthouse_budget_met`** — per-post title/description; sitemap includes `/blog/*`; entrance motion opacity-only + reduced-motion-gated; ADR linked; Lighthouse on `/` (a11y ≥0.95, CLS ≤0.1, perf not regressed). Record evidence; note R2.
- [ ] **Step 6: Push** — `git push -u origin claude/personal-blog-section-tf27w1` (retry with backoff on network error).

---

## Self-Review (against SPEC.md)

**Spec coverage:** `build_succeeds`/`typecheck_clean` → every task; `collection_defined`/`content_decoupled` → Task 1 + Task 5; `section_renders` → Task 2; `post_pages_static`/`reading_time_derived` → Tasks 1,3 + Task 5; `nav_updated`/`contact_renumbered` → Task 2; `subpage_nav_safe`/`seo_per_post` → Task 3; `static_preserved`/`a11y_motion` → Tasks 2–3 + Task 5; `adr_recorded` → Task 4; `lighthouse_budget_met` → Task 5. Scope "Does NOT include" (SSR, comments/pagination/RSS/search, external host, other-section copy beyond the Contact renumber, new runtime dep) → respected.

**Placeholder scan:** no TBD/TODO; the collection schema, helper, card, section, post/index pages, prose layer, and ADR are concrete; the README row is described by format + exact link.

**Type/name consistency:** `readingTime`/`formatDate` from `src/data/blog.ts` are used by both the card and the post page; the per-entry key `post.id` is used consistently for `getStaticPaths` params and `/blog/<slug>/` links; `#writing`/`07 / WRITING`/`08 / CONTACT`/`.prose-terminal` are used consistently across Tasks 2–4.
