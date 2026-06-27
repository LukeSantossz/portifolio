# Industrial-Brutalist Design System + Hero Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. For visual/animation fidelity, invoke the `industrial-brutalist-ui` skill (design language) and `gsap-core` skill (intro timeline) while executing Tasks 3–4.

**Goal:** Introduce a reusable "Concrete Terminal" industrial-brutalist design system (tokens + texture patterns) and redesign the Hero as its flagship, keeping the site static Astro with content decoupled and the accessibility/Lighthouse baseline intact.

**Architecture:** Add monochrome-concrete + single-green design tokens and CSS-only texture/focus patterns to `src/styles/global.css`; rewrite `src/components/sections/Hero.astro` to consume only those tokens (no harvest gold) with hard borders, hard-offset shadows and extreme type-scale contrast; drive a load-time intro with a GSAP timeline gated by `gsap.matchMedia()`, behind a pre-paint anti-FOUC class with a failsafe so no-JS/reduced-motion always show the final content.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (via PostCSS), TypeScript 6, GSAP 3 (core only, to be added), `@fontsource-variable/inter` + `@fontsource-variable/jetbrains-mono` (already installed).

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (to be added), Node 22 in CI (local toolchain Node 26 / npm 11).
- Static Astro only — **no React, no shadcn/ui, no UI framework.**
- **Content unchanged:** no edits under `src/data/*` or `src/content/projects/*` (`content_unchanged` criterion — verified by `git diff`).
- The harvest-gold token `--color-accent-2` **stays defined** in `global.css`; only its **Hero-scope usage is dropped** this phase. Do not remove it globally or restyle non-Hero usages.
- Green signal = the existing `--color-accent` (`#46c06a`). It is the only chromatic signal in the Hero.
- Accessibility baseline preserved; the existing Lighthouse CI budget (`lighthouserc.json`) must still pass: `accessibility ≥ 0.95` (error), `seo ≥ 0.95` (error), `cumulative-layout-shift ≤ 0.1` (error), `performance ≥ 0.9` (warn), `best-practices ≥ 0.95` (warn), `largest-contentful-paint ≤ 2500ms` (warn), `total-blocking-time ≤ 200ms` (warn).
- All output in English. Commits follow Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** there is no unit-test harness. Each task is verified by the binding gates — `npm run check` (0 errors) + `npm run build` (exit 0) + targeted invariant greps + a manual checklist — plus the Lighthouse budget at the end. "Run the test" steps below mean "run these gates."
- Out of scope (do NOT do here): redesign of any other section; re-implementing the hero-stat count-up in GSAP (it stays as-is in `Layout.astro`, keyed on `[data-countup]`); migrating the global `[data-reveal]` reveals; adding ScrollTrigger.

---

### Task 1: Add Concrete Terminal design tokens to `global.css`

Introduces the monochrome ramp, hard-offset shadow tokens, and display/label type-scale tokens, additively (existing tokens stay for the other, not-yet-redesigned sections).

**Files:**
- Modify: `src/styles/global.css:8-22` (the `@theme` block)

**Interfaces:**
- Produces (Tailwind v4 auto-generates utilities from these `@theme` custom properties; later tasks rely on these exact names):
  - Colors → `bg-stone-950 text-stone-950`, `…-stone-900`, `…-stone-700`, `…-stone-300`, `…-stone-50` (monochrome ramp), and the existing `…-accent` (green signal).
  - Shadow → `shadow-hard` (off-white hard offset), `shadow-hard-ink` (near-black hard offset).
  - Text size → `text-display` (extreme display), `text-label` (mono label).

- [ ] **Step 1: Add the tokens inside the existing `@theme` block**

In `src/styles/global.css`, immediately after the existing `--color-paper-soft` line (line 18) and before the `--font-sans` line (line 20), insert the Concrete Terminal tokens:

