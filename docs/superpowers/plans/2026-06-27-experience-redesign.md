# Experience Redesign (Concrete Terminal — Service-Record Timeline) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Experience section — the last legacy-palette section — into the Concrete Terminal "service-record timeline": a hard concrete spine with square station markers (filled = work, hollow = education) plus a mono kind label, dropping harvest gold, and replacing the legacy `[data-reveal]` reveal with the site-wide fail-safe GSAP ScrollTrigger entrance.

**Architecture:** `Experience.astro` is rewritten to consume the unchanged `src/data/experience.ts` timeline and render a `border-l-2 border-concrete-700` rail of entries; each entry's `kind` field drives a filled-vs-hollow square marker (the work/education distinction) and a mono `Work`/`Education` label (the accessible, non-color/shape-alone signal). A second commit appends a `gsap.matchMedia()`-gated ScrollTrigger entrance that hides via `immediateRender:false` (so no-JS / reduced-motion / a never-firing trigger all leave content visible). The design language (ADR-0002), GSAP (ADR-0003), and ScrollTrigger as the section-motion mechanism (ADR-0004) are already recorded — no new ADR.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6, GSAP 3 (core + `gsap/ScrollTrigger`, already installed).

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core + ScrollTrigger from the existing `gsap` package — no new dependency), Node 22 in CI.
- Static Astro only — **no React, no UI framework.**
- **Content consumed, not edited:** `src/data/experience.ts` is rendered as-is; no copy is reworded and the file is not modified. No changes under `src/content/`. (`content_unchanged`.)
- Green signal = `--color-accent` (`#46c06a`); it is the **only chromatic signal** in this section. **No harvest gold** (`--color-accent-2` / `#d6a84e`) and **no legacy palette** (`border-border`, `text-ink`, `text-muted`, `.accent-rule`, `bg-surface`).
- The `--color-accent-2` token and `.accent-rule` CSS **stay defined** (still used by Contact/Nav/Footer/404/SocialLinks) — only **Experience** stops referencing them. Do not remove the tokens or touch those other files.
- Work-vs-education distinction is conveyed by **filled-vs-hollow square marker AND a text label** — never by color or shape alone (WCAG 1.4.1). The marker is `aria-hidden`; the visible `Work`/`Education` text carries the semantics.
- Reading text uses the **bright** ramp value `concrete-50` (`#ece9e2`); `concrete-300` is reserved for small secondary metadata only (period-secondary, kind label, org suffix). Rationale: the Services phase found `concrete-300` body text too dim (`b21ffab`, `dffbab8`); this avoids a repeat. Reveal hides via `opacity`/transform (never `autoAlpha`/`visibility`) so content stays in the accessibility tree.
- Accessibility baseline preserved; Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), seo ≥0.95 (error), CLS ≤0.1 (error), performance ≥0.9 (warn), best-practices ≥0.95 (warn), LCP ≤2500 (warn), TBT ≤200 (warn).
- All output in English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit-test harness by design. Each task is verified by gates — `npm run check` (0 errors) + `npm run build` (exit 0) + targeted invariant greps + a manual visual check. "Verify" below means "run these gates."
- Out of scope (do NOT do): any other section (Contact/Nav/Footer); changing the section-index label (Experience is already `06`); editing `experience.ts`; the separate coherence-audit pass over done sections; removing the global gold token / `.accent-rule`.

---

### Task 1: Rewrite `Experience.astro` to the service-record timeline

Replace the legacy-palette timeline with a Concrete Terminal rail consuming only `--color-concrete-*` + green. Square markers (filled work / hollow education) + a mono kind label carry the distinction. Add `data-experience-anim` hooks (Task 2 uses them) and a decorative grain overlay.

**Files:**
- Modify (full rewrite): `src/components/sections/Experience.astro`

**Interfaces:**
- Consumes: `timeline` (`TimelineItem[]` with `kind: 'work' | 'education'`, `role`, `org`, `period`, `description`, `highlights?`) from `src/data/experience.ts`; `--color-concrete-*` + `--color-accent` + `--text-label` tokens; `.bt-grain` (from the Hero phase).
- Produces: DOM hooks `data-experience-anim` on the heading block and each `<li>` entry (consumed by Task 2).

- [ ] **Step 1: Replace the entire contents of `src/components/sections/Experience.astro`**

