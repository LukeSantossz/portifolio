# Visual Coherence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse four container rails to two, three numbering systems to one, and bring `/404` and the blog chrome into the shipped design language, so the portfolio reads as one site.

**Architecture:** Astro 6 static site, single landing page plus a `/blog` subtree. All styling is Tailwind v4 utility classes in `.astro` files, with shared patterns as plain CSS classes in `src/styles/global.css`. No component framework, no runtime data fetching. Changes are almost entirely class-string edits plus one rewritten page and one extracted CSS class.

**Tech Stack:** Astro `^6.3.7`, Tailwind CSS v4 via PostCSS, TypeScript `^6.0.3`, GSAP `^3.15.0`, Node 22.

**Spec:** `docs/specs/0004-visual-coherence-across-landing-blog-and-404.md`

## Global Constraints

- **No unit test harness.** ADR-0001 sets presentation-only verification: `npm run build` exits 0, `npm run check` reports 0 errors, the `lighthouserc.json` budget passes, and a named manual checklist is satisfied. Do not add a test framework. Each task below therefore verifies with a grep assertion plus the two gates, and with the browser where the change is visual.
- **All output in English:** identifiers, comments, commit text, documentation.
- **Conventional Commits**, imperative subject, lowercase, no trailing period. **Never add co-author or AI-attribution trailers.** The canonical type vocabulary is in `.standards/docs/standards/github.md`.
- **Do not touch** the grain, CRT overlay, cursor glow, palette, light-theme token values, the Skills marquee, the geo map, the projects carousel, the hero intro, or the count-up. All are explicitly out of scope in the spec.
- **Do not add dependencies**, new ADRs, or move away from `output: 'static'`.
- **Do not delete or retire any ADR.** ADR-0002 is amended in place only.
- **Dev server:** `npm run dev -- --host 127.0.0.1 --port 4321`. It falls through to the next free port when 4321 is taken; read the bound port from its output rather than assuming.
- **Section numbering `01 / HELLO` through `07 / CONTACT` must survive.** ADR-0011 requires it. Only the two competing systems are removed.
- **Already done, do not redo.** One item in the spec's Scope is committed ahead of this plan: the durable spec archive at `docs/specs/`, holding `0001` through `0004`, with the root `SPEC.md` and `docs/superpowers/specs/` migrated into it. Task 10 only asserts it. The `.standards` submodule sync and the `design.md` / `AGENTS.md` files themselves are likewise already on the branch; Task 9 edits their contents, it does not create them.

---

### Task 1: Unify the width ramp to two rails

Replaces every `max-w-5xl` with `max-w-6xl` and widens the blog's `SubpageHeader` from `max-w-3xl` to `max-w-6xl`. The post body keeps `max-w-3xl` as the reading rail. This is what fixes the visible step between the blog header wordmark and the page content.

**Files:**
- Modify: `src/components/layout/Nav.astro:25`
- Modify: `src/components/layout/SubpageHeader.astro:12`
- Modify: `src/components/layout/Footer.astro:10`
- Modify: `src/components/sections/Experience.astro:12`
- Modify: `src/components/sections/Contact.astro:65`
- Modify: `src/pages/blog/index.astro:18`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: the two-rail invariant that Task 2 and Task 9 rely on. After this task `max-w-5xl` does not appear in `src/`, and `max-w-3xl` appears exactly once, in `src/pages/blog/[...slug].astro:24`.

- [ ] **Step 1: Confirm the starting inventory**

Run:
```bash
grep -rn "max-w-5xl\|max-w-3xl" src/
```
Expected: exactly 7 lines. Five `max-w-5xl` (Footer:10, Nav:25, Contact:65, Experience:12, blog/index:18) and two `max-w-3xl` (SubpageHeader:12, blog/[...slug]:24). If the count differs, stop and reconcile with the spec before editing.

- [ ] **Step 2: Widen the five `max-w-5xl` rails**

In each of the five files, change `max-w-5xl` to `max-w-6xl`. The surrounding classes are unchanged. For clarity, the five exact strings before and after:

`src/components/layout/Nav.astro:25`
```astro
  <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
```

`src/components/layout/Footer.astro:10`
```astro
    class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row"
```

`src/components/sections/Experience.astro:12`
```astro
  <div class="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-28">
```

`src/components/sections/Contact.astro:65`
```astro
  <div class="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-28">
```

`src/pages/blog/index.astro:18`
```astro
    <div class="mx-auto max-w-6xl px-6 py-20 md:py-28">
```

- [ ] **Step 3: Make the subpage header follow its page's rail**

