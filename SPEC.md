# SPEC: feat(ui): redesign Nav in Concrete Terminal (mono nav bar + green progress)

## Problem

`Nav.astro` (the fixed top navigation) is still on the legacy "dark tech" palette: it uses
`border-border`, `text-ink`, `text-muted`, `hover:bg-surface`, `hover:text-ink`, and
`rounded-lg`, and its scroll-progress bar is a green→**harvest-gold** gradient
(`#scroll-progress` in `global.css` uses `--color-accent-2`). The desktop/mobile links are
sentence-case sans, out of step with the site's mono-label terminal language. Nav is one of
the two remaining legacy-palette pieces (with Footer).

## Design Decision

Rebuild Nav in Concrete Terminal, preserving all behavior (mobile toggle with
`aria-expanded`, the scroll-progress bar driven by `--p`, the IntersectionObserver
scroll-spy with the `.is-current` active state) and the links data.

- **Header chrome:** `bg-concrete-950/80 backdrop-blur-md` with a `border-b border-concrete-700`
  hard rule; the fixed positioning, height, and max-width are kept.
- **Logo:** unchanged structure (`>` in `text-accent` + initials), recolored to
  `text-concrete-50`.
- **Links → mono uppercase.** Desktop and mobile nav links become `font-mono` uppercase with
  tracking, `text-concrete-300` → `hover:text-concrete-50`. The **active section** keeps the
  existing animated green underline mechanic: the `.nav-link::after` accent underline stays,
  and `.nav-link.is-current` recolors from `--color-ink` to `--color-concrete-50`. The
  scroll-spy JS that toggles `.is-current` is unchanged.
- **Scroll-progress bar → green-only gradient.** The `#scroll-progress` background drops
  `--color-accent-2` and becomes a green→light-green gradient
  (`color-mix(in srgb, var(--color-accent) 50%, white)`); the `scaleX(var(--p))` fill behavior
  is unchanged.
- **Resume CTA → brutalist:** drop `rounded-lg`; a `border-2 border-accent` mono-uppercase
  pill that fills green with dark text on hover (`hover:bg-accent hover:text-concrete-950`).
- **Mobile:** the toggle button recolors to `text-concrete-50` (no rounded); the mobile menu
  uses `border-t border-concrete-700 bg-concrete-950`, mono-uppercase links with
  `hover:bg-concrete-900 hover:text-concrete-50` (no rounded), and the brutalist Resume CTA.
- The Nav `<script>` (toggle, progress, scroll-spy) is preserved verbatim. Static Astro, no
  React. Nav has no `[data-reveal]` and no entrance animation (it is a persistent fixed bar) —
  no GSAP module is added.

`SocialLinks.astro` and `Footer.astro` are out of scope (Footer phase). The harvest-gold token
`--color-accent-2` is **not removed globally** (its only remaining use after this phase is the
`.accent-rule` gradient in `global.css`; whether `.accent-rule` is now dead is a separate
cleanup, tracked but not done here).

## Alternatives Considered

- **Sans sentence-case links (just recolor)** — rejected: mono uppercase matches the site's
  terminal label language; the user chose it.
- **`>` CLI-prefix active marker instead of the underline** — rejected: the user kept the
  animated green underline mechanic (less churn, already accessible).
- **Solid green progress bar / segmented blocky bar** — rejected in favor of the green→
  light-green gradient (keeps the gradient feel, drops gold), per the user.
- **Remove `--color-accent-2` + `.accent-rule` now** — deferred: a separate cleanup once the
  last gold/`.accent-rule` consumer is confirmed gone; out of this phase's scope.

## Scope