```css
  /* --- Concrete Terminal (industrial-brutalist) design system ---------------
     Additive monochrome ramp + hard-surface + type-scale tokens. The Hero
     consumes only these plus --color-accent (green signal). Existing tokens
     above remain for the not-yet-redesigned sections. */
  --color-stone-950: #0e0e0e; /* concrete near-black — Hero background */
  --color-stone-900: #161616; /* raised concrete surface */
  --color-stone-700: #3a3a3a; /* hard rule / divider on dark */
  --color-stone-300: #b8b5ad; /* muted off-white — secondary text */
  --color-stone-50: #ece9e2; /* off-white ink — primary text on concrete */

  --shadow-hard: 6px 6px 0 0 var(--color-stone-50); /* hard-offset, no blur */
  --shadow-hard-ink: 6px 6px 0 0 var(--color-stone-950);

  --text-display: clamp(3rem, 11vw, 8.5rem); /* extreme display scale */
  --text-label: 0.75rem; /* mono label scale (paired with tracking/uppercase) */
```

- [ ] **Step 2: Verify the gates**

Run: `npm run check`
Expected: `0 errors`.

Run: `npm run build`
Expected: exit 0, "Complete!".

- [ ] **Step 3: Verify the tokens compile to utilities**

Run: `node -e "const c=require('fs').readFileSync('dist/index.html','utf8'); process.exit(0)"` then visually confirm in a later task; for now assert the source contains the tokens:

Run: `grep -c -- "--color-stone-950\|--shadow-hard\|--text-display" src/styles/global.css`
Expected: `3` (or higher).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(ui): add Concrete Terminal design tokens"
```

---

### Task 2: Add brutalist texture + focus CSS patterns to `global.css`

The patterns Tailwind utilities cannot express cleanly: a static grain overlay, an animated scanline (disabled under reduced motion), and high-contrast Hero focus rings. Surface/label/button patterns are expressed as utilities in Task 3.

**Files:**
- Modify: `src/styles/global.css` (append a new section before the `@media (prefers-reduced-motion: reduce)` block at line 376; and add two lines inside that block)

**Interfaces:**
- Produces: classes `.bt-grain`, `.bt-scanline` (decorative overlays, used with `aria-hidden`), and `html.hero-intro [data-hero-anim]` pre-paint hide rule; Hero `:focus-visible` ring. Consumed by Tasks 3 and 4.

- [ ] **Step 1: Append the texture + focus + intro-hide rules**

In `src/styles/global.css`, immediately **before** the line `@media (prefers-reduced-motion: reduce) {` (line 376), insert:

```css
/* ----------------------------------------------------------------------------
   Concrete Terminal texture + interaction patterns (Hero scope).
   Overlays are decorative (always aria-hidden + pointer-events:none in markup).
---------------------------------------------------------------------------- */

/* Cheap static film grain — one inline SVG noise tile, no animation. */
.bt-grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.06;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
}

/* CRT-style scanlines — static lines with a slow drift; drift is killed under
   reduced motion (the lines themselves remain). */
@keyframes bt-scan {
  from { background-position: 0 0; }
  to { background-position: 0 6px; }
}

.bt-scanline {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.4;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0 2px,
    color-mix(in srgb, var(--color-stone-950) 60%, transparent) 2px 3px
  );
  animation: bt-scan 6s linear infinite;
}

/* High-contrast focus ring for Hero interactive elements. */
#top a:focus-visible,
#top button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

/* Pre-paint anti-FOUC: when the intro will run (motion allowed, JS on), the
   intro targets start hidden so GSAP can animate them in without a flash. The
   class is set by an is:inline script and removed by GSAP (or a failsafe). It
   is NEVER set under reduced motion, so reduced-motion users see final content. */
html.hero-intro [data-hero-anim] {
  opacity: 0;
}
```

- [ ] **Step 2: Disable the scanline drift under reduced motion**

Inside the existing `@media (prefers-reduced-motion: reduce)` block, add `.bt-scanline` to the "stop continuously looping effects" list. Change:

```css
  .marquee-track,
  .hero-grid,
  .headline-gradient,
  .cursor-blink,
  .float-badge,
  .scroll-wheel {
    animation: none !important;
  }