`SubpageHeader` cannot simply be widened. It sits above `max-w-6xl` content on the blog index and the 404, but above `max-w-3xl` content on a post page, where it currently aligns because both happen to be `max-w-3xl`. Hardcoding it wide would fix the index and break the post, trading one visible step for another.

Give it a rail prop. Replace `src/components/layout/SubpageHeader.astro` in full:

```astro
---
import { site } from '../../data/site.ts';

interface Props {
  // Which content rail this header sits above. The header always spans the same
  // width as the content beneath it, so the wordmark never steps away from the
  // first heading. 'wide' for the blog index and the 404, 'reading' for a post.
  rail?: 'wide' | 'reading';
}

const { rail = 'wide' } = Astro.props;
const railClass = rail === 'reading' ? 'max-w-3xl' : 'max-w-6xl';

// A minimal, subpage-safe header for routes off the single-page landing (e.g.
// /blog/*). The landing Nav uses `#section` anchors that only resolve on `/`,
// so subpages get this instead: a home link + a link to the blog index.
---

<header
  class="sticky top-0 z-40 border-b border-concrete-700 bg-concrete-950/80 backdrop-blur-md"
>
  <nav class={`mx-auto flex h-16 ${railClass} items-center justify-between px-6`}>
    <a
      href="/"
      class="font-mono text-sm font-bold tracking-tight text-concrete-50"
      aria-label={`${site.name}, home`}
    >
      <span class="text-accent">&gt;</span> {site.initials}
    </a>
    <a
      href="/blog/"
      class="font-mono text-xs uppercase tracking-[0.2em] text-concrete-300 transition-colors hover:text-accent"
    >
      Blog
    </a>
  </nav>
</header>
```

- [ ] **Step 4: Pass the reading rail on the post page**

In `src/pages/blog/[...slug].astro`, the header call becomes:

```astro
  <SubpageHeader rail="reading" />
```

`src/pages/blog/index.astro` keeps the bare `<SubpageHeader />`, which defaults to wide. Leave `src/pages/blog/[...slug].astro:24` at `max-w-3xl`: that is the reading rail and is deliberate.

- [ ] **Step 5: Assert the invariant**

Run:
```bash
grep -rn "max-w-5xl" src/; echo "exit=$?"
```
Expected: no output, `exit=1` (grep found nothing).

Run:
```bash
grep -rn "max-w-3xl" src/
```
Expected: exactly two lines: the `railClass` ternary in `SubpageHeader.astro` and the article rail in `src/pages/blog/[...slug].astro:24`.

- [ ] **Step 6: Run the gates**

Run: `npm run check`
Expected: 0 errors. This catches a typo in the new prop type.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 7: Confirm alignment on both blog routes in a browser**

At 1440px wide:
- `/blog`: the `> LG` wordmark and the `BLOG` eyebrow below it share the same left edge. Before this task they differed by roughly 110px.
- A post route: the wordmark and the post title share the same left edge. This must still hold after the change, not only before it.

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/Nav.astro src/components/layout/SubpageHeader.astro src/components/layout/Footer.astro src/components/sections/Experience.astro src/components/sections/Contact.astro src/pages/blog/index.astro "src/pages/blog/[...slug].astro"
git commit -m "refactor(ui): collapse the container ramp to two rails"
```

---

### Task 2: Rebuild the 404 page in the design language

`src/pages/404.astro` predates the brutalist redesign: it uses `rounded-lg`, `font-bold` and `font-semibold` instead of the display ramp, the `canvas` token instead of `concrete-950`, and it renders no header and no footer. It reads as a different website.

**Files:**
- Modify: `src/pages/404.astro` (full rewrite, currently 27 lines)

**Interfaces:**
- Consumes: the `max-w-6xl` rail from Task 1; `SubpageHeader.astro` and `Footer.astro` as they exist.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Replace the file contents**

`src/pages/404.astro` in full:

```astro
---
import Layout from '../layouts/Layout.astro';
import Footer from '../components/layout/Footer.astro';
import SubpageHeader from '../components/layout/SubpageHeader.astro';
import Icon from '../components/ui/Icon.astro';
---

<Layout title="Page not found · 404" description="That page does not exist.">
  <SubpageHeader />
  <main id="main" class="min-h-screen bg-concrete-950 text-concrete-50">
    <div class="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">
        <span class="text-accent">404 / NOT FOUND</span>
      </p>
      <h1
        class="mt-3 font-sans text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-concrete-50 md:text-6xl"
      >
        Page not found
      </h1>
      <p class="mt-5 max-w-2xl font-sans text-base leading-relaxed text-concrete-300 md:text-lg">
        That address does not exist or has moved. The case studies and the contact
        form are both on the home page.
      </p>
      <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <a
          href="/"
          class="inline-flex w-full items-center justify-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-concrete-950 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:w-auto"
        >
          Back to home
          <Icon name="arrow-right" size={18} />
        </a>
        <a
          href="/blog/"
          class="inline-flex w-full items-center justify-center gap-2 border-2 border-concrete-50 bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-concrete-50 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:w-auto"
        >
          Read the blog
        </a>
      </div>
    </div>
  </main>
  <Footer />
</Layout>
```

