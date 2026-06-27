# SPEC: feat(ui): redesign About section in Concrete Terminal language

## Problem

The About section still reads in the old soft "agribusiness-green minimal" style — a
rounded photo, floating bobbing badges, and a gold accent rule — which clashes with the
Concrete Terminal Hero and dilutes the new identity on the second scroll. Its bio and
facts copy is also hardcoded inside `About.astro`, breaking the project's
content-decoupling pattern that every other content area follows.

## Design Decision

Redesign `#about` to the Concrete Terminal language using the existing design system
(concrete monochrome ramp + green as the single signal, hard borders and hard-offset
shadows, mono-forward typography, decorative static grain), laid out as a "Dossier": a
wide bio column on the left; a right rail holding a hard-framed grayscale photo (color on
hover/touch) above a hard-bordered STACK panel; and a hard-bordered FACTS strip below.
Introduce GSAP ScrollTrigger for staggered, scroll-driven, reduced-motion-gated
entrances. Decouple the About copy into a new `src/data/about.ts`. Rename the
design-system tokens `--color-stone-*` to `--color-concrete-*` (updating the Hero, their
only other consumer) to remove the Tailwind v4 built-in `stone` palette collision before
more sections adopt the system. The project stays static Astro (no React); the About copy
is moved verbatim, not rewritten.

## Alternatives Considered

- **Layout: single combined stat-bar strip (Hero echo), or fragmented grid blocks** —
  rejected for the Dossier, which gives the strongest personnel-file identity and a
  cleaner hierarchy for 6 paragraphs + photo + stack + facts.
- **Motion: keep the CSS `[data-reveal]` reveals, or no motion** — rejected in favor of
  GSAP ScrollTrigger, for cohesion with the Hero's GSAP intro and richer staggered
  entrances.
- **Photo: permanent grayscale, or concrete+green duotone** — rejected for
  grayscale→color-on-hover, balancing brutalist austerity with human warmth.
- **Tokens: keep `--color-stone-*`** — rejected; renaming now (the cheapest moment, with
  the Hero still unmerged) removes the latent Tailwind-palette collision.
- **Scope: presentation-only, or re-skin + decoupling only** — rejected for the full
  redesign (re-skin + decoupling + photo/badges rework) so the result is coherent.

## Scope

- Includes:
  - Rename `--color-stone-*` to `--color-concrete-*` in `src/styles/global.css` `@theme`
    (the five-shade ramp and the `--shadow-hard*` references), and update every usage in
    `src/components/sections/Hero.astro` (the only other consumer). `--shadow-hard`,
    `--text-display`, `--text-label` keep their names.
  - New `src/data/about.ts` exporting `about = { paragraphs: string[]; facts: { label:
    string; value: string }[] }`, with the current About copy moved verbatim; the Email
    fact uses `site.email`.
  - Rewrite `src/components/sections/About.astro` to the Dossier layout, consuming only
    `--color-concrete-*` + `--color-accent` (green), the `about` data, and
    `site.heroBadges` (STACK): hard borders + `shadow-hard`, no rounded corners, mono
    uppercase labels, a `"02 / ABOUT"` label, a hard-framed grayscale photo that shows
    color on hover/focus (and by default on no-hover/touch devices), a static
    hard-bordered STACK list (replacing the floating badges), and a hard-bordered FACTS
    strip. A decorative `.bt-grain` overlay marked `aria-hidden`.
  - GSAP ScrollTrigger: register the plugin (imported from the existing `gsap` package);
    an About motion module (a component `<script>`, Hero-style) that, behind
    `gsap.matchMedia()` `(prefers-reduced-motion: no-preference)`, sets the entrance
    targets hidden and reveals them staggered as they scroll into view; the
    `(prefers-reduced-motion: reduce)` branch leaves content visible. Remove the section's
    existing `[data-reveal]` attributes.
  - Accessibility: high-contrast `#about :focus-visible` styles on About interactive
    elements, the decorative overlay `aria-hidden` and non-focusable, and the entrances
    disabled under `prefers-reduced-motion` (final state shown).