```

to:

```css
  .marquee-track,
  .hero-grid,
  .headline-gradient,
  .cursor-blink,
  .float-badge,
  .scroll-wheel,
  .bt-scanline {
    animation: none !important;
  }
```

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(ui): add brutalist grain, scanline and focus patterns"
```

---

### Task 3: Rewrite `Hero.astro` to the Concrete Terminal language

Replace the soft "agribusiness-green minimal" Hero with the brutalist Hero: monochrome concrete background, extreme display headline, mono labels, hard-bordered/ hard-shadow CTAs and proof grid, one green-signal stat, decorative grain + scanline overlays. Consumes only the monochrome ramp + `--color-accent`. No `--color-accent-2`. Adds `data-hero-anim` hooks for the Task 4 intro. Content fields from `site.*` are all preserved.

**Files:**
- Modify (full rewrite of the markup): `src/components/sections/Hero.astro`
- Modify (remove now-dead Hero-only CSS, guarded by grep): `src/styles/global.css`

**Interfaces:**
- Consumes: tokens/utilities from Tasks 1–2 (`bg-stone-950`, `text-stone-50/300`, `text-accent`, `shadow-hard`, `.bt-grain`, `.bt-scanline`); `site.availability`, `site.name`, `site.role`, `site.headline`, `site.cvPath`, `site.heroStats` (array of `{ value: string; label: string }`); `SocialLinks`, `Icon` (`name`, `size`).
- Produces: DOM hooks `data-hero-anim` + `data-hero-label | data-hero-headline | data-hero-role | data-hero-sub | data-hero-cta | data-hero-stat`, consumed by Task 4. `data-countup` on each stat value is preserved for the existing Layout count-up.

- [ ] **Step 1: Replace the entire contents of `src/components/sections/Hero.astro`**

```astro
---
import { site } from '../../data/site.ts';
import SocialLinks from '../ui/SocialLinks.astro';
import Icon from '../ui/Icon.astro';
---

<section
  id="top"
  class="relative min-h-screen overflow-hidden bg-stone-950 text-stone-50"
>
  <!-- Decorative analog texture (no semantics, not focusable). -->
  <div class="bt-grain" aria-hidden="true"></div>
  <div class="bt-scanline" aria-hidden="true"></div>

  <div
    class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 pb-16 pt-32 md:pt-36"
  >
    <!-- Index + availability label (recruiter smell test). -->
    <p
      data-hero-anim
      data-hero-label
      class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label uppercase tracking-[0.25em] text-stone-300"
    >
      <span class="text-accent">01 / HELLO</span>
      <span aria-hidden="true" class="text-stone-700">//</span>
      <span class="normal-case tracking-normal">{site.availability}</span>
    </p>

    <!-- Display headline: name, extreme scale. -->
    <h1
      data-hero-anim
      data-hero-headline
      class="mt-6 font-sans text-display font-black uppercase leading-[0.9] tracking-[-0.03em] text-stone-50"
    >
      {site.name}
    </h1>

    <!-- Role, mono label. -->
    <p
      data-hero-anim
      data-hero-role
      class="mt-4 font-mono text-lg uppercase tracking-[0.2em] text-accent md:text-xl"
    >
      {site.role}
    </p>

    <!-- Positioning line, long-form body. -->
    <p
      data-hero-anim
      data-hero-sub
      class="mt-6 max-w-2xl font-sans text-base leading-relaxed text-stone-300 md:text-lg"
    >
      {site.headline}
    </p>

    <!-- CTAs + social: hard-bordered blocks with hard-offset shadow. -->
    <div
      data-hero-anim
      data-hero-cta
      class="mt-10 flex flex-wrap items-center gap-4"
    >
      <a
        href="#projects"
        class="inline-flex items-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-stone-950 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
      >
        View projects
        <Icon name="arrow-right" size={18} />
      </a>
      <a
        href={site.cvPath}
        download
        class="inline-flex items-center gap-2 border-2 border-stone-50 bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-stone-50 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
      >
        <Icon name="download" size={18} />
        Download CV
      </a>
      <div class="ml-1 flex items-center gap-4">
        <SocialLinks />
      </div>
    </div>

    <!-- Proof strip: hard-bordered grid; the first stat is the green signal. -->
    <dl class="mt-14 grid max-w-4xl grid-cols-1 border-2 border-stone-50 sm:grid-cols-3">
      {
        site.heroStats.map((stat, index) => (
          <div
            data-hero-anim
            data-hero-stat
            class={`border-stone-50 p-5 ${
              index > 0 ? 'border-t-2 sm:border-l-2 sm:border-t-0' : ''
            }`}
          >
            <dt
              class={`font-mono text-3xl font-bold ${
                index === 0 ? 'text-accent' : 'text-stone-50'
              }`}
              data-countup
            >
              {stat.value}
            </dt>
            <dd class="mt-2 font-mono text-xs leading-snug text-stone-300">
              {stat.label}
            </dd>
          </div>
        ))
      }
    </dl>
  </div>

  <!-- Scroll cue. -->
  <a
    href="#about"
    aria-label="Scroll to content"
    class="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-label uppercase tracking-[0.25em] text-stone-300 transition-colors hover:text-accent md:block"
  >
    Scroll ↓
  </a>
</section>
```