Note the eyebrow uses `tracking-[0.25em]`, matching the site-wide eyebrow convention, and both buttons pair `hover:-translate-` with `shadow-hard`, which is the rule Task 5 enforces everywhere else.

- [ ] **Step 2: Assert the pre-brutalist residue is gone**

Run:
```bash
grep -n "rounded-\|font-semibold\|text-canvas" src/pages/404.astro; echo "exit=$?"
```
Expected: no output, `exit=1`.

- [ ] **Step 3: Run the gates**

Run: `npm run check`
Expected: 0 errors.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 4: Confirm in a browser**

Open any nonexistent path, for example `/nao-existe`. Expected: dark concrete background, an uppercase black display heading, a green eyebrow, two hard-bordered buttons with the offset shadow, the blog header at the top and the site footer at the bottom.

- [ ] **Step 5: Commit**

```bash
git add src/pages/404.astro
git commit -m "refactor(ui): bring the 404 page into the concrete terminal language"
```

---

### Task 3: Persist the mobile action bar on blog routes

`MobileActionBar` renders only on the landing page. On a phone, opening an article makes the email, CV, and LinkedIn shortcuts disappear. That is a functional loss, not a stylistic one.

**Files:**
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[...slug].astro`

**Interfaces:**
- Consumes: `src/components/layout/MobileActionBar.astro`, already used by `src/pages/index.astro:29`.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Read the reference wiring**

`src/pages/index.astro:26-29` is the pattern to copy, including the clearance spacer that stops the fixed bar from covering the footer:

```astro
  <Footer />
  <!-- Bottom clearance so the fixed mobile action bar never overlaps the footer. -->
  <div aria-hidden="true" class="md:hidden" style="height: calc(4rem + env(safe-area-inset-bottom));"></div>
  <MobileActionBar />
```

- [ ] **Step 2: Wire it into the blog index**

In `src/pages/blog/index.astro`, add the import alongside the existing ones:

```astro
import MobileActionBar from '../../components/layout/MobileActionBar.astro';
```

and replace the closing `<Footer />` line with:

```astro
  <Footer />
  <!-- Bottom clearance so the fixed mobile action bar never overlaps the footer. -->
  <div aria-hidden="true" class="md:hidden" style="height: calc(4rem + env(safe-area-inset-bottom));"></div>
  <MobileActionBar />
```

- [ ] **Step 3: Wire it into the post page**

Apply the identical change to `src/pages/blog/[...slug].astro`: add

```astro
import MobileActionBar from '../../components/layout/MobileActionBar.astro';
```

and replace its closing `<Footer />` line with the same four lines from Step 2.

- [ ] **Step 4: Assert both routes carry it**

Run:
```bash
grep -rln "MobileActionBar" src/pages/
```
Expected: exactly three files, `src/pages/index.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`.

- [ ] **Step 5: Run the gates**

Run: `npm run check`
Expected: 0 errors.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Confirm in a browser at 390px**

Resize to 390px wide. On `/blog` and on one article, the three-up action bar must be pinned to the bottom, and scrolling to the very bottom must not have it covering the footer text.

- [ ] **Step 7: Commit**

```bash
git add src/pages/blog/index.astro "src/pages/blog/[...slug].astro"
git commit -m "fix(ui): keep the mobile action bar on blog routes"
```

---

### Task 4: Collapse to one numbering system and align the services label

Three numbering systems compete today: the section eyebrows (`01 / HELLO` to `07 / CONTACT`), the ordinals inside Services list items, and the `PROJECT 01` prefix on project cards. ADR-0011 requires the section eyebrows to survive, so the other two go. The Services heading also disagrees with its nav link.

**Files:**
- Modify: `src/components/sections/Services.astro:14-15`, `:30-41`
- Modify: `src/components/layout/Nav.astro:7`
- Modify: `src/components/ui/ProjectCard.astro:21`, `:41`, `:55-73`
- Modify: `src/components/sections/Projects.astro:58-63`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `ProjectCard.astro` no longer accepts an `index` prop. Task 5 edits the same `<article>` element in that file and must not reintroduce it.

- [ ] **Step 1: Replace the Services ordinal with a non-numeric marker**

The list keeps its two-column grid and its hover behavior; only the numeral changes to the `//` marker already used as a divider across the site. In `src/components/sections/Services.astro`, replace lines 36-41:

