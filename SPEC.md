# SPEC: feat(ui): redesign Footer and SocialLinks in Concrete Terminal

## Problem

`Footer.astro` and the shared `SocialLinks.astro` are the last two legacy-palette pieces.
The footer uses `border-border`, `text-ink`, `text-muted`; the social icon buttons use
`rounded-lg`, `border-border`, `bg-surface`, `text-muted`. Because `SocialLinks` is shared by
**Hero, Contact, and Footer**, its legacy styling currently shows rounded, surface-gray icon
buttons inside three already-brutalist contexts — the most visible remaining inconsistency.
Migrating both completes the Concrete Terminal migration of the whole page.

## Design Decision

- **`SocialLinks.astro` → hard-bordered square icon buttons.** Drop `rounded-lg`; each
  button becomes a hard-bordered concrete square (`border border-concrete-700`,
  `bg-concrete-900`, `text-concrete-300`) whose border and icon turn green on hover
  (`hover:border-accent hover:text-accent`). The `links` array, the `target`/`rel`
  (`noopener noreferrer` on external), the `aria-label`s, the `Icon`, and the `class` prop are
  unchanged. This single change propagates to Hero, Contact, and Footer.
- **`Footer.astro` → Concrete Terminal chrome.** A hard top rule (`border-t-2
  border-concrete-50`) on `bg-concrete-950`; the `> {site.name}` line recolored to
  `text-concrete-50` (the `>` stays `text-accent`); the copyright line becomes
  `font-mono text-xs text-concrete-300`. Add a **back-to-top** link: a mono uppercase
  `↑ Top` anchor to `#top` (the `↑` glyph `aria-hidden`, `aria-label="Back to top"`,
  `hover:text-accent`), grouped with `<SocialLinks>` on the right. The build-time
  `year = new Date().getFullYear()` and the layout structure are kept.

Static Astro, no React. No new ADR (reuses ADR-0002). The now-possibly-dead legacy tokens
(`--color-accent-2`, `.accent-rule`, `--color-surface*`, `--color-border`) and the `404.astro`
`text-muted` remnant are a **separate final cleanup**, not done here.

## Alternatives Considered

- **Borderless social icons / fill-on-hover** — rejected: hard-bordered squares match the
  site's hard-border language; the user chose them.
- **Footer minimal restyle only (no back-to-top)** — rejected: a back-to-top shortcut is
  useful on a long single-scroll page; the user chose to add it.
- **Migrate `404.astro` / remove dead tokens now** — deferred to a final cleanup pass; out of
  this phase's scope.
- **Style `SocialLinks` per-context (different in Hero vs Footer)** — rejected: one shared
  brutalist treatment is simpler and consistent; the `class` prop already handles spacing.

## Scope

- Includes:
  - `src/components/ui/SocialLinks.astro`: replace the anchor `class` with
    `grid h-10 w-10 place-items-center border border-concrete-700 bg-concrete-900
    text-concrete-300 transition-colors hover:border-accent hover:text-accent` (no
    `rounded-lg`). Everything else (the `links` array, `target`/`rel`, `aria-label`, `Icon`,
    the `class` prop merge) is unchanged.
  - `src/components/layout/Footer.astro`:
    - `<footer>` → `border-t-2 border-concrete-50 bg-concrete-950`.
    - `> {site.name}` line → `text-concrete-50` (the `>` stays `text-accent`).
    - copyright → `font-mono text-xs text-concrete-300`.
    - Add the back-to-top `<a href="#top">` (mono uppercase, `↑` `aria-hidden`,
      `aria-label="Back to top"`, `hover:text-accent`), grouped with `<SocialLinks>` on the
      right (a flex group), so the two-column `justify-between` layout is preserved.
- Does NOT include:
  - Any change to Hero, Contact, or any section file (the `SocialLinks` restyle propagates to
    them automatically — that is the intended, in-scope effect; their `.astro` files are not
    edited).
  - `src/data/site.ts`, `src/content/`, the `links` arrays, or any copy.
  - Migrating `404.astro` or removing the dead legacy tokens / `.accent-rule` (separate final
    cleanup).
  - Any new ADR.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `sociallinks_brutalist`: `SocialLinks.astro` references none of `rounded-lg`, `border-border`,
  `bg-surface`, `text-muted`; the anchor uses `border-concrete-700` + `bg-concrete-900` +
  `text-concrete-300` with `hover:border-accent hover:text-accent`.
- `footer_no_legacy`: `Footer.astro` references none of `border-border`, `text-ink`,
  `text-muted`; its colors are the concrete ramp + `accent`; the top rule is
  `border-t-2 border-concrete-50`.
- `back_to_top_present`: `Footer.astro` has an `<a href="#top">` back-to-top link with an
  accessible name ("Back to top"), mono uppercase, `hover:text-accent`; the `↑` glyph is
  `aria-hidden`.
- `sociallinks_contract`: the three links (`site.github`, `site.linkedin`, `mailto:site.email`)
  remain with their `aria-label`s and the external `rel="noopener noreferrer"` /
  `target="_blank"` (and the mail link without them) intact.
- `propagation_safe`: Hero and Contact are not edited; their rendered social icons inherit the
  new brutalist style via the shared component (verified visually).
- `content_unchanged`: `git diff` shows no change to `src/data/` or `src/content/`.
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes
  (accessibility ≥0.95, CLS ≤0.1).

## Reproducibility

- Install: `npm install`. Build: `npm run build`; type-check: `npm run check`.
- Audit: `grep -nE "rounded-lg|border-border|bg-surface|text-muted" src/components/ui/SocialLinks.astro src/components/layout/Footer.astro`
  → expect none. `grep -n 'href="#top"' src/components/layout/Footer.astro` → expect the
  back-to-top link.
- Visual: `npm run preview`; the footer has a hard top rule on concrete; the social icons
  (footer, Hero, Contact) are hard-bordered squares that turn green on hover; the `↑ Top`
  link scrolls to the top.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, Node 22 in CI.

## Risks and Assumptions

- Assumption: static Astro; `SocialLinks` is consumed by Hero/Contact/Footer only; restyling
  it is the intended shared change.
- Risk: changing the shared `SocialLinks` could regress Hero/Contact spacing. Mitigation: only
  the per-anchor visual classes change; the `class` prop (spacing) and the wrapper are kept, so
  layout in Hero/Contact is unaffected — verify visually.
- Risk: the `border-concrete-700` icon-button border is faint on the dark surface. Mitigation:
  the icon (`concrete-300`) is the primary signal and the hover state is green; verify at
  desktop. If too faint, nudge the border to `concrete-500` (one-line change).
- Invalidation: introducing React, editing a section file to override `SocialLinks`, or
  removing the dead tokens here invalidates this spec.