- [ ] **Step 2: Verify the Hero references no harvest gold and only monochrome + green**

Run: `grep -c "accent-2\|headline-gradient\|color-paper\|bg-surface\|text-ink\|border-border" src/components/sections/Hero.astro`
Expected: `0` (the Hero no longer uses the old palette or gold).

Run: `grep -c "stone-\|text-accent\|bg-accent\|border-accent" src/components/sections/Hero.astro`
Expected: `> 0` (monochrome ramp + green only).

- [ ] **Step 3: Remove now-dead Hero-only CSS (guarded)**

Confirm each class/keyframe is used **only** by the old Hero before deleting. Run:

```bash
grep -rn "headline-gradient\|hero-grid\|cursor-blink\|scroll-wheel\|class=\"reveal\b\|class='reveal\b" src --include=*.astro
```

Expected: **no matches** (the rewritten Hero dropped them; other sections use `[data-reveal]`, `.float-badge`, `.accent-rule`, which stay). If — and only if — there are no matches, delete from `src/styles/global.css` these now-unused blocks: the `.reveal` rule + `@keyframes reveal-up` is **kept** (still used by `details.reveal-details[open] > dl`); delete `@keyframes headline-flow` + `.headline-gradient`, `@keyframes grid-wave` + `.hero-grid`, `@keyframes cursor-blink` + `.cursor-blink`, `@keyframes scroll-wheel` + `.scroll-wheel`, and remove `.headline-gradient`, `.cursor-blink`, `.hero-grid`, `.scroll-wheel` from the reduced-motion `animation: none` list. If any block has a match outside the Hero, leave it untouched and note it.

- [ ] **Step 4: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 5: Manual visual check**