```astro
            <span
              aria-hidden="true"
              class="font-mono text-3xl font-bold leading-none text-concrete-300 transition-colors group-hover:text-accent md:text-5xl"
            >
              //
            </span>
```

- [ ] **Step 2: Make the services label agree with the nav**

In `src/components/sections/Services.astro:15`, the eyebrow becomes:

```astro
        <span class="text-accent">03 / WHAT I BUILD</span>
```

In `src/components/layout/Nav.astro:7`, the link label becomes:

```astro
  { href: '#services', label: 'What I build' },
```

The `links` array feeds both the desktop list and the mobile menu, so this single edit covers both. The `<h2>` already reads "What I build" and is unchanged.

- [ ] **Step 3: Drop the `PROJECT NN` prefix**

In `src/components/ui/ProjectCard.astro`, replace the classification header at lines 55-73 with:

```astro
<article
  class="flex h-full flex-col border-2 border-concrete-50 bg-concrete-950 p-6 text-concrete-50 md:p-8"
>
  <!-- Classification header: domain and period only; the section eyebrow carries
       the page's single numbering system. -->
  <p class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label uppercase tracking-[0.2em] text-concrete-300">
    {domain && <span class="text-accent">{domain}</span>}
    {domain && period && <span aria-hidden="true" class="text-concrete-700">//</span>}
    {period && <span>{period}</span>}
  </p>
```

The separator is now conditional on both values existing, so a card with only one of them renders no stray `//`.

- [ ] **Step 4: Remove the now-unused `index` prop**

In `src/components/ui/ProjectCard.astro`, delete line 21 from the `Props` interface:

```
  index?: number;
```

and delete line 41 from the destructuring block:

```
  index = 0,
```

- [ ] **Step 5: Stop passing `index` from the parent**

In `src/components/sections/Projects.astro`, replace lines 58-63:

```astro
        projects.map((project) => (
          <div
            class="w-[86vw] max-w-2xl shrink-0 snap-center md:w-full md:max-w-none"
            data-project-panel
          >
            <ProjectCard {...project.data} />
          </div>
        ))
```

The map parameter drops `i` because nothing uses it now.

- [ ] **Step 6: Assert the competing systems are gone**

Run:
```bash
grep -rn "PROJECT {String\|padStart" src/components/; echo "exit=$?"
```
Expected: no output, `exit=1`. Both ordinal generators used `padStart`, so this catches either surviving.

Run:
```bash
grep -rn "07 / CONTACT\|01 / HELLO" src/components/sections/
```
Expected: two lines. The section numbering ADR-0011 protects is intact.

- [ ] **Step 7: Run the gates**

Run: `npm run check`
Expected: 0 errors. This is the step that catches a missed `index` reference, since `astro check` type-checks the props.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 8: Confirm in a browser**

At 1440px: the Services list shows `//` markers instead of `01`-`04`, the nav link and the heading both say "What I build", and project cards open with the domain rather than `PROJECT 01`. The section eyebrows still count `01` through `07`.

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/Services.astro src/components/layout/Nav.astro src/components/ui/ProjectCard.astro src/components/sections/Projects.astro
git commit -m "refactor(ui): keep one numbering system and align the services label"
```

---

### Task 5: Extract the shared card surface and pair translate with shadow

`ProjectCard.astro` and `PostCard.astro` repeat the same surface string. Separately, `hover:-translate-` appears eight times but only four carry `shadow-hard`, so the same gesture reads differently depending on where it is.

**Files:**
- Modify: `src/styles/global.css` (append a class near the other component classes)
- Modify: `src/components/ui/ProjectCard.astro:55-57`, `:118`, `:132`
- Modify: `src/components/ui/PostCard.astro:17-19`

**Interfaces:**
- Consumes: the `<article>` element shape left by Task 4 in `ProjectCard.astro`, which no longer accepts `index`.
- Produces: the `.surface-card` class, referenced by `design.md` in Task 9.

- [ ] **Step 1: Add the shared surface class**

Append to `src/styles/global.css`, after the `.prose-terminal` block:

```css
/* ----------------------------------------------------------------------------
   Shared card surface — the hard-bordered concrete panel behind both the
   project case-study cards and the blog post cards. Extracted so the two
   cannot drift apart: they were identical class strings maintained by hand.
---------------------------------------------------------------------------- */
.surface-card {
  display: flex;
  height: 100%;
  flex-direction: column;
  border: 2px solid var(--color-concrete-50);
  background-color: var(--color-concrete-950);
  color: var(--color-concrete-50);
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .surface-card {
    padding: 2rem;
  }
}
```

- [ ] **Step 2: Apply it in `ProjectCard.astro`**

Replace the opening `<article>` tag (lines 55-57 as left by Task 4):

```astro
<article class="surface-card">
```

- [ ] **Step 3: Apply it in `PostCard.astro`**

Replace the opening `<article>` tag at lines 17-19:

```astro
<article
  class="surface-card group relative shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
