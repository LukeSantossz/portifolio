# Global CRT Scan-Beam Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one global, decorative CRT overlay (faint static scanlines + a slow top→bottom scan-beam) that unifies the terminal ambience across the whole page — pure CSS, non-blocking, legibility-safe, and removed under reduced motion — superseding the Hero-only scanline.

**Architecture:** A fixed, `aria-hidden`, `pointer-events:none` overlay added once in `Layout.astro`; its scanlines + the animated beam live in `global.css` (new `.crt-overlay` / `.crt-beam` + `@keyframes crt-sweep` + a reduced-motion rule). The redundant Hero `.bt-scanline` (div + CSS + keyframes) is removed; the per-section `.bt-grain` grain stays. No JS. ADR-0006 records the decision.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6 — plain CSS for this effect (no Tailwind utility, no GSAP, no JS).

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Static Astro only — no React, no new dependency, **no JS for the effect**.
- The overlay is **decorative**: `aria-hidden="true"`, `pointer-events: none`, not focusable, no text; it must never intercept clicks on links/buttons/inputs.
- It sits **above content** (`z-index: 30`) but **below the fixed Nav** (the header is `z-40`) and the skip-link (`z-50`); low opacity keeps text legible.
- **Reduced motion:** under `prefers-reduced-motion: reduce` the beam is removed (`display: none`); nothing flashes (no opacity/brightness flicker — only a slow positional sweep).
- **CLS-safe:** the overlay is `position: fixed` (reserves no layout) and animates `transform` only.
- Remove the now-redundant Hero `.bt-scanline` (div + `.bt-scanline` rule + `@keyframes bt-scan` + its reduced-motion reference); keep `.bt-grain`.
- Do NOT change any content, `src/data/`, `src/content/`, or any section markup other than removing the Hero scanline div.
- Record `docs/adr/0006-crt-ambient-overlay.md` + a README Engineering Decisions row.
- All output English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit harness. "Verify" = `npm run check` (0 errors) + `npm run build` (exit 0) + invariant greps + a manual **legibility** check (the primary visual gate).
- Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), CLS ≤0.1 (error), performance not regressed.

---

### Task 1: Implement the global CRT overlay (and remove the redundant Hero scanline)

Add the overlay markup + its CSS, and delete the superseded Hero scanline.

**Files:**
- Modify: `src/layouts/Layout.astro` (add the overlay element near `#cursor-glow`)
- Modify: `src/styles/global.css` (add `.crt-overlay`/`.crt-beam`/`@keyframes crt-sweep` + reduced-motion; remove `.bt-scanline`/`@keyframes bt-scan` + its reduced-motion ref)
- Modify: `src/components/sections/Hero.astro` (remove the `.bt-scanline` div)

**Interfaces:**
- Consumes: `--color-accent` (beam tint); existing stacking (`#cursor-glow` is `-z-10`, Nav header `z-40`).
- Produces: a decorative DOM layer only (no API).

- [ ] **Step 1: Add the overlay in `src/layouts/Layout.astro`**

Immediately AFTER the closing `</div>` of the `#cursor-glow` block (the `<div id="cursor-glow" …></div>`), insert:

```astro
    <!-- Decorative global CRT overlay: faint scanlines + a slow scan-beam sweep.
         Non-interactive (pointer-events:none) + aria-hidden; the beam is removed
         under prefers-reduced-motion. Supersedes the old Hero-only scanline. -->
    <div class="crt-overlay" aria-hidden="true">
      <div class="crt-beam"></div>
    </div>
```

- [ ] **Step 2: Add the CRT CSS to `src/styles/global.css`**

Add this block in the texture area (e.g. right after the `.bt-grain` rule):

```css
/* ----------------------------------------------------------------------------
   Global CRT ambient overlay — faint static scanlines + a slow scan-beam that
   sweeps top->bottom across the whole page. Decorative (the markup is
   aria-hidden + pointer-events:none). It sits above content but below the fixed
   nav (z-40) and never blocks interaction; low opacity keeps text legible. The
   beam is removed under reduced motion (see the media query below).
---------------------------------------------------------------------------- */
.crt-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
  overflow: hidden;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0 2px,
    color-mix(in srgb, #000 10%, transparent) 2px 3px
  );
}

.crt-beam {
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 28vh;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, var(--color-accent) 12%, transparent),
    transparent
  );
  animation: crt-sweep 10s linear infinite;
  will-change: transform;
}

@keyframes crt-sweep {
  from { transform: translateY(-30vh); }
  to { transform: translateY(130vh); }
}
```

- [ ] **Step 3: Remove the superseded Hero scanline CSS from `src/styles/global.css`**

Delete this entire block (the comment + keyframes + rule):

