# Skills Redesign (Concrete Terminal — mono marquee) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Skills section into the Concrete Terminal language — keep its signature three-row looping marquee but drop the per-cluster rainbow, recolor the hover cluster-reveal to green, and add a GSAP ScrollTrigger entrance — without touching the skills content.

**Architecture:** Restyle the chip/legend rules in `src/styles/global.css` to monochrome + green (independent of the old per-cluster `--c` variable); rewrite `src/components/sections/Skills.astro` to consume those classes (dropping `clusterColor`/`--c`/the gold `accent-rule`), keep the marquee structure and the existing hover-highlight `<script>`, add a decorative grain and `data-skills-anim` hooks; then add a `gsap.matchMedia()`-gated ScrollTrigger entrance that reveals via `opacity` (fail-safe). Content in `src/data/skills.ts` is untouched.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6, GSAP 3 (core + `gsap/ScrollTrigger`, already installed).

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core + ScrollTrigger from the existing `gsap` package), Node 22 in CI.
- Static Astro only — **no React, no UI framework.**
- **Re-skin only — content unchanged:** do NOT change `src/data/skills.ts`; the intro copy text stays identical (only restyled). No changes under `src/content/`.
- Monochrome `--color-concrete-*` + green `--color-accent` only **in `#skills`**. Drop the per-cluster rainbow entirely (the `clusterColor` map, every per-chip `--c`). Green is the only chromatic signal.
- Keep the marquee and its infinite loop (only restyled); it already stops under `prefers-reduced-motion` via the existing `.marquee-track` rule in the reduced-motion block.
- Reveal hides with `opacity` (NOT `autoAlpha`) via `gsap.from(..., { immediateRender: false })` so content stays visible if ScrollTrigger never fires — consistent with the About/Services phases.
- The harvest-gold token `--color-accent-2` **stays defined and in use** by `Experience.astro`, `ProjectCard`, `.accent-rule` — do not remove it or touch those. Only `#skills` drops gold (its `accent-rule` and the gold cluster hue).
- Accessibility baseline preserved; Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), seo ≥0.95 (error), CLS ≤0.1 (error), performance ≥0.9 (warn), best-practices ≥0.95 (warn), LCP ≤2500 (warn), TBT ≤200 (warn).
- All output in English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit-test harness by design. Each task is verified by gates — `npm run check` (0 errors) + `npm run build` (exit 0) + targeted invariant greps + manual checks.
- Out of scope: any other section; the section-index label (Skills is already `04`); decoupling the intro line (stays in the component); the deferred site-wide `concrete-300` secondary-text brightness decision (the intro uses `concrete-300`, consistent with other sections).

---

### Task 1: Re-skin Skills to monochrome + green (CSS + markup)

Restyle the chip/legend CSS off the `--c` rainbow, and rewrite the component markup to the Concrete Terminal language while keeping the marquee structure and the hover-highlight script.

**Files:**
- Modify: `src/styles/global.css` (the `.skill-chip` / `.skill-chip.is-active` / `.skill-chip.is-dim` / `.skill-legend` / `.skill-legend.is-active` rules)
- Modify (full rewrite): `src/components/sections/Skills.astro`

**Interfaces:**
- Consumes: `skillGroups` from `src/data/skills.ts` (`{ category: string; items: string[] }[]`); `--color-concrete-*` + `--color-accent` + `--text-label`; `.bt-grain`; the existing `.marquee-row` / `.marquee-track` rules.
- Produces: DOM hooks `data-skills-anim` (heading block, marquee container, legend) for Task 2; the hover script still toggles `is-active` / `is-dim` by `data-cluster`.

- [ ] **Step 1: Restyle the chip/legend rules in `src/styles/global.css`**

Replace the existing `.skill-chip`, `.skill-chip.is-active`, `.skill-chip.is-dim`, `.skill-legend`, and `.skill-legend.is-active` rules with these (monochrome + green, no `--c`, no radius):