Run: `npm run preview` and open the served URL. Confirm: concrete-black Hero, off-white display name, green role label + green first stat, hard-bordered CTAs/grid with offset shadow, grain + faint scanline visible. No green-tinted soft panels, no gold.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.astro src/styles/global.css
git commit -m "feat(ui): redesign Hero in Concrete Terminal language"
```

---

### Task 4: Add GSAP and the Hero intro timeline

Add the `gsap` dependency and a load-time intro that staggers the Hero label → headline → role → sub → CTAs → stats, gated by `gsap.matchMedia()`. A pre-paint `is:inline` script hides the targets only when motion is allowed and arms a failsafe; GSAP reveals them and clears the hide. No-JS and reduced-motion always show the final content; transforms/opacity only (no layout shift → protects CLS).

**Files:**
- Modify: `package.json` (add `gsap` dependency)
- Modify: `src/components/sections/Hero.astro` (add an `is:inline` pre-paint script + a bundled module `<script>` at the end of the component)

**Interfaces:**
- Consumes: `[data-hero-anim]` + per-element hooks and `html.hero-intro [data-hero-anim] { opacity: 0 }` from Tasks 2–3.
- Produces: runtime behavior only (no new exported symbols).

- [ ] **Step 1: Add the dependency**

Run: `npm install gsap@^3.13.0`
Expected: `package.json` gains `"gsap": "^3.13.0"` under `dependencies`; `package-lock.json` updates.

- [ ] **Step 2: Add the pre-paint failsafe script**

In `src/components/sections/Hero.astro`, as the **first child** of `<section id="top">` (before `.bt-grain`), add:

```astro
  <!-- Pre-paint: arm the intro only when motion is allowed and JS runs; a
       failsafe reveals the content if the GSAP module never loads. -->
  <script is:inline>
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      document.documentElement.classList.add('hero-intro');
      window.setTimeout(function () {
        document.documentElement.classList.remove('hero-intro');
      }, 2000);
    }
  </script>
```

- [ ] **Step 3: Add the GSAP intro module at the end of the component**

Append to the bottom of `src/components/sections/Hero.astro` (after the closing `</section>`):

```astro
<script>
  import gsap from 'gsap';

  const root = document.documentElement;
  const reveal = () => root.classList.remove('hero-intro');

  const mm = gsap.matchMedia();

  // Motion allowed: play the staggered intro, then clear the pre-paint hide.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.set('[data-hero-anim]', { autoAlpha: 0, y: 24 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.7 },
      onComplete: reveal,
    });

    tl.to('[data-hero-label]', { autoAlpha: 1, y: 0 })
      .to('[data-hero-headline]', { autoAlpha: 1, y: 0 }, '-=0.45')
      .to('[data-hero-role]', { autoAlpha: 1, y: 0 }, '-=0.5')
      .to('[data-hero-sub]', { autoAlpha: 1, y: 0 }, '-=0.5')
      .to('[data-hero-cta]', { autoAlpha: 1, y: 0 }, '-=0.5')
      .to('[data-hero-stat]', { autoAlpha: 1, y: 0, stagger: 0.1 }, '-=0.4');

    return () => {
      tl.kill();
      gsap.set('[data-hero-anim]', { clearProps: 'all' });
      reveal();
    };
  });

  // Reduced motion: never animate; ensure nothing stays hidden.
  mm.add('(prefers-reduced-motion: reduce)', () => {
    reveal();
    return () => {};
  });
</script>
```

- [ ] **Step 4: Verify the gates (GSAP resolves and bundles)**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0; build output shows the client script bundled (no "failed to resolve import 'gsap'").

- [ ] **Step 5: Manual behavior check**

Run: `npm run preview`.
- Normal: on load the Hero elements stagger in (label → headline → role → sub → CTAs → stats); no flash of all-visible-then-hidden; no layout jump.
- Reduced motion: in DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", reload. Expected: **no** intro animation; all Hero content visible immediately.
- Failsafe: in DevTools Network, block `*gsap*`, reload (motion on). Expected: content becomes visible within ~2s (failsafe), not stuck hidden.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/components/sections/Hero.astro
git commit -m "feat(ui): add GSAP-driven Hero intro behind matchMedia"
```

---

### Task 5: Promote ADRs for the design language and GSAP, index them in the README

The SPEC flags two durable, hard-to-reverse decisions for promotion at the Gate: adopting the industrial-brutalist language, and adding GSAP as the motion library.

**Files:**
- Create: `docs/adr/0002-industrial-brutalist-design-language.md`
- Create: `docs/adr/0003-gsap-as-motion-library.md`
- Modify: `README.md` (add two rows to the Engineering Decisions table)

