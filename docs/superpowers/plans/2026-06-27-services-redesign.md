# Services Redesign (Concrete Terminal — Capability Ledger) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Services section into the Concrete Terminal "Capability Ledger" (a hard-bordered numbered list), decouple its copy into `src/data/services.ts`, and add GSAP ScrollTrigger scroll-entrances — keeping the site static Astro and the accessibility/Lighthouse baseline.

**Architecture:** The Services copy moves to a data module; then `Services.astro` is rewritten to a hard-bordered `<ul>` ledger consuming only `--color-concrete-*` + green (no gold); then a `gsap.matchMedia()`-gated ScrollTrigger module reveals the heading and rows on scroll via `opacity` (no-JS / reduced-motion show the final content; transform/opacity only → CLS-safe). The design language (ADR-0002), GSAP (ADR-0003), and ScrollTrigger as the section-motion mechanism (ADR-0004) are already recorded — no new ADR.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6, GSAP 3 (core + `gsap/ScrollTrigger`, already installed), `@fontsource-variable/*`.

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core + ScrollTrigger from the existing `gsap` package — no new dependency), Node 22 in CI.
- Static Astro only — **no React, no UI framework.**
- **Content relocated, not edited:** the Services copy (intro + four items) moves to `src/data/services.ts` verbatim; no copy is reworded. No changes under `src/content/projects/*`. (`content_unchanged` = no copy/content edits.)
- The harvest-gold token `--color-accent-2` **stays defined and in use** by `Experience.astro`, `ProjectCard`, `.accent-rule` — do not remove it or touch those. Only the **Services** drops gold.
- Green signal = `--color-accent` (`#46c06a`); it is the only chromatic signal **in the Services section**.
- Reveal hides with `opacity` (NOT `autoAlpha`) so content stays in the accessibility tree and focusable, consistent with the About phase.
- Accessibility baseline preserved; Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), seo ≥0.95 (error), CLS ≤0.1 (error), performance ≥0.9 (warn), best-practices ≥0.95 (warn), LCP ≤2500 (warn), TBT ≤200 (warn).
- All output in English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit-test harness by design. Each task is verified by gates — `npm run check` (0 errors) + `npm run build` (exit 0) + targeted invariant greps + manual checks. "Run the test" below means "run these gates."
- Out of scope (do NOT do): any other section; changing section-index labels (Services is already `03`); making the capabilities link anywhere; migrating other sections' `[data-reveal]`.

---

### Task 1: Decouple Services copy into `src/data/services.ts`

Move the hardcoded `services` array and the intro paragraph out of the component into a data module (matching `about.ts`/`skills.ts`), and have `Services.astro` consume it. Copy moves verbatim; markup is otherwise unchanged this task (the redesign is Task 2).

**Files:**
- Create: `src/data/services.ts`
- Modify: `src/components/sections/Services.astro` (replace the local `services` const + inline intro text with an import)

**Interfaces:**
- Produces: `export const services = { intro: string; items: { title: string; body: string }[] }` (consumed by Task 2).

- [ ] **Step 1: Create `src/data/services.ts`**

```ts
/**
 * Services / capabilities content.
 * Decoupled from the component so copy edits never touch markup
 * (matches the src/data/*.ts pattern used across the site).
 */
export const services = {
  intro:
    'Four things I do well, each one backed by a real, shipped project in the case studies, not just a line on a slide.',
  items: [
    {
      title: 'Computer vision that runs offline',
      body: 'Image models that run on the phone itself, in the field, with no signal and no trip to a server, for places where connectivity fails and a wrong call is costly.',
    },
    {
      title: 'Forecasting that hedges its bets',
      body: 'Forecasting that does not stake everything on one model: a weighted blend of approaches, anomaly detection, and honest error numbers measured against a public baseline.',
    },
    {
      title: 'LLM agents you can act on',
      body: 'Question-answering and agent systems that report their own uncertainty, so a person knows how far to trust each answer, running on open models with no dependence on a paid service.',
    },
    {
      title: 'The plumbing that keeps it alive',
      body: 'The work that turns a notebook into a service people can rely on: packaging, automated builds, tests, and the unglamorous infrastructure that keeps a model running long after the demo is over.',
    },
  ],
} as const;
```

- [ ] **Step 2: Consume it in `Services.astro`**

In `src/components/sections/Services.astro` frontmatter, delete the entire `const services = [...]` block (and the JSDoc comment above it) and replace it with the import so the frontmatter reads exactly:

```astro
---
import { services } from '../../data/services.ts';
---
```

Then update the two consumption points in the markup, changing nothing else:
- The intro paragraph: replace the hardcoded sentence "Four things I do well, each one backed by a real, shipped project in the case studies, not just a line on a slide." (inside its `<p>`) with `{services.intro}`.
- The grid map: change `services.map((service, i) =>` to `services.items.map((service, i) =>`.

