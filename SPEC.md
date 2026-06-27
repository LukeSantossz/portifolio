# SPEC: feat(ui): adopt industrial-brutalist design system and redesign Hero

## Problem

The portfolio reads as a soft "agribusiness-green minimal" site that gives a
technical recruiter no distinctive visual signal, so it does not stand out in the
first scroll the way its case-study content is meant to.

## Design Decision

Adopt an industrial/brutalist design language — "Concrete Terminal" — and ship it
in phases. The first phase introduces a reusable design system and redesigns the
Hero as the flagship that proves the language; the remaining sections follow in
later, separate SPECs. The language is: a monochrome concrete/black/off-white
palette with green as the single signal color (harvest gold is dropped from the
Hero scope); mono-forward typography with extreme display-vs-label scale contrast;
hard borders and hard-offset shadows with no rounded corners; a cheap static grain
overlay plus a Hero-only scanline, both decorative; and a GSAP intro timeline on
the Hero, gated behind `gsap.matchMedia()` for `prefers-reduced-motion` and
breakpoints. The project stays static Astro (no React), keeps content decoupled in
`src/data` and `src/content`, and preserves the existing accessibility baseline.

## Alternatives Considered

- **"Blueprint / Declassified" (heavier industrial)** — rejected for this phase:
  visible technical grid, heavy degradation textures, and a pinned/scrubbed Hero
  raise performance and accessibility risk and over-style the page for a recruiter
  audience. It can be revisited once the base language is validated.
- **"Quiet Brutalist" (minimal motion, no texture)** — rejected: too close to the
  current restrained look, so it would not deliver the distinctive identity that is
  the entire reason for the redesign.
- **Full monochrome, drop green entirely (palette C)** — rejected: loses brand
  recognition; the chosen palette keeps green as the single signal (palette B).
- **Big-bang redesign of every section at once** — rejected: larger risk and an
  oversized, hard-to-review SPEC; a phased pilot validates the language first
  (scope A).

## Scope

- Includes:
  - Design tokens in `src/styles/global.css` `@theme`: a monochrome ramp
    (concrete / ink / off-white), a single green signal token (the existing
    `--color-accent` green), hard-border and hard-offset-shadow tokens, and a
    type-scale + font-role set (JetBrains Mono for labels/UI/numbers, the existing
    grotesque/Inter for long-form body).
  - Base brutalist surface and typography patterns (hard border, hard-offset
    shadow, mono label) expressed primarily as Tailwind utilities, with only the
    patterns utilities cannot express cleanly added to `global.css`.
  - Redesign of `src/components/sections/Hero.astro` to the Concrete Terminal
    language: layout, extreme type-scale contrast, hard surfaces, green-signal stat,
    and an optional decorative static grain + Hero-only scanline overlay.
  - Introduce the `gsap` dependency (core) and a Hero motion module
    (e.g. a Hero `<script>` or `src/scripts/motion.ts`): an intro timeline that
    staggers the hero label, headline, and stats on load, wrapped in
    `gsap.matchMedia()`.
  - Accessibility: high-contrast `:focus-visible` styles on Hero interactive
    elements, preserved skip-link, all decorative texture marked `aria-hidden`, and
    the Hero intro disabled under `prefers-reduced-motion` (final state shown).
- Does NOT include:
  - Redesign of any other section (About, Services, Skills, Projects, Experience,
    Contact, Nav, Footer) — each is a later SPEC.
  - Re-implementing the existing hero-stat count-up in GSAP, migrating the global
    `[data-reveal]` reveals in `Layout.astro`, or adding ScrollTrigger — all
    deferred to the later section-reveal phases. The current count-up stays as-is.
  - Introducing React, shadcn/ui, or any UI framework.
  - Any change to copy or data in `src/data/*` or `src/content/projects/*` (content
    stays decoupled and unchanged).
  - Removing the harvest-gold token globally (only its Hero-scope usage is dropped
    this phase) or restyling non-Hero usages of it.
  - The open conformity decisions tracked separately: commit-format policy (C-1),
    test-harness introduction, R2 cross-provider wiring, and the `CLAUDE.md` →
    `.standards` import repoint.

## Acceptance Criteria

Verifiable conditions for this phase. Automated where a check exists; otherwise a
named manual verification. (No unit-test harness exists yet; introducing one is a
separate decision, so behavioral criteria below are verified by build, type-check,
the existing Lighthouse budget, and explicit manual checks.)

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `hero_renders_no_gold`: the rendered Hero references no harvest-gold
  (`--color-accent-2`) value; green is the only chromatic signal.
- `tokens_monochrome_plus_green`: `global.css @theme` defines the monochrome ramp
  and a single green signal token, and the Hero consumes only those.
- `hero_intro_respects_reduced_motion`: under emulated `prefers-reduced-motion:
  reduce`, the Hero intro timeline does not animate and the final content is shown.
- `texture_is_decorative`: grain and scanline overlays are `aria-hidden`, not
  focusable, and contribute no text content.
- `focus_visible_preserved`: keyboard focus shows a visible high-contrast focus
  style on every Hero interactive element, and the skip-link still works.
- `lighthouse_budget_met`: the existing Lighthouse CI budget (`lighthouserc.json`)
  still passes.
- `content_unchanged`: `git diff` shows no changes under `src/data/` or
  `src/content/`.

## Reproducibility

- Install: `npm install` (declares the new `gsap` dependency).
- Build: `npm run build`; type-check: `npm run check`.
- Performance: Lighthouse via CI per `lighthouserc.json`.
- Reduced-motion: emulate `prefers-reduced-motion: reduce` in browser devtools and
  reload the page.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (to be
  added), Node 22 in CI (local toolchain Node 26 / npm 11).

## Risks and Assumptions

- Assumption: the project stays static Astro with no React (existing pattern).
- Assumption: this phase is presentation-only; content in `src/data` and
  `src/content` is untouched.
- Assumption: the green signal is the existing `--color-accent`; the gold token
  remains defined in the file but is unused within the Hero scope.
- Risk: adding GSAP increases the JS payload. Mitigation: import only the modules
  used (core this phase), load deferred, gate with `gsap.matchMedia()`, and watch
  the Lighthouse budget; if the budget breaks, reduce the motion scope.
- Risk: grain/scanline textures can hurt contrast or performance. Mitigation: keep
  them cheap and static, `aria-hidden`, and off under reduced motion.
- Invalidation: a decision to introduce React, to keep the agro palette, or to do a
  big-bang redesign would each invalidate this spec.
- ADR candidate (promote at the Gate): adopting the industrial-brutalist design
  language and adding GSAP as the motion library are durable, hard-to-reverse
  decisions worth recording under `docs/adr/`.
