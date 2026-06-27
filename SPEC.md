# SPEC: chore(ui): final cleanup — remove dead legacy tokens/CSS, migrate 404, harden focus a11y

## Problem

The Concrete Terminal migration is complete, leaving dead legacy code and two deferred a11y
items. Grep-verified state:

- **Dead `[data-reveal]` system** — no component uses `data-reveal` anymore (all sections moved
  to the GSAP entrance). The five `[data-reveal*]` CSS rules, the reduced-motion
  `[data-reveal]` rule, and the `Layout.astro` IntersectionObserver "reveal" `<script>` are
  dead (its `querySelectorAll('[data-reveal]')` is always empty).
- **Dead CSS** — `.accent-rule` and `.card-lit` have zero component references.
- **Orphaned `@theme` tokens** — `--color-surface`, `--color-surface-2`, `--color-border`,
  `--color-paper-soft` have zero uses; `--color-accent-2` is used only by `.accent-rule`;
  `--color-paper` only by `.card-lit`; `--color-muted` only by `404.astro`.
- **`404.astro`** still uses the legacy `text-muted` — the last legacy-token consumer.
- **A11y deferrals** — the high-contrast `:focus-visible` ring is scoped to `#top`/`#about`
  only (the rest of the site falls back to the UA outline); the Contact field labels read
  `// Name` etc., so a screen reader announces "slash slash name".

`--color-ink` stays (it is the global `body` text color and the `::selection` color);
`details.reveal-details` + `@keyframes reveal-up` stay (used by the `ProjectCard` disclosure).

## Design Decision

A single final-cleanup pass that removes the verified-dead code/tokens, migrates the last
legacy consumer, and lands the two deferred a11y improvements — leaving the codebase with no
dead tokens and a consistent, site-wide focus ring.

- **Remove the dead `[data-reveal]` system**: the `[data-reveal]`, `[data-reveal].is-visible`,
  `[data-reveal='card']`, `[data-reveal='left']`, `[data-reveal='right']` rules, the
  reduced-motion `[data-reveal]` rule, and the Layout reveal `<script>` (the cursor-glow and
  count-up scripts stay).
- **Remove dead CSS + their now-orphaned tokens**: delete `.accent-rule` (→ remove
  `--color-accent-2`) and `.card-lit` (→ remove `--color-paper`); remove the orphaned
  `--color-surface`, `--color-surface-2`, `--color-border`, `--color-paper-soft`.
- **Migrate `404.astro`**: `text-muted` → `text-concrete-300` (→ remove `--color-muted`).
- **Harden focus a11y**: replace the `#top`/`#about`-scoped `:focus-visible` rule with a
  site-wide one (`a`/`button`/`input`/`textarea`/`[tabindex]`), keeping the 3px accent ring.
- **Label a11y**: wrap the decorative `// ` prefix of each Contact field label in
  `<span aria-hidden="true">//</span>` so the accessible name is just "Name"/"Email"/"Message"
  (the visible `// NAME` look is unchanged).

Static Astro, no new dependency. No new ADR (pure cleanup + a11y; the existing ADRs hold). Any
`@theme` token found to have zero uses during implementation (e.g. `--shadow-hard-ink`) is
removed under the same rule; any token with a use is kept.

## Alternatives Considered

- **Leave the dead code** — rejected: now that migration is done, the orphans are pure debt and
  confuse future work; removing them is safe (grep-verified zero references).
- **Keep `:focus-visible` scoped to a few sections** — rejected: a consistent site-wide visible
  focus ring is the correct a11y baseline (the Contact and Nav reviews both flagged the gap).
- **Restyle `404.astro` fully into brutalist chrome** — rejected as scope creep; only the
  legacy-token migration is in scope (the page already renders dark/legible).
- **Remove `--color-ink` / `reveal-details` / `reveal-up`** — rejected: they are live (`body`
  color / `::selection`; the ProjectCard disclosure animation).

## Scope