**Interfaces:** documentation only.

- [ ] **Step 1: Create ADR-0002**

Create `docs/adr/0002-industrial-brutalist-design-language.md`:

```markdown
# Adopt the "Concrete Terminal" industrial-brutalist design language

The portfolio read as a soft "agribusiness-green minimal" site that gave a technical
recruiter no distinctive visual signal in the first scroll. We adopt an
industrial/brutalist design language — "Concrete Terminal" — and ship it in phases:
phase one introduces a reusable design system (monochrome concrete/black/off-white
ramp with green as the single signal, mono-forward typography with extreme
display-vs-label contrast, hard borders + hard-offset shadows, decorative grain and a
Hero-only scanline) and redesigns the Hero as the flagship. Remaining sections follow
in later, separate SPECs.

## Status

Accepted.

## Considered Options

- **"Concrete Terminal" phased (chosen)**: ship the design system + Hero pilot first,
  migrate other sections later. Validates the language at low risk.
- **"Blueprint / Declassified" heavier industrial**: visible technical grid, heavy
  degradation, pinned/scrubbed Hero. Rejected for now — performance and accessibility
  risk, over-styled for a recruiter audience.
- **"Quiet Brutalist" (minimal motion, no texture)**: rejected — too close to the
  current restrained look, would not deliver a distinctive identity.
- **Full monochrome, drop green entirely**: rejected — loses brand recognition; green
  stays as the single signal.
- **Big-bang redesign of every section at once**: rejected — larger risk, oversized
  hard-to-review change; a phased pilot is safer.

## Consequences

- A reusable token + pattern layer lands in `src/styles/global.css`; the Hero consumes
  only the monochrome ramp + green. The harvest-gold token stays defined but unused in
  the Hero scope.
- Later phases migrate the remaining sections to the language under their own SPECs.
- Verification follows ADR-0001 (build + type-check + Lighthouse + manual checklist).
```

- [ ] **Step 2: Create ADR-0003**

Create `docs/adr/0003-gsap-as-motion-library.md`:

```markdown
# Use GSAP as the motion library for the Hero intro

The Hero needs a controlled, staggered load-time intro. We add GSAP (core only) and
gate it behind `gsap.matchMedia()` for `prefers-reduced-motion` and breakpoints, with a
pre-paint anti-FOUC class and a failsafe so no-JS and reduced-motion users always see
the final content. The intro animates transforms/opacity only, so it does not shift
layout (protects the CLS budget).

## Status

Accepted.

## Considered Options

- **GSAP core + matchMedia (chosen)**: framework-agnostic, works in static Astro with no
  React, precise timeline/stagger control, first-class reduced-motion gating.
- **CSS keyframes only** (as today's `.reveal`): no JS payload, but awkward to sequence a
  multi-step stagger and to coordinate a single reduced-motion gate; less control.
- **A React animation library (Framer Motion / gsap-react)**: rejected — would require
  introducing React, which is explicitly out of scope.

## Consequences

- Adds the `gsap` dependency (core import only, deferred/bundled by Astro). The Lighthouse
  performance budget is watched; if it breaks, reduce the motion scope per the SPEC.
- ScrollTrigger and migrating the global `[data-reveal]` reveals to GSAP are deferred to
  later phases.
- Verification follows ADR-0001.
```

- [ ] **Step 3: Add the README Engineering Decisions rows**

In `README.md`, in the Engineering Decisions table, after the ADR-0001 row added earlier, add:

```markdown
| Industrial-brutalist "Concrete Terminal" design language, shipped in phases | Heavier "Blueprint" industrial, quiet brutalist, big-bang redesign | A phased pilot delivers a distinctive recruiter-facing identity at low risk; other sections migrate later. See [ADR-0002](docs/adr/0002-industrial-brutalist-design-language.md). |
| GSAP (core) for the Hero intro, gated by `matchMedia` | CSS keyframes only; a React animation library | Precise reduced-motion-gated stagger in static Astro without introducing React. See [ADR-0003](docs/adr/0003-gsap-as-motion-library.md). |
```

