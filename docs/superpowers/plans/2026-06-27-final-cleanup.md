# Final Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the grep-verified dead legacy tokens/CSS and the orphaned `[data-reveal]` system, migrate the last legacy consumer (`404.astro`), and land the two deferred a11y improvements (site-wide focus ring + Contact label `aria-hidden`) — leaving zero dead tokens and a consistent focus ring.

**Architecture:** All removals are grep-verified dead (zero references). The `no_dangling_refs` sweep after editing is the hard gate that nothing live was removed. `--color-ink` (body/`::selection`), `details.reveal-details` + `@keyframes reveal-up` (ProjectCard disclosure), `.bt-grain`, the CRT overlay, and the marquee/nav/skills rules are KEPT. `html.hero-intro [data-hero-anim]` is KEPT (it is `data-hero-anim`, not `data-reveal`).

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6.

## Global Constraints

Values copied verbatim from `SPEC.md`.

- Static Astro only — no new dependency. No content / `src/data/` / `src/content/` change. No ADR.
- Remove ONLY the grep-verified-dead: `[data-reveal*]` CSS + reduced-motion rule + the Layout reveal `<script>`; `.accent-rule`; `.card-lit`; `@theme` tokens `--color-surface`, `--color-surface-2`, `--color-border`, `--color-accent-2`, `--color-paper`, `--color-paper-soft`, `--color-muted`, `--shadow-hard-ink`.
- KEEP: `--color-ink`, `--color-canvas`, `--color-accent`, `--color-concrete-*`, `--shadow-hard`, the type/font tokens, `details.reveal-details` + `@keyframes reveal-up`, `.bt-grain`, `.crt-overlay`/`.crt-beam`, `html.hero-intro [data-hero-anim]`, marquee/nav/skills rules, the cursor-glow + count-up Layout scripts.
- `:focus-visible` ring becomes site-wide (`a`/`button`/`input`/`textarea`/`[tabindex]`); same 3px accent ring.
- Contact field labels: the `// ` prefix wrapped in `<span aria-hidden="true">//</span>` (visible look unchanged).
- `404.astro`: `text-muted` → `text-concrete-300`.
- Conventional Commits; **no co-author trailer.** Verify by gates (ADR-0001): `npm run check` 0 + `npm run build` 0 + the dead-ref sweep + manual a11y check.

---

### Task 1: Remove the dead `[data-reveal]` system, dead CSS, and orphaned tokens (`global.css` + `Layout.astro`)

**Files:** `src/styles/global.css`, `src/layouts/Layout.astro`

- [ ] **Step 1: `global.css` @theme — drop the dead color tokens (keep ink + accent)**

Replace the legacy color block + its trailing comment:

```css
  --color-surface: #151a16;
  --color-surface-2: #1d241e;
  --color-border: #2b332b;
  --color-ink: #e9ece3;
  --color-muted: #8b938a;
  --color-accent: #46c06a; /* grass green */
  --color-accent-2: #d6a84e; /* wheat / harvest gold */
  --color-paper: #f4f6f1; /* light "paper" — glass highlights, grids, badges */
  --color-paper-soft: #e3e8df; /* slightly greyed light, for soft light borders */

  /* --- Concrete Terminal (industrial-brutalist) design system ---------------
     Additive monochrome ramp + hard-surface + type-scale tokens. The Hero
     consumes only these plus --color-accent (green signal). Existing tokens
     above remain for the not-yet-redesigned sections. */
```

with:

```css
  --color-ink: #e9ece3; /* global body / ::selection text color */
  --color-accent: #46c06a; /* grass green — the only chromatic signal */

  /* --- Concrete Terminal (industrial-brutalist) design system ---------------
     The monochrome concrete ramp + hard-surface + type-scale tokens the whole
     (now fully migrated) site is built on, plus --color-accent. */
```

- [ ] **Step 2: `global.css` — drop the dead `--shadow-hard-ink`**

Replace:

```css
  --shadow-hard: 6px 6px 0 0 var(--color-concrete-50); /* hard-offset, no blur */
  --shadow-hard-ink: 6px 6px 0 0 var(--color-concrete-950);
```

with:

```css
  --shadow-hard: 6px 6px 0 0 var(--color-concrete-50); /* hard-offset, no blur */
```

- [ ] **Step 3: `global.css` — delete the `[data-reveal]`, `.card-lit`, and `.accent-rule` blocks**

Delete the entire contiguous region (the `[data-reveal]` comment + its 5 rules, the `.card-lit::before` block, and the `.accent-rule` block) — from `/* Scroll-driven reveal:` through the closing `}` of `.accent-rule`. Keep the `@keyframes reveal-up` above it and the `details.reveal-details[open] > dl` rule below it.

- [ ] **Step 4: `global.css` — delete the reduced-motion `[data-reveal]` rule**

Inside `@media (prefers-reduced-motion: reduce)`, delete:

```css
  /* Don't leave scroll-reveal content stuck hidden when its transition is cut. */
  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
  }
```

(Keep the universal `*` reset, `.marquee-track`, and `.crt-beam` rules.)

- [ ] **Step 5: `Layout.astro` — remove the `[data-reveal]` IntersectionObserver `<script>`**

Delete the entire `<script>` block whose body begins `// Scroll-driven reveal: fade + lift each [data-reveal] element …` (the one that does `document.querySelectorAll('[data-reveal]')`). Leave the cursor-glow script and the count-up (`[data-countup]`) script untouched.

- [ ] **Step 6: Verify gates + that live rules remain**