- Includes:
  - `src/styles/global.css`:
    - Remove the `[data-reveal]` rules (the base rule + `.is-visible` + the `card`/`left`/`right`
      variants) and the reduced-motion `[data-reveal] { … }` rule.
    - Remove the `.accent-rule` rule and the `.card-lit` rule (+ its `::before`).
    - Remove these `@theme` tokens: `--color-surface`, `--color-surface-2`, `--color-border`,
      `--color-accent-2`, `--color-paper`, `--color-paper-soft`, `--color-muted` (and
      `--shadow-hard-ink` if confirmed unused at implementation time). Keep `--color-ink`,
      `--color-canvas`, `--color-accent`, `--color-concrete-*`, the font/text/shadow-hard
      tokens.
    - Replace the `#top`/`#about`-scoped `:focus-visible` block with a site-wide
      `a, button, input, textarea, [tabindex]:focus-visible` rule (same 3px accent ring +
      offset).
    - Keep `details.reveal-details[open] > dl` + `@keyframes reveal-up`, `.bt-grain`, the CRT
      overlay, the marquee, nav, and skills rules.
  - `src/layouts/Layout.astro`: remove the `[data-reveal]` IntersectionObserver `<script>`
    block only (the cursor-glow and count-up scripts are untouched).
  - `src/pages/404.astro`: `text-muted` → `text-concrete-300`.
  - `src/components/sections/Contact.astro`: wrap the `// ` prefix of the three field labels in
    `<span aria-hidden="true">//</span>` (visible text unchanged; accessible name becomes the
    bare field name).
- Does NOT include:
  - Any visual redesign (no section restyle; the `404` keeps its layout/copy).
  - Removing `--color-ink`, `details.reveal-details`, `@keyframes reveal-up`, `.bt-grain`, or
    any live rule/token.
  - Any content / `src/data/` / `src/content/` change.
  - A new ADR.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `no_dangling_refs`: after removal, the codebase contains **zero** references to each removed
  token/class — `grep -rE "data-reveal|accent-rule|card-lit|bg-surface|surface-2|border-border|text-muted|var\(--color-(surface|surface-2|border|accent-2|paper|paper-soft|muted)\)" src` returns nothing (outside this note).
- `dead_tokens_removed`: the removed `@theme` tokens no longer appear in `global.css`'s
  `@theme` block; `--color-ink`/`--color-canvas`/`--color-accent`/`--color-concrete-*` remain.
- `reveal_script_removed`: `Layout.astro` no longer contains the `[data-reveal]` IO script; its
  cursor-glow and count-up scripts still work (`[data-countup]` still animates the Hero stats).
- `live_css_kept`: `details.reveal-details[open] > dl`, `@keyframes reveal-up`, `.bt-grain`,
  `.crt-overlay`/`.crt-beam`, and the marquee/nav/skills rules still exist.
- `focus_ring_global`: the high-contrast 3px accent `:focus-visible` ring applies to
  interactive elements site-wide (not only `#top`/`#about`); keyboard focus is visible on Nav,
  Contact, Projects, etc.
- `contact_labels_a11y`: each Contact field label's accessible name is the bare field name
  ("Name"/"Email"/"Message") — the `// ` glyphs are `aria-hidden`; the visible `// NAME` look
  is unchanged.
- `404_migrated`: `404.astro` references no `text-muted`; its body text is `text-concrete-300`.
- `content_unchanged`: `git diff` shows no `src/data/` or `src/content/` change.
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes
  (accessibility ≥0.95 — ideally improved by the focus ring — and CLS ≤0.1).

## Reproducibility

- Install: `npm install`. Build: `npm run build`; type-check: `npm run check`.
- Dead-ref sweep: the `no_dangling_refs` grep above returns empty.
- A11y: `npm run preview`; tab through Nav, the Contact form, and Projects — every focused
  element shows the green ring; inspect a Contact input's accessible name (it is the bare field
  name). Emulate reduced motion — nothing regressed (the removed `[data-reveal]` had no
  consumers).
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, Node 22 in CI.

## Risks and Assumptions

- Risk: removing a token/class that is secretly still used would break styling silently (a
  missing CSS var renders wrong without a build error). Mitigation: each removal is grep-verified
  to have zero references before AND after (the `no_dangling_refs` criterion is the gate); a
  visual pass confirms no section changed.
- Risk: removing the Layout reveal `<script>` could drop a live behavior. Mitigation: grep
  confirms zero `[data-reveal]` consumers, so the script is inert; the count-up/cursor-glow
  scripts are left untouched and independently verified.
- Risk: a broad `:focus-visible` rule could surprise on unexpected elements. Mitigation: it is
  the standard a11y baseline (visible focus everywhere) and matches the existing ring style.
- Invalidation: discovering a live `data-reveal` / `.accent-rule` / removed-token consumer
  invalidates the corresponding removal (keep it instead).