>
```

This both adopts the shared surface and adds the missing `shadow-hard`, so the card's hover lift now matches the hero and contact buttons.

- [ ] **Step 4: Pair the two ProjectCard link buttons with the shadow**

In `src/components/ui/ProjectCard.astro`, both the Repo and Demo anchors carry the translate without the shadow. Add `shadow-hard` to each. The Repo anchor class becomes:

```astro
            class="inline-flex items-center gap-2 border-2 border-concrete-50 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-concrete-50 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
```

The Demo anchor takes the identical class string.

- [ ] **Step 5: Assert the pairing rule holds**

Run:
```bash
grep -rn "hover:-translate" src/ | grep -v "shadow-hard"; echo "exit=$?"
```
Expected: no output, `exit=1`. Every remaining translate sits on an element that also carries `shadow-hard`.

Run:
```bash
grep -rc "border-2 border-concrete-50 bg-concrete-950 p-6" src/components/ui/
```
Expected: 0 for both card files. The duplicated surface string is gone.

- [ ] **Step 6: Run the gates**

Run: `npm run check`
Expected: 0 errors.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 7: Confirm in a browser**

At 1440px, compare a project card and a post card side by side across the two routes: identical border weight, padding, and background. On `/blog`, hovering a post card now lifts it against a visible offset shadow rather than sliding with nothing behind it.

- [ ] **Step 8: Commit**

```bash
git add src/styles/global.css src/components/ui/ProjectCard.astro src/components/ui/PostCard.astro
git commit -m "refactor(ui): share the card surface and pair translate with shadow"
```

---

### Task 6: Put the outlying weights and the dashed border on the ramp

Three small divergences: rendered Markdown headings sit at weight 800 while every display heading is 900, one Experience heading is `font-semibold`, and a single `border-dashed` exists in the whole source tree.

**Files:**
- Modify: `src/styles/global.css:403` (the `.prose-terminal h2, h3` rule)
- Modify: `src/components/sections/Experience.astro:48`
- Modify: `src/pages/blog/index.astro:51`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Move the prose headings to the display weight**

In `src/styles/global.css`, inside the `.prose-terminal h2, .prose-terminal h3` rule, change:

```css
  font-weight: 900;
```

- [ ] **Step 2: Move the Experience heading onto the ramp**

`src/components/sections/Experience.astro:48`:

```astro
            <h3 class="mt-2 font-sans text-lg font-bold text-concrete-50">
```

- [ ] **Step 3: Replace the dashed empty state**

`src/pages/blog/index.astro:51`:

```astro
          <div class="border-2 border-concrete-700 p-10 text-center">
```

- [ ] **Step 4: Assert**

Run:
```bash
grep -rn "border-dashed\|font-semibold" src/; echo "exit=$?"
```
Expected: no output, `exit=1`.

Run:
```bash
grep -n "font-weight: 800" src/styles/global.css; echo "exit=$?"
```
Expected: no output, `exit=1`.

- [ ] **Step 5: Run the gates**

Run: `npm run check`
Expected: 0 errors.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Confirm in a browser**

Open one article. Its `##` headings should now carry the same weight as the post title above them.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/components/sections/Experience.astro src/pages/blog/index.astro
git commit -m "style(ui): put the outlying weights and border on the ramp"
```

---

### Task 7: Remove prohibited dashes from public copy

`AGENTS.md` bans em and en dashes in public copy. Seventeen occurrences remain across six files, in two forms: the literal character and the `&mdash;` HTML entity. Code comments are deliberately out of scope.

**Files:**
- Modify: `src/components/sections/Contact.astro:82`, `:180`
- Modify: `src/pages/blog/index.astro:29`
- Modify: `src/components/ui/ProjectCard.astro` (the two `aria-label` template literals)
- Modify: `src/data/experience.ts:23`, `:24`
- Modify: `src/content/blog/a-rag-agent-that-knows-when-it-is-unsure.md` (7 occurrences)
- Modify: `src/content/blog/forecasting-temperature-across-211-countries.md` (4 occurrences)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Fix the two Contact entities**

`src/components/sections/Contact.astro:82` becomes:

```astro
          you&apos;re hiring for, send the form. It&apos;s the surest way to