```css
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
    color-mix(in srgb, var(--color-concrete-950) 60%, transparent) 2px 3px
  );
  animation: bt-scan 6s linear infinite;
}
```

- [ ] **Step 4: Update the reduced-motion block in `src/styles/global.css`**

Find:

```css
  /* Stop continuously looping effects outright. */
  .marquee-track,
  .bt-scanline {
    animation: none !important;
  }
```

Replace with:

```css
  /* Stop continuously looping effects outright. */
  .marquee-track {
    animation: none !important;
  }

  /* Remove the CRT scan-beam entirely (it only conveys ambience). */
  .crt-beam {
    display: none !important;
  }
```

- [ ] **Step 5: Remove the Hero scanline div from `src/components/sections/Hero.astro`**

Delete the line:

```astro
  <div class="bt-scanline" aria-hidden="true"></div>
```

(Keep the `<div class="bt-grain" aria-hidden="true"></div>` immediately above it.)

- [ ] **Step 6: Verify markup, gating, and that the Hero scanline is gone**

Run: `grep -c 'class="crt-overlay" aria-hidden="true"' src/layouts/Layout.astro` → Expected: `1`.
Run: `grep -Ec "\.crt-overlay|\.crt-beam|crt-sweep" src/styles/global.css` → Expected: `>= 4` (rule + beam rule + keyframes name used twice + reduced-motion ref).
Run (pointer-events / decorative): `grep -c "pointer-events: none" src/styles/global.css` → Expected: `>= 1` for `.crt-overlay`.
Run (reduced-motion gates the beam): `grep -A1 ".crt-beam {" src/styles/global.css | grep -c "display: none"` → Expected: `1` (inside the reduced-motion media query).
Run (Hero scanline gone): `grep -c "bt-scanline" src/components/sections/Hero.astro src/styles/global.css` → Expected: `0` for both; `grep -c "bt-grain" src/components/sections/Hero.astro` → Expected: `1` (grain kept).
Run (no JS added): `git diff $(git merge-base main HEAD) HEAD -- src/layouts/Layout.astro | grep -c "addEventListener"` → Expected: `0` (no new script for the effect).

- [ ] **Step 7: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 8: Manual legibility + behavior check (the primary gate)**

`npm run preview`. Confirm: a faint scan-beam sweeps top→bottom across the whole page over a subtle scanline texture; **all body text in every section stays clearly legible** (desktop + mobile). Click links/buttons/the form under the beam — they all respond (the overlay never blocks). The Nav stays above the overlay and fully interactive. Emulate `prefers-reduced-motion: reduce` and reload — the beam is gone, content unchanged, nothing flashed. (If the scanlines/beam read too strong over text, lower the `#000 10%` and/or `var(--color-accent) 12%` values — they are single-line tunables.)

- [ ] **Step 9: Commit**

```bash
git add src/layouts/Layout.astro src/styles/global.css src/components/sections/Hero.astro
git commit -m "feat(ui): add a global CRT scan-beam ambient overlay"
```

---

### Task 2: Record ADR-0006 and link it from the README

**Files:**
- Create: `docs/adr/0006-crt-ambient-overlay.md`
- Modify: `README.md` (the Engineering Decisions table)

- [ ] **Step 1: Create `docs/adr/0006-crt-ambient-overlay.md`**

```markdown
# Add a global CRT scan-beam ambient overlay

The Concrete Terminal design leans on a CRT/terminal identity, but its only moving ambience
was a Hero-only scanline; the rest of the page was static. A single global decorative overlay
(faint scanlines + a slow top->bottom scan-beam) unifies the terminal feel across the whole
page. It is built as a non-interactive, accessibility-safe enhancement: `aria-hidden`,
`pointer-events: none`, a pure-CSS transform animation (no JS, no layout shift), and the beam
is removed under `prefers-reduced-motion`. It sits above content but at low opacity so text
stays legible; it is below the fixed nav (z-index) and never blocks interaction.

## Status

Accepted.

## Considered Options

- **Global above-content CRT overlay (chosen)**: one continuous page-wide sweep, cheapest
  (a single `transform`), and it unifies the scanlines site-wide. Risk: an above-content layer
  can hurt legibility — mitigated by low opacity, a brief beam pass, and a hard visual
  legibility gate; the fallback is a per-section behind-content beam.
- **Per-section behind-content beam**: content-safest, but it resets per section and
  multiplies across nine sections; kept as the fallback if legibility suffers.
- **Animated grid / aurora / particles / matrix / brightness flicker**: rejected — off-brand
  AI-slop and/or accessibility hazards (WCAG 2.3 flashing).

## Consequences

- The Hero-only `.bt-scanline` is removed (superseded); the per-section `.bt-grain` grain stays.
- The effect is pure CSS — no JS, `transform`-only (no CLS) — and fully removed under reduced
  motion. The scanline / beam opacities are single-line tunables if legibility needs a nudge.
```