```astro
---
import { timeline } from '../../data/experience.ts';
---

<section
  id="experience"
  class="relative overflow-hidden border-t-2 border-concrete-50 bg-concrete-950 text-concrete-50"
>
  <!-- Decorative analog grain (no semantics, not focusable). -->
  <div class="bt-grain" aria-hidden="true"></div>

  <div class="relative z-10 mx-auto max-w-5xl px-6 py-24 md:py-28">
    <div data-experience-anim class="mb-12 max-w-2xl">
      <p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">
        <span class="text-accent">06 / EXPERIENCE</span>
      </p>
      <h2
        class="mt-3 font-sans text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-concrete-50 md:text-6xl"
      >
        Experience &amp; education
      </h2>
    </div>

    <ol class="relative border-l-2 border-concrete-700 pl-8">
      {
        timeline.map((item) => (
          <li data-experience-anim class="relative pb-12 last:pb-0">
            {/* Square station marker on the spine: filled = work, hollow = education.
                Decorative — the visible "Work"/"Education" label below carries meaning. */}
            <span
              aria-hidden="true"
              class={`absolute -left-[39px] top-1.5 h-3 w-3 ${
                item.kind === 'work'
                  ? 'bg-accent'
                  : 'border-2 border-accent bg-concrete-950'
              }`}
            />

            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span class="font-mono text-xs uppercase tracking-[0.2em] text-concrete-50">
                {item.period}
              </span>
              <span class="font-mono text-xs uppercase tracking-[0.2em] text-concrete-300">
                {item.kind === 'work' ? 'Work' : 'Education'}
              </span>
            </div>

            <h3 class="mt-2 font-sans text-lg font-semibold text-concrete-50">
              {item.role}
              <span class="font-normal text-concrete-300"> · {item.org}</span>
            </h3>

            <p class="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-concrete-50 md:text-base">
              {item.description}
            </p>

            {item.highlights && item.highlights.length > 0 && (
              <ul class="mt-4 space-y-2">
                {item.highlights.map((h) => (
                  <li class="grid grid-cols-[auto_1fr] gap-x-3 font-sans text-sm leading-relaxed text-concrete-50">
                    <span aria-hidden="true" class="font-mono leading-relaxed text-accent">
                      ▸
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))
      }
    </ol>
  </div>
</section>
```

(Note: the marker offset `-left-[39px]` centers a 12px square on the 2px spine at `pl-8` — verify visually in Step 4 and nudge by a pixel if it sits off-spine. `Work`/`Education` is title-case in the DOM so assistive tech reads a word, not letters; CSS `uppercase` renders it as `WORK`/`EDUCATION`.)

- [ ] **Step 2: Verify no gold / no legacy palette, only concrete + green**

Run: `grep -Ec "accent-2|bg-surface|border-border|text-ink|text-muted|accent-rule|data-reveal|rounded-" src/components/sections/Experience.astro` → Expected: `0`.
Run: `grep -Ec "concrete-|text-accent|bg-accent|border-accent" src/components/sections/Experience.astro` → Expected: `> 0`.
Run: `grep -c "data-experience-anim" src/components/sections/Experience.astro` → Expected: `2` (the heading block + the `<li>` in the map; renders as 1 heading + N entries at runtime).
Run: `grep -Ec "item.kind === 'work'" src/components/sections/Experience.astro` → Expected: `2` (marker + label both branch on `kind`).

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Manual visual check**