Run: `npm run check` → `0 errors`; `npm run build` → exit 0.
Run: `grep -Ec "reveal-details|@keyframes reveal-up|\.bt-grain|\.crt-overlay|--color-ink|--color-accent:|--color-concrete-50" src/styles/global.css` → Expected: `>= 6` (live rules/tokens kept).
Run: `grep -c "data-countup" src/layouts/Layout.astro` → Expected: `>= 1` (count-up script kept).

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro
git commit -m "chore(ui): remove dead legacy tokens, CSS, and the [data-reveal] system"
```

---

### Task 2: Migrate `404.astro` off the legacy token

**Files:** `src/pages/404.astro`

- [ ] **Step 1: Swap the body text color**

Replace `text-base leading-relaxed text-muted` → `text-base leading-relaxed text-concrete-300` on the 404 body paragraph.

- [ ] **Step 2: Verify + commit**

Run: `grep -c "text-muted" src/pages/404.astro` → Expected: `0`. Run: `npm run build` → exit 0.

```bash
git add src/pages/404.astro
git commit -m "refactor(ui): migrate 404 off the legacy text-muted token"
```

---

### Task 3: Site-wide focus ring + Contact label a11y

**Files:** `src/styles/global.css`, `src/components/sections/Contact.astro`

- [ ] **Step 1: `global.css` — extend `:focus-visible` site-wide**

Replace:

```css
/* High-contrast focus ring for Hero interactive elements. */
#top a:focus-visible,
#top button:focus-visible,
#about a:focus-visible,
#about button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}
```

with:

```css
/* High-contrast focus ring for all interactive elements, site-wide. */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}
```

- [ ] **Step 2: `Contact.astro` — aria-hidden the `// ` label glyphs**

In each of the three field labels, replace the visible text:
`            // Name` → `            <span aria-hidden="true">//</span> Name`
`            // Email` → `            <span aria-hidden="true">//</span> Email`
`            // Message` → `            <span aria-hidden="true">//</span> Message`

- [ ] **Step 3: Verify + commit**

Run: `grep -Ec "a:focus-visible|button:focus-visible|input:focus-visible" src/styles/global.css` → Expected: `>= 3`; `grep -c "#top a:focus-visible" src/styles/global.css` → Expected: `0`.
Run: `grep -c 'aria-hidden="true">//</span>' src/components/sections/Contact.astro` → Expected: `3`.
Run: `npm run check` → `0 errors`; `npm run build` → exit 0.

```bash
git add src/styles/global.css src/components/sections/Contact.astro
git commit -m "fix(a11y): site-wide focus-visible ring and aria-hidden Contact label glyphs"
```

---

### Task 4: Acceptance verification sweep

**Files:** none (verification only).

- [ ] **Step 1: `no_dangling_refs` (the hard gate)**

Run: `grep -rE "data-reveal|accent-rule|card-lit|bg-surface|surface-2|border-border|text-muted|shadow-hard-ink|var\(--color-(surface|surface-2|border|accent-2|paper|paper-soft|muted)\)" src` → Expected: **no output** (zero references anywhere in `src`).

- [ ] **Step 2: `dead_tokens_removed` + `live_kept`**

Run: `grep -Ec "color-surface|color-border|color-muted|color-accent-2|color-paper|shadow-hard-ink" src/styles/global.css` → Expected: `0`.
Run: `grep -Ec "color-ink|color-canvas|color-accent:|color-concrete-50|shadow-hard:|reveal-details|reveal-up|bt-grain|crt-overlay" src/styles/global.css` → Expected: `>= 8`.

- [ ] **Step 3: `gates` + `404` + `focus` + `labels`**

Run: `npm run check` → `0 errors`; `npm run build` → exit 0.
Run: `grep -c "text-muted" src/pages/404.astro` → `0`.
Run: `grep -c "#top a:focus-visible" src/styles/global.css` → `0`; `grep -c "a:focus-visible" src/styles/global.css` → `>= 1`.
Run: `grep -c 'aria-hidden="true">//</span>' src/components/sections/Contact.astro` → `3`.

- [ ] **Step 4: `content_unchanged` + visual/CI**

Run: `git diff --name-only c243f64 HEAD -- src/data src/content` → empty.
In a browser: tab through Nav / the Contact form / Projects — the green focus ring shows on every focused element; a Contact input's accessible name is the bare field name; no section changed visually (the removed CSS had no consumers). Run Lighthouse per `lighthouserc.json` (a11y ≥0.95, CLS ≤0.1).

---

## Self-Review (against SPEC.md)

**Spec coverage:** `no_dangling_refs` → Task 4 Step 1; `dead_tokens_removed`/`live_css_kept` → Tasks 1,3 + Task 4 Step 2; `reveal_script_removed` → Task 1 Step 5 + Task 1 Step 6 (count-up kept); `focus_ring_global` → Task 3 Step 1 + Task 4 Step 3; `contact_labels_a11y` → Task 3 Step 2 + Task 4 Step 3; `404_migrated` → Task 2 + Task 4 Step 3; `build`/`typecheck`/`content_unchanged`/`lighthouse` → Tasks' gate steps + Task 4. Scope "Does NOT include" (keep ink/reveal-details/reveal-up/live rules, no content change, no ADR) → respected.

**Placeholder scan:** no TBD/TODO; every removal/edit gives the exact target text.

**Type/name consistency:** the removed token/class names match the SPEC's verified-dead list exactly; the kept names (`--color-ink`, `reveal-details`, `reveal-up`, `.bt-grain`, `.crt-overlay`, `data-hero-anim`) are never targeted for removal.
