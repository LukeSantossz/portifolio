# Projects Redesign (Concrete Terminal — pinned horizontal showcase) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The pin (Task 4) is the riskiest part — verify it in a real browser (and emulate reduced-motion + a narrow viewport) before final sign-off.

**Goal:** Replace the 3D project deck with a pinned horizontal case-study showcase (metric-forward "case files") built as a GSAP ScrollTrigger enhancement over an accessible static vertical stack.

**Architecture:** The DOM is a track of four "case file" articles (reworked `ProjectCard`). By default — no-JS, `prefers-reduced-motion: reduce`, or `< 1024px` — they render as an accessible vertical stack with the full case study in a `<details>`. On desktop with motion allowed, a `gsap.matchMedia()` branch adds a `projects-pinned` class (CSS lays the track out as a horizontal row of 100vw panels) and a ScrollTrigger that pins the viewport and scrubs the track horizontally with snap. A small additive `metric`/`metricLabel` field powers the giant metric hero; no case-study prose is edited.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6, GSAP 3 (core + `gsap/ScrollTrigger`, already installed), Astro Content Collections.

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core + ScrollTrigger from the existing `gsap` package), Node 22 in CI.
- Static Astro only — **no React.**
- `#projects` uses ONLY `--color-concrete-*` + green (`--color-accent`). NO harvest gold (`--color-accent-2`/`d6a84e`); NO legacy utilities (`bg-surface`, `border-border`, `text-ink`, `text-muted`, `card-lit`, `accent-rule`); no `rounded-*`. Green is the only chromatic signal.
- **Content prose unchanged:** only additive `metric` (required) + `metricLabel` (optional) frontmatter fields are added to `src/content/projects/*.md`; no existing prose is reworded. No other `src/content/` changes.
- Accessible static base is the source of truth: with no JS, reduced motion, or `< 1024px`, `#projects` is a readable vertical stack with the full `<details>` narrative; the pin never traps focus and preserves document order.
- The pin/scrub activates ONLY under `(prefers-reduced-motion: no-preference) and (min-width: 1024px)` and fully reverts on cleanup.
- Reveal/animation is transform/opacity only (CLS-safe); the pin uses a pin-spacer. Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), seo ≥0.95 (error), CLS ≤0.1 (error), performance ≥0.9 (warn), best-practices ≥0.95 (warn), LCP ≤2500 (warn), TBT ≤200 (warn).
- The harvest-gold token stays defined and in use by `Experience.astro` + `.accent-rule` (other phases) — do not remove it globally.
- All output in English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit-test harness by design. Each task is verified by gates — `npm run check` (0 errors) + `npm run build` (exit 0) + targeted invariant greps + manual/browser checks.
- Out of scope: other sections (Experience, Contact, Nav, Footer); the section-index label (Projects is already `05`); removing the gold token globally; editing case-study prose; the deferred site-wide `concrete-300` brightness decision.

---

### Task 1: Add the `metric` field to the schema and the four projects

**Files:**
- Modify: `src/content.config.ts` (projects schema)
- Modify: `src/content/projects/smartb100-rag-agent.md`, `visiosoil.md`, `tweet-sentiment-analysis.md`, `weather-forecast.md` (frontmatter only)

**Interfaces:**
- Produces: `metric: string` (required) and `metricLabel?: string` on every project entry, consumed by `ProjectCard` (Task 2).

- [ ] **Step 1: Add the fields to the schema**

In `src/content.config.ts`, inside the `z.object({ ... })`, add these two lines immediately after the `domain: z.string().optional(),` line:

```ts
    // Curated headline metric for the case-study showcase (the giant hero number).
    metric: z.string(), // e.g. "0.19°C", "3rd / 1,300+"
    metricLabel: z.string().optional(), // short context under the metric
```

- [ ] **Step 2: Add `metric`/`metricLabel` to each project's frontmatter**

Add these two lines to the frontmatter of each file (anywhere among the existing keys; do not change any existing line):

`src/content/projects/smartb100-rag-agent.md`:
```yaml
metric: "205 tests"
metricLabel: "~83% coverage · FAPESP-funded RAG agent"
```