```

`src/components/sections/Contact.astro:180` becomes:

```astro
      <span class="text-accent">Currently</span> · {site.availability}
```

The middle dot is already the site's inline separator, used in `Experience.astro:50`.

- [ ] **Step 2: Fix the blog index intro**

`src/pages/blog/index.astro:29-30` becomes:

```astro
          Short notes on the problems behind the projects: retrieval, forecasting, and the
          engineering calls that don&apos;t fit on a résumé.
```

- [ ] **Step 3: Fix the two aria-labels**

In `src/components/ui/ProjectCard.astro`, the two labels become:

```astro
            aria-label={`${title}: source on GitHub`}
```

```astro
            aria-label={`${title}: live demo`}
```

These are read aloud by screen readers, which is why they count as public copy.

- [ ] **Step 4: Fix the two experience highlights**

`src/data/experience.ts:23`, replace the dash before "paired" with a comma:

```
... and recognizes the part, paired with an in-app camera that locks file names and stamps time and location so the evidence holds up.',
```

`src/data/experience.ts:24`, replace the dash before "moving" with a comma:

```
... validating rule changes across testing rounds, moving the workflow from manual entry to mostly review.',
```

- [ ] **Step 5: Fix `a-rag-agent-that-knows-when-it-is-unsure.md`**

Seven lines, including the frontmatter `description`, which is public copy because it renders on the post card and as the page meta description. Each replacement is chosen for the sentence, not applied mechanically.

Line 3:
```
description: Retrieval-augmented generation is easy to demo and hard to trust. Here is how I made a question-answering agent score its own confidence, and stay quiet when the context does not support an answer.
```

Line 15:
```
inverted from the start: a wrong answer costs more than a missing one. So the
```

Line 25:
```
- **Retrieval agreement**: how tightly the top-k chunks cluster in embedding
```

Line 28:
```
- **Answer groundedness**: whether each claim in the draft answer can be traced
```

Line 30:
```
- **Margin**: the gap between the best chunk's relevance and the next few. A
```

Line 46:
```
The instinct is to treat abstention as failure, a question the system "couldn't
```

Line 53:
```
produce a defensible estimate of how much to trust them, and be allowed to
```

- [ ] **Step 6: Fix `forecasting-temperature-across-211-countries.md`**

Four lines, six dashes: lines 10 and 42 each carry a matched pair used as parenthetical brackets, so both ends must change together or the sentence breaks.

Line 3:
```
description: A single global model beat per-country Prophet baselines by roughly 75% on average error. The interesting part was not the architecture. It was refusing to train 211 separate models.
```

Line 10:
```
countries. The obvious first move, one Prophet model per country, is also the
```

Line 28:
```
inputs. That let the model **borrow strength**: a data-rich country's clean
```

Line 42:
```
share a lot, and geography almost always does, a single model that is *told*
```

- [ ] **Step 7: Assert public copy is clean**

Run:
```bash
grep -rn $'—\|–\|&mdash;\|&ndash;' src/content/blog/ src/data/experience.ts src/pages/blog/index.astro; echo "exit=$?"
```
Expected: no output, `exit=1`.

Run:
```bash
grep -n $'—\|&mdash;' src/components/sections/Contact.astro src/components/ui/ProjectCard.astro
```
Expected: only lines that are code comments. `Contact.astro` retains them at its three comment lines and `ProjectCard.astro` at none. If a line inside markup or an attribute appears, it was missed.

- [ ] **Step 8: Run the gates**

Run: `npm run check`
Expected: 0 errors.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/Contact.astro src/pages/blog/index.astro src/components/ui/ProjectCard.astro src/data/experience.ts src/content/blog/
git commit -m "style(content): remove em dashes from public copy"
```

---

### Task 8: Correct the stale comments in global.css

Three comment blocks describe code that no longer exists, which is worse than no comment because a reader trusts them.

**Files:**
- Modify: `src/styles/global.css` (three comment regions)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Delete the orphaned About-photo comment block**

Find this block, which announces rules that do not follow it, and delete it entirely:

```css
/* ----------------------------------------------------------------------------
   About-photo floating stack badges — looping decorative motion, neutralized
   by the prefers-reduced-motion block below.
---------------------------------------------------------------------------- */
```