- [ ] **Step 4: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add docs/adr/0002-industrial-brutalist-design-language.md docs/adr/0003-gsap-as-motion-library.md README.md
git commit -m "docs: record brutalist design language and GSAP ADRs"
```

---

### Task 6: Acceptance verification sweep

Confirm every SPEC acceptance criterion against the built site. No code; produces the evidence for the PR. (No commit unless a fix is needed — if a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `hero_renders_no_gold`**

Run: `npm run build` then `grep -ric "accent-2\|d6a84e" dist/index.html`
Expected: `0` (no harvest-gold value or token in the rendered Hero/page).

- [ ] **Step 3: `tokens_monochrome_plus_green` + `content_unchanged`**

Run: `grep -c -- "--color-stone-\|--shadow-hard\|--text-display" src/styles/global.css` → Expected: `> 0`.
Run: `git diff --name-only main..HEAD -- src/data src/content`
Expected: **empty** (no content changes).

- [ ] **Step 4: `hero_intro_respects_reduced_motion` + `texture_is_decorative` + `focus_visible_preserved`**

`npm run preview`, then manually confirm:
- Reduced-motion emulation → no intro animation, full content shown.
- Grain + scanline elements have `aria-hidden="true"`, are not in the tab order, and carry no text (inspect DOM).
- Tab through the Hero → each link/button shows the green high-contrast `:focus-visible` ring; the "Skip to content" link still appears on focus and jumps to `#main`.

- [ ] **Step 5: `lighthouse_budget_met`**

If `@lhci/cli` is available: `npx lhci autorun` (uses `lighthouserc.json`).
Otherwise rely on the CI Lighthouse job on the PR. Expected: assertions pass — `accessibility ≥ 0.95`, `seo ≥ 0.95`, `cumulative-layout-shift ≤ 0.1` (errors must pass); performance/best-practices/LCP/TBT warnings within budget.

- [ ] **Step 6: Record evidence**

Capture the command outputs (check, build, greps, Lighthouse) for the PR's Evidence and Self-Review sections per `.standards/docs/standards/github.md`. Note R2 status (Codex present/absent) in the PR Review Checklist.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`, `typecheck_clean` → gate steps in every task + Task 6.
- `hero_renders_no_gold` → Task 3 (rewrite drops gold/`headline-gradient`) + Task 6 Step 2.
- `tokens_monochrome_plus_green` → Task 1 (tokens) + Task 3 (Hero consumes only them) + Task 6 Step 3.
- `hero_intro_respects_reduced_motion` → Task 4 (matchMedia reduce branch + pre-paint gate) + Task 6 Step 4.
- `texture_is_decorative` → Task 3 (`aria-hidden` overlays, `pointer-events:none` via `.bt-grain/.bt-scanline`) + Task 6 Step 4.
- `focus_visible_preserved` → Task 2 (focus ring) + Layout skip-link untouched + Task 6 Step 4.
- `lighthouse_budget_met` → transforms/opacity-only intro + watched in Task 6 Step 5.
- `content_unchanged` → enforced as a Global Constraint + Task 6 Step 3.
- Scope "Includes" tokens/patterns/Hero/GSAP/accessibility → Tasks 1–4. ADR candidates → Task 5.
- Scope "Does NOT include" → respected (no other section, no count-up-in-GSAP, no ScrollTrigger, no React, no content edits, gold token kept).

**Placeholder scan:** no TBD/TODO; every code step contains complete, runnable content.

**Type/name consistency:** token names (`stone-950/900/700/300/50`, `shadow-hard`, `text-display`, `text-label`), DOM hooks (`data-hero-anim`, `data-hero-{label,headline,role,sub,cta,stat}`), and the `hero-intro` class are used identically across Tasks 1–4.