`src/content/projects/visiosoil.md`:
```yaml
metric: "3rd / 1,300+"
metricLabel: "FETEPS 2025 · ICPA 2026 paper accepted"
```

`src/content/projects/tweet-sentiment-analysis.md`:
```yaml
metric: "42× faster"
metricLabel: "Rust preprocessing rewrite, byte-identical"
```

`src/content/projects/weather-forecast.md`:
```yaml
metric: "0.19°C"
metricLabel: "avg error (RMSE) · ~75% below Prophet"
```

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors` (the schema accepts the new required field; all four entries supply it).
Run: `npm run build` → Expected: exit 0.
Run: `git diff --stat src/content/projects` → Expected: 4 files changed, additions only (no deletions of prose lines).

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/projects/
git commit -m "feat(content): add headline metric field to projects"
```

---

### Task 2: Rework `ProjectCard.astro` into a Concrete Terminal "case file"

**Files:**
- Modify (full rewrite): `src/components/ui/ProjectCard.astro`

**Interfaces:**
- Consumes: the project entry props including the new `metric`/`metricLabel` (Task 1), `Icon` (`name`, `size`).
- Produces: an `<article>` "case file" with a `metric` hero, classification header, Result punchline, stack, repo/demo links, and a `<details data-full-case>` full narrative (hidden in pin mode by Task 4 CSS).

- [ ] **Step 1: Replace the entire contents of `src/components/ui/ProjectCard.astro`**

```astro
---
import Icon from './Icon.astro';

interface Props {
  title: string;
  tagline: string;
  domain?: string;
  metric: string;
  metricLabel?: string;
  problem: string;
  constraints?: string;
  approach: string;
  alternatives?: string;
  result: string;
  retrospective?: string;
  roadmap?: string;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  period?: string;
  index?: number;
}

const {
  title,
  tagline,
  domain,
  metric,
  metricLabel,
  problem,
  constraints,
  approach,
  alternatives,
  result,
  retrospective,
  roadmap,
  stack,
  repoUrl,
  demoUrl,
  period,
  index = 0,
} = Astro.props;

// Full narrative for the static base (read in the <details>). The showcase panel
// shows the impact view above it; this disclosure is hidden in pin mode.
const caseMoves = [
  { label: 'Context', value: problem },
  { label: 'Constraints', value: constraints },
  { label: 'Decision', value: approach },
  { label: 'Alternatives considered', value: alternatives },
  { label: 'Retrospective', value: retrospective },
  { label: 'What is next', value: roadmap },
].filter((move) => move.value);
---

<article
  class="flex h-full flex-col border-2 border-concrete-50 bg-concrete-950 p-6 text-concrete-50 md:p-8"
>
  <!-- Classification header -->
  <p class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label uppercase tracking-[0.2em] text-concrete-300">
    <span class="text-accent">PROJECT {String(index + 1).padStart(2, '0')}</span>
    {domain && (
      <>
        <span aria-hidden="true" class="text-concrete-700">//</span>
        <span>{domain}</span>
      </>
    )}
    {period && (
      <>
        <span aria-hidden="true" class="text-concrete-700">//</span>
        <span>{period}</span>
      </>
    )}
  </p>

  <!-- Metric hero -->
  <p class="mt-4 font-sans text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-concrete-50">
    {metric}
  </p>
  {metricLabel && (
    <p class="mt-1 font-mono text-xs uppercase tracking-wide text-concrete-300">{metricLabel}</p>
  )}

  <!-- Title + tagline -->
  <h3 class="mt-6 font-mono text-base font-bold uppercase tracking-wide text-concrete-50 md:text-lg">
    {title}
  </h3>
  <p class="mt-2 max-w-prose font-sans text-sm leading-relaxed text-concrete-300 md:text-base">
    {tagline}
  </p>

  <!-- Result punchline (green signal); clamped in the panel, full in the base via the line-clamp utility being overridden is not needed — keep concise. -->
  <div class="mt-5 border-l-2 border-accent pl-3">
    <p class="font-mono text-xs uppercase tracking-wide text-accent">Result</p>
    <p class="mt-1 line-clamp-3 font-sans text-sm leading-relaxed text-concrete-50">{result}</p>
  </div>

  <!-- Stack -->
  <ul class="mt-6 flex flex-wrap gap-2">
    {
      stack.map((tech) => (
        <li class="border border-concrete-700 px-2.5 py-1 font-mono text-xs text-concrete-300">
          {tech}
        </li>
      ))
    }
  </ul>

  <!-- Links + full case study (the disclosure is hidden in pin mode by global.css). -->
  <div class="mt-auto pt-6">
    <div class="flex flex-wrap items-center gap-3">
      {
        repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 border-2 border-concrete-50 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-concrete-50 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <Icon name="github" size={16} />
            Repo
          </a>
        )
      }
      {
        demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 border-2 border-concrete-50 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-concrete-50 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <Icon name="external" size={16} />
            Demo
          </a>
        )
      }
    </div>

    <details data-full-case class="reveal-details mt-4">
      <summary
        class="cursor-pointer list-none font-mono text-xs uppercase tracking-wide text-concrete-300 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden"
      >
        Read the full case study
      </summary>
      <dl class="mt-3 space-y-3">
        {
          caseMoves.map((move) => (
            <div>
              <dt class="font-mono text-xs uppercase tracking-wide text-accent">{move.label}</dt>
              <dd class="mt-1 font-sans text-sm leading-relaxed text-concrete-300">{move.value}</dd>
            </div>
          ))
        }
      </dl>
    </details>
  </div>
</article>
```