```css
.skill-chip {
  margin-right: 0.625rem;
  white-space: nowrap;
  border: 1px solid var(--color-concrete-700);
  background: transparent;
  color: var(--color-concrete-50);
  padding: 0.375rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  transition:
    opacity 0.3s ease,
    border-color 0.3s ease,
    background-color 0.3s ease,
    color 0.3s ease;
}

/* Same-cluster chips light up green; everything else fades back. */
.skill-chip.is-active {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 14%, transparent);
  color: var(--color-accent);
}

.skill-chip.is-dim {
  opacity: 0.25;
}

.skill-legend {
  cursor: default;
  transition: color 0.3s ease;
}

.skill-legend.is-active {
  color: var(--color-accent);
}

.skill-legend.is-active .skill-legend-marker {
  border-color: var(--color-accent);
  background: var(--color-accent);
}
```

(This removes the `border-radius`, the `--c`-based border/background/color, the `transform`, `filter`, and `box-shadow` from the old rules.)

- [ ] **Step 2: Replace the entire contents of `src/components/sections/Skills.astro`**

```astro
---
import { skillGroups } from '../../data/skills.ts';

interface Chip {
  name: string;
  cluster: string;
}

// Flatten by zipping across categories so cluster-mates are scattered through the
// carousel — they only visibly group when you hover and the cluster lights up.
const flat: Chip[] = [];
const maxLen = Math.max(...skillGroups.map((g) => g.items.length));
for (let i = 0; i < maxLen; i++) {
  for (const group of skillGroups) {
    const item = group.items[i];
    if (item) flat.push({ name: item, cluster: group.category });
  }
}

// Spread the flat list across rows that scroll in alternating directions.
const ROWS = 3;
const rows: Chip[][] = Array.from({ length: ROWS }, () => []);
flat.forEach((chip, i) => rows[i % ROWS].push(chip));

// Repeat each row so one "set" is wider than any screen, then render the set
// twice so the -50% loop is seamless at any resolution.
const REPEAT = 3;
const buildSet = (row: Chip[]) => Array.from({ length: REPEAT }, () => row).flat();

// One full-loop duration per row, slightly different so they don't sync up.
const durations = ['52s', '66s', '59s'];
---

<section
  id="skills"
  class="relative overflow-hidden border-t-2 border-concrete-50 bg-concrete-950 py-24 text-concrete-50 md:py-28"
>
  <!-- Decorative analog grain (no semantics, not focusable). -->
  <div class="bt-grain" aria-hidden="true"></div>

  <div class="relative z-10 mx-auto mb-12 max-w-6xl px-6">
    <div data-skills-anim class="max-w-2xl">
      <p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">
        <span class="text-accent">04 / SKILLS</span>
      </p>
      <h2
        class="mt-3 font-sans text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-concrete-50 md:text-6xl"
      >
        Skills &amp; stack
      </h2>
      <p class="mt-5 max-w-2xl font-sans text-base leading-relaxed text-concrete-300 md:text-lg">
        Every tool here earns its place in one of the case studies below, not on a
        logo wall. Hover any tag to surface its cluster: related tools light up and
        the rest fade back.
      </p>
    </div>
  </div>

  <!-- Full-bleed: the marquee spans the whole viewport, not the centered column. -->
  <div data-skills-anim class="skills-marquee relative z-10 space-y-3">
    {
      rows.map((row, r) => {
        const set = buildSet(row);
        return (
          <div class="marquee-row">
            <div
              class:list={['marquee-track', r % 2 === 1 && 'reverse']}
              style={`--dur:${durations[r % durations.length]}`}
            >
              {[...set, ...set].map((chip, idx) => (
                <span
                  class="skill-chip"
                  data-cluster={chip.cluster}
                  aria-hidden={idx >= row.length ? 'true' : undefined}
                >
                  {chip.name}
                </span>
              ))}
            </div>
          </div>
        );
      })
    }
  </div>

  <div class="relative z-10 mx-auto mt-8 max-w-6xl px-6">
    <ul data-skills-anim class="flex flex-wrap gap-x-5 gap-y-2">
      {
        skillGroups.map((group) => (
          <li
            class="skill-legend flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-concrete-300"
            data-cluster={group.category}
          >
            <span
              class="skill-legend-marker h-2.5 w-2.5 border border-concrete-700"
              aria-hidden="true"
            />
            {group.category}
          </li>
        ))
      }
    </ul>
  </div>
</section>

<script>
  // Hover a chip or legend entry → highlight its cluster across all rows.
  const marquee = document.querySelector<HTMLElement>('.skills-marquee');
  const legend = Array.from(document.querySelectorAll<HTMLElement>('.skill-legend'));

  if (marquee) {
    const chips = Array.from(marquee.querySelectorAll<HTMLElement>('.skill-chip'));

    const focus = (cluster: string | undefined) => {
      if (!cluster) return;
      for (const chip of chips) {
        const match = chip.dataset.cluster === cluster;
        chip.classList.toggle('is-active', match);
        chip.classList.toggle('is-dim', !match);
      }
      for (const item of legend) {
        item.classList.toggle('is-active', item.dataset.cluster === cluster);
      }
    };

    const clear = () => {
      for (const chip of chips) chip.classList.remove('is-active', 'is-dim');
      for (const item of legend) item.classList.remove('is-active');
    };

    for (const chip of chips) {
      chip.addEventListener('pointerenter', () => focus(chip.dataset.cluster));
    }
    for (const item of legend) {
      item.addEventListener('pointerenter', () => focus(item.dataset.cluster));
      item.addEventListener('pointerleave', clear);
    }
    marquee.addEventListener('pointerleave', clear);
  }
</script>
```