- [ ] **Step 2: Correct the grain scope claim**

The next header says the patterns are Hero scope, but `.bt-grain` is used by seven sections. Replace its first line:

```css
/* ----------------------------------------------------------------------------
   Concrete Terminal texture. The grain overlay is applied per section (seven
   of them today). Overlays are decorative and are always aria-hidden plus
   pointer-events:none in the markup.
---------------------------------------------------------------------------- */
```

- [ ] **Step 3: Correct the reduced-motion inventory**

The reduced-motion block lists effects that no longer exist. Replace its descriptive line so it names what is actually neutralized:

```css
/* ----------------------------------------------------------------------------
   Reduced motion — honor the OS/browser "reduce motion" setting.
   All motion here is decorative (cursor glow, CRT scan-beam, skills marquee,
   projects carousel transitions, scroll reveals, the geo-map ping), so we
   neutralize it: reveals snap to their final state and looping effects stop.
   WCAG 2.3.3 / 2.2.2.
---------------------------------------------------------------------------- */
```

- [ ] **Step 4: Assert the removed references are gone**

Run:
```bash
grep -n "hero grid drift\|floating stack badges\|Hero scope" src/styles/global.css; echo "exit=$?"
```
Expected: no output, `exit=1`.

- [ ] **Step 5: Run the gates**

Run: `npm run build`
Expected: exit 0. Comments only, so nothing visual can change; the build confirms the CSS still parses.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css
git commit -m "docs(css): correct comments describing removed effects"
```

---

### Task 9: Make design.md describe the code, correct AGENTS.md, amend ADR-0002

`design.md` documents three tokens that do not exist, states a display scale that does not match, never mentions `--shadow-hard`, and never mentions the light theme that ADR-0012 shipped. `AGENTS.md` bans numbered section labels, contradicting ADR-0011. ADR-0002 still reads as fully accepted although ADR-0006 superseded its Hero scanline.

**Files:**
- Modify: `design.md` (token table, plus new sections)
- Modify: `AGENTS.md` (the public-copy rule line)
- Modify: `docs/adr/0002-industrial-brutalist-design-language.md` (status note only)

**Interfaces:**
- Consumes: the two-rail invariant from Task 1 and the `.surface-card` class from Task 5. Both must be documented as the shipped rule.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Correct the token table in `design.md`**

Replace the wrong or missing rows so every documented token exists in `src/styles/global.css` with the stated value. The corrections:

- `--text-display` is `clamp(3rem, 11vw, 8.5rem)`, not `clamp(3.25rem, 10vw, 8rem)`.
- Delete the `--content-width`, `--border-strong`, and `--motion-enter` rows. None exist.
- Add `--shadow-hard`, value `6px 6px 0 0 var(--color-concrete-50)`, described as the hard-offset signature with no blur.
- Add `--color-canvas` (`#0d100e`) and `--color-ink` (`#e9ece3`), which the body uses and the table omits.

- [ ] **Step 2: Document the two width rails**

Add a section stating the rule Task 1 established: `max-w-6xl` for chrome and all wide content including the landing sections, the blog index, and the 404; `max-w-3xl` reserved for the post body, where the reading measure matters. No other rail exists.

- [ ] **Step 3: Document the interaction and surface rules**

Add: `hover:-translate-x-0.5 hover:-translate-y-0.5` always pairs with `shadow-hard`, never appears alone. The `.surface-card` class in `global.css` is the single card surface; do not re-inline its class string.

Add the label-size convention that Task 6 chose not to churn: `text-label` for eyebrow and metadata labels, `text-xs` for interactive chrome. Both are 0.75rem, so the distinction is by role, not size.

Add the eyebrow convention: section and page eyebrows use `tracking-[0.25em]` with `font-mono text-label uppercase text-concrete-300`; other mono labels use `tracking-[0.2em]`.

- [ ] **Step 4: Document the light theme**

Add a section recording what ADR-0012 shipped and `design.md` never mentioned: the theme follows `prefers-color-scheme` with no in-page toggle; the concrete ramp inverts so `950` is the lightest surface and `50` the darkest ink, which is why every existing utility flips role with no per-component edit; the accent deepens to `#176b33` in light for AA contrast while dark keeps `#46c06a`. Any new color must be added to both blocks.

- [ ] **Step 5: Correct the contradiction in `AGENTS.md`**

The public-copy rule currently bans numbered section labels, which the accepted ADR-0011 requires the landing to keep. Remove that clause, leaving the dash and plain-punctuation rules intact, and note that section eyebrows are the one sanctioned numbering.

- [ ] **Step 6: Amend ADR-0002 in place**