- Includes:
  - Rewrite `src/components/layout/Nav.astro` markup:
    - Header: `bg-concrete-950/80 backdrop-blur-md`, `border-b border-concrete-700`.
    - Logo recolored to `text-concrete-50` (the `>` stays `text-accent`).
    - Desktop links: `nav-link font-mono text-xs uppercase tracking-[0.2em] text-concrete-300
      transition-colors hover:text-concrete-50` (keep `data-nav-link` + the `nav-link` class
      for the underline/scroll-spy).
    - Resume CTA: `border-2 border-accent px-3 py-1.5 font-mono text-xs font-bold uppercase
      tracking-wider text-accent transition-colors hover:bg-accent hover:text-concrete-950`
      (no rounded).
    - Mobile toggle: `text-concrete-50` (no rounded). Mobile menu: `border-t
      border-concrete-700 bg-concrete-950`; links mono-uppercase `text-concrete-300
      hover:bg-concrete-900 hover:text-concrete-50` (no rounded); the brutalist Resume CTA.
    - The `links` array and the entire `<script>` (toggle/progress/scroll-spy) are unchanged.
  - `src/styles/global.css`:
    - `#scroll-progress` `background`: replace the `accent → accent-2` gradient with
      `linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 50%, white))`.
    - `.nav-link.is-current` `color`: `var(--color-ink)` → `var(--color-concrete-50)`.
    - The `.nav-link::after` accent underline rule is unchanged.
- Does NOT include:
  - `SocialLinks.astro`, `Footer.astro`, any content section, `src/data/`, `src/content/`.
  - Removing `--color-accent-2`, the `.accent-rule` CSS, or `--color-ink`/`--color-muted`/etc.
    tokens (still used by Footer/SocialLinks until those migrate).
  - Changing the links, their order, or any copy.
  - Any new ADR (reuses ADR-0002 industrial-brutalist language).

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `nav_no_legacy`: `Nav.astro` references none of `border-border`, `text-ink`, `text-muted`,
  `bg-surface`, `hover:text-ink`, `rounded-lg`; its colors are the concrete ramp + `accent`.
- `progress_green_only`: the rendered `#scroll-progress` background references no
  `--color-accent-2` / `d6a84e`; green is the only chromatic signal (green→light-green).
- `mono_uppercase_links`: the desktop and mobile nav links use `font-mono` + `uppercase`
  tracking; the active link still gets the green underline (`.nav-link::after` +
  `.is-current` now `concrete-50`).
- `js_behavior_preserved`: the Nav `<script>` is unchanged — the mobile toggle still flips
  `aria-expanded` and `aria-label` and shows/hides `#mobile-menu`; the progress bar still sets
  `--p`; the scroll-spy still toggles `.is-current` on the in-view section's link.
- `content_unchanged`: `git diff` shows no change to `src/data/` or `src/content/`; the links
  array and labels are unchanged.
- `sociallinks_footer_untouched`: `SocialLinks.astro` and `Footer.astro` are unchanged.
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes
  (accessibility ≥0.95, CLS ≤0.1).

## Reproducibility

- Install: `npm install`. Build: `npm run build`; type-check: `npm run check`.
- Color audit: `grep -nE "border-border|text-ink|text-muted|bg-surface|rounded-lg" src/components/layout/Nav.astro`
  → expect none; `grep -n "accent-2" src/styles/global.css` → expect it gone from `#scroll-progress`.
- Behavior: `npm run preview`; resize to mobile → the toggle opens/closes the menu
  (`aria-expanded` flips); scroll → the green→light-green progress bar fills and the in-view
  section's link shows the green underline.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, Node 22 in CI.

## Risks and Assumptions

- Assumption: static Astro; the `--color-base`→`--color-canvas` fix is in place (Nav already
  uses `bg-canvas`; this phase moves it to `bg-concrete-950`).
- Risk: rewriting the nav markup could break the scroll-spy/toggle wiring. Mitigation: keep
  the `data-nav-link` attribute, the `nav-link` class, the element `id`s (`nav-toggle`,
  `mobile-menu`, `scroll-progress`), and the `<script>` verbatim; only classes/markup styling
  change.
- Risk: mono-uppercase links could overflow on small desktop widths (e.g. "WHAT I DO").
  Mitigation: the existing `gap`/flex layout and the mobile breakpoint; verify at desktop.
- Risk: the `border-concrete-700` header rule is faint. Mitigation: the `backdrop-blur` + bg
  separate the header; the rule is a subtle accent, consistent with other dividers.
- Invalidation: introducing React, removing the underline/scroll-spy mechanic, or migrating
  Footer/SocialLinks here invalidates this spec.