- [ ] **Step 2: Verify no gold / no legacy, and the metric is consumed**

Run: `grep -c "accent-2\|bg-surface\|border-border\|text-ink\|text-muted\|card-lit\|accent-rule\|rounded-\|bannerBg\|monogram" src/components/ui/ProjectCard.astro` → Expected: `0`.
Run: `grep -c "metric\|data-full-case\|concrete-\|text-accent" src/components/ui/ProjectCard.astro` → Expected: `> 0`.

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ProjectCard.astro
git commit -m "feat(ui): rework ProjectCard into a Concrete Terminal case file"
```

---

### Task 3: Rewrite `Projects.astro` to the accessible static stack (remove the 3D deck)

This is the accessible base — no pin yet. Remove the deck markup/tabs/deck script and the dead deck CSS.

**Files:**
- Modify (full rewrite): `src/components/sections/Projects.astro`
- Modify: `src/styles/global.css` (remove dead `.project-deck` / `.deck-card` / `.deck-tab` rules)

**Interfaces:**
- Consumes: `getCollection('projects')`, `ProjectCard` (Task 2), `site.github`, `.bt-grain`, `--color-concrete-*` + green.
- Produces: DOM hooks `#projects [data-projects-viewport]`, `[data-projects-track]`, `[data-project-panel]`, and `data-projects-anim` on the heading (consumed by Task 4).

- [ ] **Step 1: Replace the entire contents of `src/components/sections/Projects.astro`**