- Does NOT include:
  - Redesign of any other section (Services, Skills, Projects, Experience, Contact, Nav,
    Footer) — each is a later SPEC.
  - Renumbering other sections' `0X /` labels (only About becomes `"02"`).
  - Migrating other sections' `[data-reveal]` reveals to GSAP.
  - Editing the About copy itself (text is relocated to `src/data/about.ts` verbatim).
  - Any change under `src/content/projects/*`.
  - Removing the harvest-gold token `--color-accent-2` globally (still used by
    `Services.astro`, `Experience.astro`, `ProjectCard`, `.accent-rule`).
  - Changing the Hero's behavior beyond the mechanical token rename.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `token_rename_complete`: no `--color-stone-` definition or `stone-` design-system
  utility remains in `src/styles/global.css` or `src/components/sections/Hero.astro`;
  `--color-concrete-*` is defined and consumed by both Hero and About; the rendered Hero
  still references no harvest gold.
- `about_no_gold_no_legacy`: the rendered `#about` references no `--color-accent-2`
  (`d6a84e`) and none of the old-palette utilities (`bg-surface`, `border-border`,
  `text-ink`, `text-muted`, `card-lit`, `accent-rule`, `rounded-*`); green is the only
  chromatic signal in the section.
- `about_content_decoupled`: `About.astro` holds no hardcoded `paragraphs`/`facts` copy
  and imports them from `src/data/about.ts`; the rendered About text is identical to the
  previous copy.
- `about_scrolltrigger_reduced_motion`: under emulated `prefers-reduced-motion: reduce`,
  the About entrances do not animate and all content is shown; with JS disabled, content
  is shown.
- `about_texture_decorative`: the grain overlay is `aria-hidden`, not focusable, and
  contributes no text content.
- `about_focus_visible`: keyboard focus shows a visible high-contrast focus style on
  every About interactive element.
- `cls_safe`: About entrances animate transform/opacity only; the Lighthouse
  `cumulative-layout-shift` budget still passes.
- `lighthouse_budget_met`: the existing Lighthouse CI budget (`lighthouserc.json`) still
  passes.
- `content_unchanged`: `git diff` shows no copy changes (the About text is relocated, not
  edited) and no changes under `src/content/`.

## Reproducibility

- Install: `npm install` (`gsap` is already a dependency; ScrollTrigger ships within it as
  `gsap/ScrollTrigger`).
- Build: `npm run build`; type-check: `npm run check`.
- Performance: Lighthouse via CI per `lighthouserc.json`.
- Reduced-motion: emulate `prefers-reduced-motion: reduce` in browser devtools and reload,
  then scroll the About section into view.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core +
  ScrollTrigger), Node 22 in CI (local toolchain Node 26 / npm 11).

## Risks and Assumptions

- Assumption: the project stays static Astro with no React; ScrollTrigger is imported from
  the existing `gsap` package, no new dependency.
- Assumption: this phase is presentation + content-relocation only; the About copy is
  unchanged.
- Risk: renaming the tokens touches the Hero. Mitigation: the Hero is the only other
  consumer and is on an unmerged branch; verify the Hero builds and still renders no gold
  after the rename.
- Risk: ScrollTrigger adds JS and scroll listeners. Mitigation: import only ScrollTrigger,
  gate it with `gsap.matchMedia()`, animate transform/opacity only, and watch the
  Lighthouse budget; if the budget breaks, reduce the motion scope.
- Risk: the grayscale→hover-color photo has no hover on touch devices. Mitigation: default
  to color on no-hover devices via a media query.
- Invalidation: a decision to introduce React, to keep the agro palette in the About, or
  to drop the phased approach would invalidate this spec.
- ADR candidate (promote at the Gate): adopting GSAP ScrollTrigger as the scroll-driven
  section-motion mechanism is a durable, hard-to-reverse decision worth recording
  (extending ADR-0003 or a new ADR).