- [ ] **Step 3: Verify copy is verbatim and gates pass**

Confirm each string in `src/data/services.ts` is identical to what `Services.astro` previously held (no rewording).
Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.
Run: `grep -c "const services" src/components/sections/Services.astro` → Expected: `0`.

- [ ] **Step 4: Commit**

```bash
git add src/data/services.ts src/components/sections/Services.astro
git commit -m "refactor(content): decouple Services copy into src/data/services.ts"
```

---

### Task 2: Rewrite `Services.astro` to the Capability Ledger

Replace the soft 2×2 card grid with a hard-bordered numbered ledger consuming only `--color-concrete-*` + green. Drop all gold. Add `data-services-anim` hooks (Task 3 uses them) and a decorative grain overlay.

**Files:**
- Modify (full rewrite of markup): `src/components/sections/Services.astro`

**Interfaces:**
- Consumes: `services` (`{ intro, items }`) from Task 1; `--color-concrete-*` + `--color-accent` + `--text-label` tokens; `.bt-grain` (from the Hero phase).
- Produces: DOM hooks `data-services-anim` on the heading block and each `<li>` row (consumed by Task 3).

- [ ] **Step 1: Replace the entire contents of `src/components/sections/Services.astro`**

```astro
---
import { services } from '../../data/services.ts';
---

<section
  id="services"
  class="relative overflow-hidden border-t-2 border-concrete-50 bg-concrete-950 text-concrete-50"
>
  <!-- Decorative analog grain (no semantics, not focusable). -->
  <div class="bt-grain" aria-hidden="true"></div>

  <div class="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-28">
    <div data-services-anim class="mb-12 max-w-2xl">
      <p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">
        <span class="text-accent">03 / WHAT I DO</span>
      </p>
      <h2
        class="mt-3 font-sans text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-concrete-50 md:text-6xl"
      >
        What I build
      </h2>
      <p class="mt-5 font-sans text-base leading-relaxed text-concrete-300 md:text-lg">
        {services.intro}
      </p>
    </div>

    <ul class="border-2 border-concrete-50">
      {
        services.items.map((service, index) => (
          <li
            data-services-anim
            class={`group grid grid-cols-[auto_1fr] gap-x-5 p-5 transition-colors hover:bg-concrete-900 md:gap-x-8 md:p-7 ${
              index > 0 ? 'border-t-2 border-concrete-50' : ''
            }`}
          >
            <span
              aria-hidden="true"
              class="font-mono text-3xl font-bold leading-none text-concrete-700 transition-colors group-hover:text-accent md:text-5xl"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 class="font-mono text-base font-bold uppercase tracking-wide text-concrete-50 transition-colors group-hover:text-accent md:text-lg">
                {service.title}
              </h3>
              <p class="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-concrete-300 md:text-base">
                {service.body}
              </p>
            </div>
          </li>
        ))
      }
    </ul>
  </div>
</section>
```