```astro
---
import { getCollection } from 'astro:content';
import ProjectCard from '../ui/ProjectCard.astro';
import { site } from '../../data/site.ts';

const entries = await getCollection('projects');
const projects = entries.sort((a, b) => {
  if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
  return a.data.order - b.data.order;
});
---

<section
  id="projects"
  class="relative overflow-hidden border-t-2 border-concrete-50 bg-concrete-950 text-concrete-50"
>
  <!-- Decorative analog grain (no semantics, not focusable). -->
  <div class="bt-grain" aria-hidden="true"></div>

  <div class="relative z-10 mx-auto max-w-6xl px-6 pt-24 md:pt-28">
    <div data-projects-anim class="mb-12 flex flex-wrap items-end justify-between gap-4">
      <div class="max-w-2xl">
        <p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">
          <span class="text-accent">05 / CASE STUDIES</span>
        </p>
        <h2
          class="mt-3 font-sans text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-concrete-50 md:text-6xl"
        >
          Case studies
        </h2>
        <p class="mt-5 font-sans text-base leading-relaxed text-concrete-300 md:text-lg">
          Not a gallery of screenshots. Each one walks through the problem, the
          constraints, the call I made, and what I would revisit.
        </p>
      </div>
      <a
        href={site.github}
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-xs uppercase tracking-wider text-concrete-300 transition-colors hover:text-accent"
      >
        All repositories &rarr;
      </a>
    </div>
  </div>

  <!-- Case-file track: an accessible vertical stack by default; Task 4 turns it
       into a pinned horizontal showcase on desktop with motion allowed. -->
  <div class="relative z-10 pb-24 md:pb-28" data-projects-viewport>
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:gap-8" data-projects-track>
      {
        projects.map((project, i) => (
          <div class="w-full" data-project-panel>
            <ProjectCard {...project.data} index={i} />
          </div>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Remove the dead deck CSS from `src/styles/global.css`**

Confirm the deck rules are used only by the old Projects markup (now removed). Run:

```bash
grep -rn "project-deck\|deck-card\|deck-tab" src --include=*.astro
```

Expected: **no matches**. If clean, delete from `src/styles/global.css` the entire "Projects deck" section — the comment header plus the `.project-deck`, `.deck-card`, `.deck-card.is-active`, `.deck-card:not(.is-active)`, `.deck-card:not(.is-active) > *`, `.deck-tab`, `.deck-tab:hover`, and `.deck-tab[aria-selected='true']` rules. If any `.astro` still references them, stop and report.

- [ ] **Step 3: Verify no gold/legacy/deck remains and the hooks are present**

Run: `grep -c "accent-2\|bg-surface\|border-border\|text-ink\|text-muted\|accent-rule\|rounded-\|project-deck\|deck-tab\|role=\"tablist\"" src/components/sections/Projects.astro` → Expected: `0`.
Run: `grep -c "data-projects-viewport\|data-projects-track\|data-project-panel\|data-projects-anim" src/components/sections/Projects.astro` → Expected: `> 0`.
Run: `grep -rc "project-deck\|deck-card\|deck-tab" src/styles/global.css` → Expected: `0`.

- [ ] **Step 4: Verify the gates + static render**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.
Run: `grep -c "data-project-panel" dist/index.html` → Expected: `4` (four case files rendered in the static stack).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Projects.astro src/styles/global.css
git commit -m "feat(ui): rebuild Projects as an accessible Concrete Terminal case-file stack"
```

---

### Task 4: Add the pinned horizontal showcase (CSS + GSAP ScrollTrigger)

Layer the cinematic pin over the static base, gated to desktop + motion. Add the heading entrance too.

**Files:**
- Modify: `src/styles/global.css` (append a `.projects-pinned` block)
- Modify: `src/components/sections/Projects.astro` (append a module `<script>`)

**Interfaces:**
- Consumes: the `data-projects-viewport` / `data-projects-track` / `data-project-panel` / `data-projects-anim` hooks (Task 3) and `gsap` + `gsap/ScrollTrigger`.
- Produces: runtime behavior + the `projects-pinned` layout class (JS-applied).

- [ ] **Step 1: Append the pinned-layout CSS to `src/styles/global.css`**

Add at the end of the file:

```css
/* ----------------------------------------------------------------------------
   Projects pinned showcase. JS adds .projects-pinned ONLY on desktop with motion
   allowed; the default (no class) is the accessible vertical stack. Hidden under
   no-JS / reduced-motion / < 1024px, so the base layout is the universal fallback.
---------------------------------------------------------------------------- */
.projects-pinned {
  overflow: hidden;
}

.projects-pinned [data-projects-track] {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: max-content;
  max-width: none;
  gap: 0;
  padding: 0;
}

.projects-pinned [data-project-panel] {
  flex: 0 0 100vw;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem clamp(1.5rem, 6vw, 6rem);
}

/* In the pinned panel the full-case disclosure would overflow the viewport, so
   it is hidden; the complete narrative is read in the static base (and the repo). */
.projects-pinned [data-full-case] {
  display: none;
}
```

- [ ] **Step 2: Append the showcase module `<script>` at the end of `Projects.astro`**

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Heading entrance (any width, motion allowed) — opacity-only, fail-safe.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const heading = document.querySelector('#projects [data-projects-anim]');
    if (!heading) return;
    const tween = gsap.from(heading, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
    });
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(heading, { clearProps: 'all' });
    };
  });

  // Pinned horizontal showcase — desktop + motion only. The static stack is the
  // fallback everywhere else; if this never runs, content is fully visible.
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
    const viewport = document.querySelector<HTMLElement>('#projects [data-projects-viewport]');
    const track = document.querySelector<HTMLElement>('#projects [data-projects-track]');
    const panels = gsap.utils.toArray<HTMLElement>('#projects [data-project-panel]');
    if (!viewport || !track || panels.length < 2) return;

    viewport.classList.add('projects-pinned');

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: viewport,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth),
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        invalidateOnRefresh: true,
      },
    });

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      viewport.classList.remove('projects-pinned');
      gsap.set(track, { clearProps: 'all' });
    };
  });