- [ ] **Step 3: Verify no rainbow / no gold / no legacy, and the hooks/markers are present**

Run: `grep -c "clusterColor\|--c:\|accent-2\|d6a84e\|accent-rule\|bg-surface\|border-border\|text-ink\|text-muted" src/components/sections/Skills.astro` → Expected: `0`.
Run: `grep -c "concrete-\|text-accent" src/components/sections/Skills.astro` → Expected: `> 0`.
Run: `grep -c "data-skills-anim" src/components/sections/Skills.astro` → Expected: `3` (heading, marquee, legend).
Run: `grep -c "data-cluster" src/components/sections/Skills.astro` → Expected: `2` (chip in the map + legend `<li>` in the map).

- [ ] **Step 4: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 5: Manual visual check**

`npm run preview`; scroll to Skills. Confirm: concrete-black section with a hard top rule, green "04 / SKILLS" label, the three-row marquee still looping with hard-bordered mono chips (no rounded, no rainbow); hovering a chip turns its whole cluster green and dims the rest; the legend markers turn green for the active cluster; no gold, no rainbow.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/components/sections/Skills.astro
git commit -m "feat(ui): redesign Skills marquee in Concrete Terminal (mono + green)"
```

---

### Task 2: Add GSAP ScrollTrigger entrance to Skills

Reveal the `data-skills-anim` targets (heading, marquee, legend) staggered as they scroll into view, gated by `gsap.matchMedia()`, hiding via `opacity` only (fail-safe). The marquee's own loop is independent and unchanged.

**Files:**
- Modify: `src/components/sections/Skills.astro` (append a second bundled module `<script>`)

**Interfaces:**
- Consumes: the `data-skills-anim` hooks from Task 1 and the `gsap` package (with `gsap/ScrollTrigger`).
- Produces: runtime behavior only.

- [ ] **Step 1: Append the ScrollTrigger module at the very end of `Skills.astro`**

Add after the existing hover `<script>` block (a second, separate `<script>`):

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Motion allowed: each entrance target animates in as it scrolls into view.
  // immediateRender:false means the hidden (opacity:0) state is applied ONLY when
  // the trigger fires — so if ScrollTrigger never fires (or errors), the content
  // stays visible. Reduced motion / no-JS never touch it. The marquee loop is
  // separate and unaffected.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = gsap.utils.toArray<Element>('#skills [data-skills-anim]');

    const tweens = targets.map((el) =>
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }),
    );

    return () => {
      tweens.forEach((tween) => {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
      });
      gsap.set(targets, { clearProps: 'all' });
    };
  });
</script>
```

- [ ] **Step 2: Verify the gates (ScrollTrigger resolves and bundles)**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0, no "failed to resolve import 'gsap/ScrollTrigger'".
Run: `grep -o "Skills.astro_astro_type_script" dist/index.html | head -1` → Expected: a match (a Skills module bundled).

- [ ] **Step 3: Manual behavior check**