`npm run preview`; scroll to Experience. Confirm: concrete-black section with a hard top rule; green `06 / EXPERIENCE` label; off-white display heading; a vertical concrete spine; each entry has a square marker on the spine — **solid green for work, hollow green outline for education** — the marker sitting centered on the spine; bright mono period, a quiet `WORK`/`EDUCATION` tag, a bright role with a dimmer ` · org`, a bright description, and bright highlight lines led by a green `▸`. No gold, no rounded corners, all text clearly legible.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Experience.astro
git commit -m "feat(ui): redesign Experience as a Concrete Terminal service-record timeline"
```

---

### Task 2: Add the fail-safe GSAP ScrollTrigger entrance to Experience

Animate the `data-experience-anim` elements in as they scroll into view, gated by `gsap.matchMedia()`, hiding via `gsap.from(..., {immediateRender:false})` so a never-firing trigger, reduced motion, or no-JS all leave content at its natural visible state. Mirrors the shipped `Services.astro` motion module exactly (swapping the selector/hook).

**Files:**
- Modify: `src/components/sections/Experience.astro` (append a bundled module `<script>` after `</section>`)

**Interfaces:**
- Consumes: the `data-experience-anim` hooks from Task 1 and the `gsap` package (with `gsap/ScrollTrigger`).
- Produces: runtime behavior only.

- [ ] **Step 1: Append the ScrollTrigger module at the end of `Experience.astro`**

Add to the bottom of `src/components/sections/Experience.astro` (after the closing `</section>`):

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Motion allowed: each entrance target animates in as it scrolls into view.
  // immediateRender:false means the hidden (opacity:0) state is applied ONLY when
  // the trigger fires — so if ScrollTrigger never fires (or errors), the content
  // stays at its natural, visible state. Reduced motion / no-JS never touch it.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = gsap.utils.toArray<Element>('#experience [data-experience-anim]');

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
Run: `grep -o "Experience.astro_astro_type_script" dist/index.html | head -1` → Expected: a match (the Experience module bundled).

- [ ] **Step 3: Manual behavior check**

`npm run preview`.
- Normal: scrolling Experience into view fades/slides the heading then each entry in; no layout jump.
- Reduced motion: emulate `prefers-reduced-motion: reduce`, reload, scroll. Expected: no animation; the full timeline is visible.
- (If a browser is unavailable, say so and instead confirm from the built output that the module bundled and `#experience [data-experience-anim]` hooks are present in `dist/index.html`.)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Experience.astro
git commit -m "feat(ui): add GSAP ScrollTrigger entrance to Experience"
```

---

### Task 3: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `experience_no_legacy` (source, definitive)**

Run: `grep -Ec "accent-2|bg-surface|border-border|text-ink|text-muted|accent-rule|data-reveal|rounded-|d6a84e" src/components/sections/Experience.astro` → Expected: `0`.
Run (green present): `grep -Ec "text-accent|bg-accent|border-accent|concrete-" src/components/sections/Experience.astro` → Expected: `> 0`.

- [ ] **Step 3: `work_edu_distinct` (marker + label, not color/shape alone)**

Run: `grep -Ec "item.kind === 'work'" src/components/sections/Experience.astro` → Expected: `2` (marker fill + visible label).
Run: `grep -Ec "Work|Education" src/components/sections/Experience.astro` → Expected: `> 0` (visible kind label text present, in the a11y tree).
Confirm the marker `<span>` is `aria-hidden="true"` and the `Work`/`Education` text is NOT aria-hidden.

- [ ] **Step 4: `content_unchanged`**

Run: `git diff --name-only $(git merge-base main HEAD) HEAD -- src/data/experience.ts src/content` → Expected: empty.

- [ ] **Step 5: `texture_decorative`**

Run: `grep -c 'class="bt-grain" aria-hidden="true"' src/components/sections/Experience.astro` → Expected: `1`.

- [ ] **Step 6: `motion_failsafe_and_gated` + `cls_safe` (static + browser)**

Run: `grep -o "Experience.astro_astro_type_script" dist/index.html | head -1` → Expected: a match.
Confirm no CSS pre-hide of the hooks: `grep -roh "data-experience-anim]{opacity:0}" dist/_astro/*.css | wc -l` → Expected: `0` (content visible without JS).
In a browser (or note it as deferred): emulate `prefers-reduced-motion: reduce` → full timeline visible, no animation; with motion → entrances animate transform/opacity only (no layout shift).

- [ ] **Step 7: `lighthouse_budget_met`**

Run Lighthouse via CI (or `npx lhci autorun` if `@lhci/cli` is available) against `lighthouserc.json`. Record outputs for the PR Evidence; note the R2 (pre-push Codex) status.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → Task 1 Step 3, Task 2 Step 2, Task 3 Step 1.
- `experience_no_legacy` → Task 1 (rewrite drops gold/legacy + `[data-reveal]`) + Task 1 Step 2 + Task 3 Step 2.
- `work_edu_distinct` → Task 1 (filled/hollow marker + `Work`/`Education` label, marker aria-hidden) + Task 3 Step 3.
- `motion_failsafe_and_gated` → Task 2 (matchMedia gate, `immediateRender:false`, cleanup reverts) + Task 3 Step 6.
- `content_unchanged` → Global Constraint (no `experience.ts` edit) + Task 3 Step 4.
- `reading_order_preserved` → Task 1 (document-order `<ol>`, decorative grain aria-hidden) + Task 1 Step 4 manual check.
- `texture_decorative` → Task 1 (`.bt-grain` aria-hidden) + Task 3 Step 5.
- `cls_safe` → Task 2 (transform/opacity only) + Task 3 Step 6.
- `lighthouse_budget_met` → Task 3 Step 7.
- Scope "Includes" (rewrite Experience, marker+label, drop gold/legacy, ScrollTrigger entrance, keep index `06`) → Tasks 1–2. "Does NOT include" (other sections, `experience.ts` edits, coherence sweep, removing global gold token) → respected.

**Placeholder scan:** no TBD/TODO; every code step contains the complete file/markup/module.

**Type/name consistency:** `timeline` + `item.{kind,role,org,period,description,highlights}` match `src/data/experience.ts`; `data-experience-anim`, `#experience`, `toArray<Element>`, and the `mm`/`tweens` locals are used identically across Tasks 1–2; the marker/label both branch on `item.kind === 'work'`.