(Note: the design's "green left-edge bar on hover" is delivered as the number + title turning green on row hover plus a subtle `bg-concrete-900` row highlight — a robust hover signal without a fragile per-side border-color utility.)

- [ ] **Step 2: Verify no gold / no legacy palette, only concrete + green**

Run: `grep -c "accent-2\|bg-surface\|border-border\|text-ink\|text-muted\|card-lit\|accent-rule\|rounded-" src/components/sections/Services.astro` → Expected: `0`.
Run: `grep -c "concrete-\|text-accent\|bg-accent\|border-accent" src/components/sections/Services.astro` → Expected: `> 0`.
Run: `grep -c "data-services-anim" src/components/sections/Services.astro` → Expected: `2` (the heading block + the `<li>` in the map; renders as 1 heading + 4 rows at runtime).

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Manual visual check**

`npm run preview`; scroll to Services. Confirm: concrete-black section with a hard top rule, off-white display heading, green "03 / WHAT I DO" label, a hard-bordered ledger of four rows with large mono numbers and hard dividers; hovering a row turns its number + title green with a subtle row highlight. No rounded corners, no gold, no card glow.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Services.astro
git commit -m "feat(ui): redesign Services as a Concrete Terminal capability ledger"
```

---

### Task 3: Add GSAP ScrollTrigger scroll-entrances to Services

Reveal the `data-services-anim` elements staggered as they scroll into view, gated by `gsap.matchMedia()`, hiding via `opacity` only. Below-the-fold, so no pre-paint anti-FOUC: the hide happens only inside the motion branch, so reduced-motion and no-JS leave content visible.

**Files:**
- Modify: `src/components/sections/Services.astro` (append a bundled module `<script>`)

**Interfaces:**
- Consumes: the `data-services-anim` hooks from Task 2 and the `gsap` package (with `gsap/ScrollTrigger`).
- Produces: runtime behavior only.

- [ ] **Step 1: Append the ScrollTrigger module at the end of `Services.astro`**

Add to the bottom of `src/components/sections/Services.astro` (after the closing `</section>`):

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Motion allowed: hide the entrance targets (opacity only — keeps them in the
  // a11y tree), then reveal them in a staggered batch as they scroll into view.
  // Reduced motion / no-JS never hide anything.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = gsap.utils.toArray<Element>('#services [data-services-anim]');
    gsap.set(targets, { opacity: 0, y: 24 });

    const triggers = ScrollTrigger.batch(targets, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: true,
        }),
    });

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(targets, { clearProps: 'all' });
    };
  });
</script>
```

- [ ] **Step 2: Verify the gates (ScrollTrigger resolves and bundles)**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0, no "failed to resolve import 'gsap/ScrollTrigger'".
Run: `grep -o "Services.astro_astro_type_script" dist/index.html | head -1` → Expected: a match (the Services module bundled).

- [ ] **Step 3: Manual behavior check**

`npm run preview`.
- Normal: scrolling Services into view staggers the heading then the four rows in; no layout jump.
- Reduced motion: emulate `prefers-reduced-motion: reduce`, reload, scroll. Expected: no animation; all Services content visible.
- (If a browser is unavailable, say so and instead confirm from the built output that the module bundled and `#services [data-services-anim]` hooks are present in `dist/index.html`.)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Services.astro
git commit -m "feat(ui): add GSAP ScrollTrigger entrances to Services"
```

---

### Task 4: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `services_no_gold_no_legacy` (source, definitive)**

Run: `grep -c "accent-2\|bg-surface\|border-border\|text-ink\|text-muted\|card-lit\|accent-rule\|rounded-" src/components/sections/Services.astro` → Expected: `0`.
Run (green present): `grep -c "text-accent\|bg-accent\|border-accent" src/components/sections/Services.astro` → Expected: `> 0`.

- [ ] **Step 3: `services_content_decoupled` + `content_unchanged`**

Run: `grep -c "const services" src/components/sections/Services.astro` → Expected: `0`.
Run: `git diff --name-only $(git merge-base main HEAD) HEAD -- src/content` → Expected: empty.
Manually confirm the `services.ts` strings (intro + four items) are byte-identical to the original copy.

- [ ] **Step 4: `services_texture_decorative` (static)**

Run: `grep -c 'class="bt-grain" aria-hidden="true"' src/components/sections/Services.astro` → Expected: `1`.
Run: `grep -c 'aria-hidden="true"' src/components/sections/Services.astro` → Expected: `> 1` (grain + the large row numbers).

- [ ] **Step 5: `services_scrolltrigger_reduced_motion` + `cls_safe` (static + browser)**

Run: `grep -o "Services.astro_astro_type_script" dist/index.html | head -1` → Expected: a match.
Confirm no CSS pre-hide of the hooks: `grep -roh "data-services-anim]{opacity:0}" dist/_astro/*.css | wc -l` → Expected: `0` (content visible without JS).
In a browser (or note it as deferred): reduced-motion shows full content; entrances animate transform/opacity only.

- [ ] **Step 6: `lighthouse_budget_met`**

Run Lighthouse via CI (or `npx lhci autorun` if `@lhci/cli` is available) against `lighthouserc.json`. Record outputs for the PR Evidence; note R2 status.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → every task + Task 4.
- `services_no_gold_no_legacy` → Task 2 (rewrite drops gold/legacy) + Task 4 Step 2.
- `services_content_decoupled` → Task 1 + Task 4 Step 3.
- `services_scrolltrigger_reduced_motion` → Task 3 (matchMedia, hide only in motion branch, opacity) + Task 4 Step 5.
- `services_texture_decorative` → Task 2 (`.bt-grain` aria-hidden; numbers aria-hidden) + Task 4 Step 4.
- `cls_safe` → Task 3 (transform/opacity only) + Task 4 Step 5.
- `lighthouse_budget_met` → Task 4 Step 6.
- `content_unchanged` → Global Constraint + Task 1 (verbatim move) + Task 4 Step 3.
- Scope "Includes" (services.ts, ledger rewrite, ScrollTrigger, drop gold) → Tasks 1–3. "Does NOT include" → respected (no other sections, no label change, no links, gold kept globally, no `src/content` edits).

**Placeholder scan:** no TBD/TODO; every code step contains complete content.

**Type/name consistency:** `services.intro` / `services.items` (`{title,body}`), `--color-concrete-*`, `data-services-anim`, `toArray<Element>`, and the `mm`/`triggers` locals are used identically across Tasks 1–3.