- [ ] **Step 2: Add a README Engineering Decisions row**

Open `README.md`, find the Engineering Decisions table (the rows linking ADR-0001…0005), and add a row for ADR-0006 in the same format as the existing rows (link `docs/adr/0006-crt-ambient-overlay.md`, one-line summary: "Global CRT scan-beam ambient overlay (decorative, reduced-motion-gated)"). Match the existing column structure exactly.

- [ ] **Step 3: Verify**

Run: `test -f docs/adr/0006-crt-ambient-overlay.md && echo OK` → Expected: `OK`.
Run: `grep -c "0006-crt-ambient-overlay" README.md` → Expected: `1`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add docs/adr/0006-crt-ambient-overlay.md README.md
git commit -m "docs: record ADR-0006 for the CRT ambient overlay"
```

---

### Task 3: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `overlay_decorative` + `no_js`**

Run: `grep -c 'class="crt-overlay" aria-hidden="true"' src/layouts/Layout.astro` → Expected: `1`.
Run: `grep -A4 ".crt-overlay {" src/styles/global.css | grep -Ec "pointer-events: none|position: fixed"` → Expected: `2`.
Run: `git diff $(git merge-base main HEAD) HEAD -- src/layouts/Layout.astro src/styles/global.css | grep -Ec "addEventListener|<script"` → Expected: `0` (no JS for the effect).

- [ ] **Step 3: `beam_motion_gated` + `cls_safe`**

Run: confirm the reduced-motion media query contains `.crt-beam { display: none !important; }` — `grep -A12 "prefers-reduced-motion: reduce" src/styles/global.css | grep -c "crt-beam"` → Expected: `>= 1`.
Run (transform-only animation): `grep -A3 "@keyframes crt-sweep" src/styles/global.css | grep -Ec "transform: translateY"` → Expected: `2` (from/to).

- [ ] **Step 4: `hero_scanline_deduped`**

Run: `grep -rc "bt-scanline" src/ | grep -v ":0"` → Expected: no output (zero `bt-scanline` anywhere).
Run: `grep -c "bt-grain" src/components/sections/Hero.astro` → Expected: `1`.

- [ ] **Step 5: `adr_recorded`**

Run: `test -f docs/adr/0006-crt-ambient-overlay.md && echo OK` → Expected: `OK`.
Run: `grep -c "0006-crt-ambient-overlay" README.md` → Expected: `1`.

- [ ] **Step 6: `legibility_preserved` + `lighthouse_budget_met` (browser/CI — the primary gate)**

In a real browser at desktop and mobile widths, confirm body text in every section stays clearly legible with the overlay active, and that clicks pass through. Run Lighthouse via CI (or `npx lhci autorun`) against `lighthouserc.json`; confirm a11y ≥0.95, CLS ≤0.1, performance not regressed. Record outputs for the PR Evidence; note the R2 status. (This is the hard visual gate — if legibility suffers, lower the opacities or fall back to the per-section behind-content beam per the SPEC.)

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → Task 1 Step 7, Task 2 Step 3, Task 3 Step 1.
- `overlay_decorative` → Task 1 Steps 1-2 (aria-hidden, pointer-events:none, fixed) + Task 1 Step 6 + Task 3 Step 2.
- `beam_motion_gated` → Task 1 Step 4 + Task 3 Step 3.
- `no_js` → Global Constraint + Task 1 Step 6 + Task 3 Step 2.
- `cls_safe` → Task 1 Step 2 (fixed + transform-only) + Task 3 Step 3.
- `legibility_preserved` → Task 1 Step 8 + Task 3 Step 6 (the hard visual gate; tunable opacities).
- `hero_scanline_deduped` → Task 1 Steps 3-5 + Task 3 Step 4.
- `adr_recorded` → Task 2 + Task 3 Step 5.
- `lighthouse_budget_met` → Task 3 Step 6.
- Scope "Does NOT include" (grain/cursor-glow unchanged, no content/section change beyond the Hero scanline, no JS) → respected.

**Placeholder scan:** no TBD/TODO; every code step shows the exact markup/CSS or find→replace (the README row is described by format with the exact link/summary to insert).

**Type/name consistency:** `.crt-overlay` / `.crt-beam` / `@keyframes crt-sweep` are defined and referenced identically across the markup, the CSS, the reduced-motion rule, and the Task 3 checks; `z-index: 30` (overlay) is below the Nav header `z-40`; the removed `.bt-scanline` / `bt-scan` names are deleted everywhere.