Do not change its `Accepted` status and do not delete anything. Add a short note under the status recording that its Hero-only `.bt-scanline` was superseded by the global overlay in ADR-0006, and that ADR-0013 later tempered the grain and glow values without revoking either. The number and file are kept, per the durable-records rule in `.standards/docs/standards/spec_method.md`.

- [ ] **Step 7: Assert every documented token exists**

For each token named in the `design.md` table, confirm it appears in `src/styles/global.css`:

```bash
for t in --color-canvas --color-ink --color-accent --color-concrete-950 --color-concrete-900 --color-concrete-700 --color-concrete-500 --color-concrete-300 --color-concrete-50 --shadow-hard --text-display --text-label; do
  grep -q -- "$t:" src/styles/global.css && echo "OK   $t" || echo "MISSING $t"
done
```
Expected: every line reads `OK`.

Run:
```bash
grep -n -- "--content-width\|--border-strong\|--motion-enter" design.md; echo "exit=$?"
```
Expected: no output, `exit=1`. The invented tokens are gone from the document.

- [ ] **Step 8: Commit**

```bash
git add design.md AGENTS.md docs/adr/0002-industrial-brutalist-design-language.md
git commit -m "docs: make the design system describe the shipped code"
```

---

### Task 10: Full verification pass

The static gates caught none of the defects this plan fixes. The browser found all of them. This task is the one that can actually fail the work.

**Files:**
- No source changes. Evidence is attached to the pull request.

**Interfaces:**
- Consumes: every preceding task.
- Produces: the evidence the spec's `visual_pass_recorded` criterion requires.

- [ ] **Step 1: Run every static gate**

Run: `npm run check`
Expected: 0 errors.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 2: Run the full acceptance grep suite**

```bash
echo "--- no 5xl rail"; grep -rn "max-w-5xl" src/; echo "exit=$?"
echo "--- 3xl only in post body"; grep -rn "max-w-3xl" src/
echo "--- no pre-brutalist residue"; grep -rn "rounded-\|font-semibold\|border-dashed" src/ | grep -v "focus:rounded"; echo "exit=$?"
echo "--- translate pairs with shadow"; grep -rn "hover:-translate" src/ | grep -v "shadow-hard"; echo "exit=$?"
echo "--- no ordinal generators"; grep -rn "padStart" src/components/; echo "exit=$?"
echo "--- section numbering intact"; grep -rn "0[1-7] / " src/components/sections/ | wc -l
echo "--- public copy dash-free"; grep -rn $'—\|&mdash;' src/content/ src/data/experience.ts src/pages/; echo "exit=$?"
echo "--- spec archive"; ls docs/specs/
```
Expected: the four `exit=1` lines report no matches; `max-w-3xl` returns one line; the section-numbering count is 7; `docs/specs/` lists `0001` through `0004` with no gap.

- [ ] **Step 3: Lighthouse budget**

Run the Lighthouse CI against the built output using `lighthouserc.json`. Expected: accessibility at or above 0.95 and CLS at or below 0.1, both of which are `error`-level assertions in that config, and no regression in the `warn`-level performance score.

- [ ] **Step 4: Browser pass, four routes, three widths**

Inspect the landing, `/blog`, one article, and `/404` at 390px, 768px, and 1440px. At each, confirm: no horizontal overflow, the blog header aligns with its content, the mobile action bar is present on all four routes below 768px without covering the footer, keyboard focus rings are visible on every interactive control, and the console is free of errors.

- [ ] **Step 5: Reduced motion and no JavaScript**

Emulate `prefers-reduced-motion: reduce`: the hero content must be fully visible, the marquee and CRT beam must stop, and the geo-map ping must be frozen. Then disable JavaScript entirely: every section and both blog routes must stay readable and navigable, with the hero content visible rather than stuck at `opacity: 0`.

- [ ] **Step 6: Light theme**

The spec carries this as a declared, unverified assumption. Switch the OS or browser to `prefers-color-scheme: light` and check all four routes for contrast failures, especially the rebuilt 404 and the `.surface-card` panels, since the concrete ramp inverts. If anything fails, stop and report: the assumption is withdrawn and the fix needs its own scope decision rather than a silent patch.

- [ ] **Step 7: Capture evidence and open the pull request**

Capture before and after screenshots for the landing, `/blog`, an article, and `/404`. Open the PR following the model in `.standards/docs/standards/github.md`: title in Conventional Commits, and the sections Context (linking `docs/specs/0004-...`), What Was Done, How to Test, Evidence, and the PR Review Checklist. Record which review layers ran and which did not, and why.