</script>
```

- [ ] **Step 3: Verify the gates (GSAP + ScrollTrigger bundle)**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0, no "failed to resolve import 'gsap/ScrollTrigger'".
Run: `grep -o "Projects.astro_astro_type_script" dist/index.html | head -1` → Expected: a match.
Run (no CSS pre-hide of panels): `grep -roh "data-project-panel]{opacity:0}\|data-projects-anim]{opacity:0}" dist/_astro/*.css | wc -l` → Expected: `0`.

- [ ] **Step 4: Manual browser checks (the critical ones for the pin)**

`npm run preview` on a desktop-width window with motion on:
- Scroll into Projects → the section pins and the case files scrub horizontally 01→02→03→04, snapping to each; the giant metric reads big; then the pin releases and the page continues.
- Resize to `< 1024px` (or emulate a phone) → the pin is gone; case files are a readable vertical stack.
- DevTools → emulate `prefers-reduced-motion: reduce`, reload → no pin, vertical stack, no scroll-hijack, no trapped focus; tab through the cards/links in order.
- Watch for layout shift (CLS) when the pin engages.
- (If a browser is unavailable, say so explicitly; do NOT claim these were verified.)

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/components/sections/Projects.astro
git commit -m "feat(ui): add pinned horizontal showcase to Projects behind matchMedia"
```

---

### Task 5: Record the pinning decision (ADR-0005) and index it

**Files:**
- Create: `docs/adr/0005-scrolltrigger-pin-projects-showcase.md`
- Modify: `README.md` (one Engineering Decisions row)

- [ ] **Step 1: Create the ADR**

Create `docs/adr/0005-scrolltrigger-pin-projects-showcase.md`:

```markdown
# Use GSAP ScrollTrigger pinning for the Projects showcase, over an accessible base

The Projects section is the portfolio's proof centerpiece. To present each case study with
maximum impact, it pins on scroll and moves horizontally through metric-forward "case
files" (GSAP ScrollTrigger `pin` + `scrub` + `snap`). Pinning/scroll-hijacking carries real
accessibility and performance risk (the Hero SPEC deferred it for exactly that), so it is
built strictly as a progressive enhancement: the DOM is an accessible vertical stack of full
case files (with the complete `<details>` narrative), and the pin is activated only by a
single `gsap.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 1024px)')`
that fully reverts on cleanup.

## Status

Accepted.

## Considered Options

- **Pinned horizontal showcase over an accessible static base (chosen)**: maximum impact on
  capable desktops, with no-JS / reduced-motion / small-screen users getting the readable
  stack. The pin never traps focus and preserves document order.
- **Keep the 3D perspective deck**: rejected — least brutalist element, bespoke fragile JS.
- **Static stack only (no pin)**: kept as the fallback, not the primary desktop experience;
  the cinematic showcase was the explicit goal.

## Consequences

- The static stack is the source of truth; the pin is an enhancement gated by `matchMedia`.
- The full case-study narrative is read in the static base (and each repo); the pinned panel
  shows the concise impact view (metric + Result + summary).
- Animation is transform/opacity only and uses a pin-spacer; the Lighthouse a11y (≥0.95) and
  CLS (≤0.1) error budgets gate it.
- Verification follows ADR-0001 (build + type-check + Lighthouse + manual/browser checklist).
```

- [ ] **Step 2: Add the README Engineering Decisions row**

In `README.md`, in the Engineering Decisions table, after the ADR-0004 row, add:

```markdown
| Pinned horizontal Projects showcase over an accessible static base | Keep the 3D deck; static stack only | Maximum-impact case-study presentation on desktop, with a readable stack fallback for no-JS / reduced-motion / mobile. See [ADR-0005](docs/adr/0005-scrolltrigger-pin-projects-showcase.md). |
```

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add docs/adr/0005-scrolltrigger-pin-projects-showcase.md README.md
git commit -m "docs: record Projects pinned-showcase ADR"
```

---

### Task 6: Acceptance verification sweep

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `metric_field_added` + `content_prose_unchanged`**

Run: `grep -c "metric:" src/content/projects/*.md` → Expected: `1` per file (4 files).
Run: `git diff $(git merge-base main HEAD) HEAD -- src/content/projects | grep -c "^-[^-]"` → Expected: `0` (no removed prose lines; additions only).

- [ ] **Step 3: `projects_no_gold_no_legacy` + `deck_removed`**

Run: `awk '/<section id="projects"/{f=1} f{print} f&&/<\/section>/{exit}' dist/index.html | grep -o "accent-2\|d6a84e\|bg-surface\|border-border\|card-lit\|accent-rule" | wc -l` → Expected: `0`.
Run: `grep -rc "project-deck\|deck-card\|deck-tab" src` → Expected: every file `0`.
Run (green present in Projects): `awk '/<section id="projects"/{f=1} f{print} f&&/<\/section>/{exit}' dist/index.html | grep -o "text-accent\|border-accent" | wc -l` → Expected: `> 0`.

- [ ] **Step 4: `static_base_accessible` + `reading_order_preserved` (static + browser)**

Run: `grep -c "data-project-panel" dist/index.html` → Expected: `4`.
Run: `grep -c "data-full-case" dist/index.html` → Expected: `4` (the full-case disclosure is in the DOM for the base).
Browser: with JS off (or reduced-motion / `<1024px`), the four case files stack readably with working `<details>` and the "All repositories" link; tab order is sensible.

- [ ] **Step 5: `pin_gated_and_reverts` + `cls_safe` + `projects_texture_decorative` (static + browser)**

Run: `grep -o "Projects.astro_astro_type_script" dist/index.html | head -1` → Expected: a match.
Run: `grep -c 'class="bt-grain" aria-hidden="true"' src/components/sections/Projects.astro` → Expected: `1`.
Browser (desktop + motion): pin engages and scrubs horizontally; reduced-motion / narrow viewport → no pin (static stack); no CLS spike when pinning.

- [ ] **Step 6: `adr_recorded` + `lighthouse_budget_met`**

Run: `test -f docs/adr/0005-scrolltrigger-pin-projects-showcase.md && grep -c "ADR-0005" README.md` → Expected: file exists and `≥ 1`.
Run Lighthouse via CI (or `npx lhci autorun` if available) against `lighthouserc.json` — focus on accessibility ≥0.95 and CLS ≤0.1. Record outputs for the PR Evidence; note R2 status.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → every task + Task 6.
- `metric_field_added` + `content_prose_unchanged` → Task 1 + Task 6 Step 2.
- `projects_no_gold_no_legacy` → Task 2 + Task 3 + Task 6 Step 3.
- `deck_removed` → Task 3 (markup + CSS removal) + Task 6 Step 3.
- `static_base_accessible` + `reading_order_preserved` → Task 3 (static stack, document order) + Task 6 Step 4.
- `pin_gated_and_reverts` + `cls_safe` → Task 4 (matchMedia gate + cleanup; transform-only; pin-spacer) + Task 6 Step 5.
- `projects_texture_decorative` → Task 3 (`.bt-grain` aria-hidden) + Task 6 Step 5.
- `adr_recorded` → Task 5 + Task 6 Step 6.
- `lighthouse_budget_met` → Task 6 Step 6.
- Scope "Includes" (metric field, ProjectCard, Projects rebuild, pin, ADR) → Tasks 1–5. "Does NOT include" → respected (no other sections, no label change, no prose edits, gold kept globally).

**Placeholder scan:** no TBD/TODO; every code step contains complete content.

**Type/name consistency:** `metric`/`metricLabel` (schema → md → ProjectCard props), `data-projects-viewport`/`data-projects-track`/`data-project-panel`/`data-projects-anim`, `data-full-case`, `.projects-pinned`, `toArray<HTMLElement>`, and the `mm`/`tween` locals are used identically across Tasks 1–4.
