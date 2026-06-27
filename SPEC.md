# SPEC: feat(ui): redesign Services section in Concrete Terminal language (Capability Ledger)

## Problem

The Services section still reads in the old soft "agribusiness-green minimal" style — a
2×2 grid of rounded cards with a gold accent rule, gold card numbers, `card-lit` edges
and a green hover glow — which clashes with the Concrete Terminal Hero and About on the
third scroll. Its service copy is also hardcoded inside `Services.astro`, breaking the
project's content-decoupling pattern.

## Design Decision

Redesign `#services` to the Concrete Terminal language as a "Capability Ledger": a
hard-bordered list of four full-width rows, each `[ NN | title + body ]` with a large mono
number column on the left, hard dividers between rows, reading like a declassified spec
sheet. It consumes only the `--color-concrete-*` ramp + green as the single signal (no
harvest gold); hard borders, no rounded corners, mono-forward type, a decorative static
grain overlay. Scroll-driven entrances use GSAP ScrollTrigger (per ADR-0004), gated by
`gsap.matchMedia()` and revealing via `opacity` (not `autoAlpha`, to keep content in the
accessibility tree). The service copy is decoupled into a new `src/data/services.ts`. The
project stays static Astro (no React); the copy is moved verbatim, not rewritten.

## Alternatives Considered

- **Hard card grid (2×2), or bold green-signal cards** — rejected for the Capability
  Ledger, which gives the strongest declassified-spec-sheet identity, the best scanning
  for four capabilities, and a clear visual contrast with the About "Dossier".
- **Make each capability link to the case studies (`#projects`)** — rejected this phase:
  adds interactivity and scope beyond the presentation redesign; can be revisited later.
- **Keep the CSS `[data-reveal]` reveals** — rejected for GSAP ScrollTrigger, consistent
  with the About phase and ADR-0004.
- **Presentation-only (no decoupling)** — rejected for the full redesign (re-skin +
  decoupling + ledger rework), consistent with the About phase, for a coherent result.

## Scope

- Includes:
  - New `src/data/services.ts` exporting `services = { intro: string; items: { title:
    string; body: string }[] }`, with the current Services intro paragraph and the four
    capability items moved verbatim from `Services.astro`.
  - Rewrite `src/components/sections/Services.astro` to the Capability Ledger, consuming
    only `--color-concrete-*` + `--color-accent` (green) and the `services` data: the
    `"03 / WHAT I DO"` mono label (green), a display heading, the intro, then a
    hard-bordered `<ul>`/`<li>` ledger — each row a large mono number (decorative,
    `aria-hidden`), an `<h3>` title (uppercase mono), and a body `<p>`; hard 2px dividers
    between rows; a row hover accent in green (left edge + title). A decorative `.bt-grain`
    overlay marked `aria-hidden`.
  - GSAP ScrollTrigger entrances: register the plugin (from the existing `gsap` package);
    a Services motion module (component `<script>`) that, behind `gsap.matchMedia()`
    `(prefers-reduced-motion: no-preference)`, sets the entrance targets hidden via
    `opacity` and reveals them staggered on scroll; reduced-motion leaves content visible.
    Remove the section's `[data-reveal]` attributes. Hooks: `data-services-anim`.
  - Drop all harvest gold from the section: the card numbers (currently `text-accent-2`)
    become `--color-concrete-*`, and the gold `accent-rule` is removed.
- Does NOT include:
  - Redesign of any other section (Skills, Projects, Experience, Contact, Nav, Footer) —
    each is a later SPEC.
  - Changing section-index labels (Services is already `03`).
  - Making the capabilities link to `#projects` or any other section.
  - Editing the Services copy (intro + items are relocated to `src/data/services.ts`
    verbatim).
  - Any change under `src/content/projects/*`.
  - Removing the harvest-gold token `--color-accent-2` globally (still used by
    `Experience.astro`, `ProjectCard`, `.accent-rule`).
  - Migrating other sections' `[data-reveal]` reveals.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `services_no_gold_no_legacy`: the rendered `#services` references no `--color-accent-2`
  (`d6a84e`) and none of the old-palette utilities (`bg-surface`, `border-border`,
  `text-ink`, `text-muted`, `card-lit`, `accent-rule`, `rounded-*`); green is the only
  chromatic signal in the section.
- `services_content_decoupled`: `Services.astro` holds no hardcoded `services` array or
  intro copy and imports them from `src/data/services.ts`; the rendered text (intro + four
  items) is identical to the previous copy.
- `services_scrolltrigger_reduced_motion`: under emulated `prefers-reduced-motion:
  reduce`, the Services entrances do not animate and all content is shown; with JS
  disabled, content is shown (no CSS pre-hide).
- `services_texture_decorative`: the grain overlay is `aria-hidden`, not focusable, and
  contributes no text content; the large row numbers are `aria-hidden`.
- `cls_safe`: Services entrances animate transform/opacity only; the Lighthouse
  `cumulative-layout-shift` budget still passes.
- `lighthouse_budget_met`: the existing Lighthouse CI budget (`lighthouserc.json`) still
  passes.
- `content_unchanged`: `git diff` shows no copy changes (the Services text is relocated,
  not edited) and no changes under `src/content/`.

## Reproducibility

- Install: `npm install` (`gsap` already a dependency; ScrollTrigger ships within it).
- Build: `npm run build`; type-check: `npm run check`.
- Performance: Lighthouse via CI per `lighthouserc.json`.
- Reduced-motion: emulate `prefers-reduced-motion: reduce` in devtools, reload, scroll
  Services into view.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core +
  ScrollTrigger), Node 22 in CI.

## Risks and Assumptions

- Assumption: static Astro, no React; ScrollTrigger imported from the existing `gsap`
  package, no new dependency.
- Assumption: presentation + content-relocation only; the Services copy is unchanged.
- Risk: ScrollTrigger adds JS and scroll listeners. Mitigation: import only ScrollTrigger,
  gate with `gsap.matchMedia()`, animate transform/opacity only, watch the Lighthouse
  budget; if it breaks, reduce the motion scope.
- Risk: the large ledger numbers could be read by assistive tech as redundant content.
  Mitigation: mark them `aria-hidden`; the `<h3>` titles carry the structure.
- Invalidation: a decision to introduce React, to keep the agro palette in Services, or to
  make the capabilities interactive would invalidate this spec.
- Decision lineage: the design language (ADR-0002), GSAP (ADR-0003), and ScrollTrigger as
  the section-motion mechanism (ADR-0004) are already recorded; this phase needs no new
  ADR.