`npm run preview`.
- Normal: scrolling Skills into view staggers the heading, marquee, and legend in; the marquee keeps looping; no layout jump.
- Reduced motion: emulate `prefers-reduced-motion: reduce`, reload, scroll. Expected: no entrance animation and the marquee loop is stopped; all content visible.
- (If a browser is unavailable, say so and confirm from the built output that the Skills module bundled and `#skills [data-skills-anim]` hooks are present in `dist/index.html`.)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Skills.astro
git commit -m "feat(ui): add GSAP ScrollTrigger entrance to Skills"
```

---

### Task 3: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `skills_no_rainbow_no_gold` + `skills_no_legacy` (source, definitive)**

Run: `grep -c "clusterColor\|--c:\|accent-2\|d6a84e\|accent-rule\|bg-surface\|border-border\|text-ink\|text-muted\|rounded-" src/components/sections/Skills.astro` → Expected: `0`.
Run: `grep -ci "5ea9ff\|d6a84e\|b07bff\|3fc9c0" src/components/sections/Skills.astro` → Expected: `0` (no per-cluster hex left).
Run (chip CSS has no `--c`): `grep -c -- "--c)" src/styles/global.css` → Expected: `0`.
Run (green present): `grep -c "concrete-\|text-accent\|--color-accent" src/components/sections/Skills.astro` → Expected: `> 0`.

- [ ] **Step 3: `cluster_hover_preserved` + `marquee_preserved` (static)**

Run: `grep -c "is-active\|is-dim\|data-cluster" src/components/sections/Skills.astro` → Expected: `> 0` (hover script intact).
Run: `grep -c "marquee-track\|skills-marquee" src/components/sections/Skills.astro` → Expected: `> 0` (marquee intact).
Run (active highlight is green): `grep -A2 "skill-chip.is-active" src/styles/global.css | grep -c "var(--color-accent)"` → Expected: `> 0`.
Manual: hover a chip → cluster turns green; reduced-motion → marquee loop stops (existing rule).

- [ ] **Step 4: `skills_texture_decorative` + `skills_entrance_reduced_motion` + `cls_safe` (static)**

Run: `grep -c 'class="bt-grain" aria-hidden="true"' src/components/sections/Skills.astro` → Expected: `1`.
Run: `grep -o "Skills.astro_astro_type_script" dist/index.html | head -1` → Expected: a match.
Run (no CSS pre-hide of hooks): `grep -roh "data-skills-anim]{opacity:0}" dist/_astro/*.css | wc -l` → Expected: `0`.

- [ ] **Step 5: `content_unchanged`**

Run: `git diff --name-only $(git merge-base main HEAD) HEAD -- src/data src/content` → Expected: empty.

- [ ] **Step 6: `lighthouse_budget_met`**

Run Lighthouse via CI (or `npx lhci autorun` if `@lhci/cli` is available) against `lighthouserc.json`. Record outputs for the PR Evidence; note R2 status.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → every task + Task 3.
- `skills_no_rainbow_no_gold` + `skills_no_legacy` → Task 1 (drop `clusterColor`/`--c`/`accent-rule`, mono CSS) + Task 3 Step 2.
- `cluster_hover_preserved` → Task 1 (hover script kept; `.is-active` recolored green) + Task 3 Step 3.
- `marquee_preserved` → Task 1 (marquee structure kept; existing reduced-motion rule) + Task 3 Step 3.
- `skills_entrance_reduced_motion` + `cls_safe` → Task 2 (matchMedia, opacity-only, immediateRender:false) + Task 3 Step 4.
- `skills_texture_decorative` → Task 1 (`.bt-grain` aria-hidden) + Task 3 Step 4.
- `lighthouse_budget_met` → Task 3 Step 6.
- `content_unchanged` → Global Constraint + Task 3 Step 5 (skills.ts/content untouched; intro copy text unchanged).
- Scope "Includes" (CSS restyle, markup rewrite, ScrollTrigger) → Tasks 1–2. "Does NOT include" → respected (no other sections, no label change, no skills.ts change, marquee kept, gold kept globally).

**Placeholder scan:** no TBD/TODO; every code step contains complete content.

**Type/name consistency:** `skillGroups` (`{category, items}`), `Chip` (`{name, cluster}`), `data-skills-anim`, `data-cluster`, `.skill-chip`/`.is-active`/`.is-dim`, `.skill-legend`/`.skill-legend-marker`, `toArray<Element>`, and the `mm`/`tweens` locals are used identically across Tasks 1–2 and match the existing `src/data/skills.ts` shape.
