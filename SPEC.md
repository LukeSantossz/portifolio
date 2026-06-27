# SPEC: feat(ui): redesign Skills section in Concrete Terminal language (mono marquee)

## Problem

The Skills section still reads in the old soft style — a gold accent rule and a
full-bleed marquee whose chips are colored by a five-hue rainbow (one hue per cluster),
which clashes hard with the Concrete Terminal Hero/About/Services and breaks the
monochrome-plus-single-green-signal language on the fourth scroll.

## Design Decision

Redesign `#skills` to the Concrete Terminal language while **keeping its signature
full-bleed looping marquee** (three rows scrolling in alternating directions). Drop the
per-cluster rainbow: every chip becomes a hard-bordered, no-radius, mono, off-white tag on
concrete. The existing "indirect cluster reveal" interaction is preserved but
recolored — hovering a chip (or a legend item) lights its whole cluster in green (the
single signal) and dims the rest. The section heading drops the gold `accent-rule`; the
section gains a decorative grain overlay and a green `"04 / SKILLS"` mono label. Section
entrance uses GSAP ScrollTrigger (per ADR-0004), gated by `gsap.matchMedia()` and revealing
via `opacity` (fail-safe: hidden state applied only when the trigger fires). The marquee's
own infinite loop is unchanged (it already stops under `prefers-reduced-motion`). The
project stays static Astro (no React); the skills content in `src/data/skills.ts` is
already decoupled and is not touched.

## Alternatives Considered

- **Static cluster grid ("tech sheet")** and **static ledger rows by cluster** — rejected
  in favor of keeping the marquee, which is the section's signature lively element and whose
  hover-reveal interaction reinterprets cleanly in monochrome + green.
- **Keep the per-cluster rainbow** — rejected: it directly violates the monochrome + single
  green-signal language.
- **Convey clusters with color** — rejected (no rainbow); clusters are revealed by the
  green-highlight-on-hover interaction and the legend instead.

## Scope

- Includes:
  - Rewrite `src/components/sections/Skills.astro` to the Concrete Terminal language: a
    green `"04 / SKILLS"` mono label, a display heading, the intro, the kept three-row
    full-bleed marquee, and the legend — consuming only `--color-concrete-*` +
    `--color-accent` (green). Remove the hardcoded `clusterColor` map and every per-chip
    `--c` color and the gold `accent-rule`. Keep the cluster grouping data
    (`data-cluster`) and the existing hover-to-highlight `<script>` (it toggles
    `is-active` / `is-dim` by cluster — behavior unchanged, only the CSS it drives is
    restyled). Add a decorative `.bt-grain` overlay (`aria-hidden`). Add `data-skills-anim`
    hooks for the entrance.
  - Restyle in `src/styles/global.css` the chip/legend rules to monochrome + green,
    independent of `--c`: `.skill-chip` (hard border, no radius, mono, off-white on
    concrete), `.skill-chip.is-active` (green border + green text), `.skill-chip.is-dim`
    (dimmed), and `.skill-legend` / `.skill-legend.is-active` (neutral marker that turns
    green when its cluster is active). The `.marquee-row` / `.marquee-track` loop structure
    is unchanged.
  - GSAP ScrollTrigger entrance: a Skills motion module (`<script>`) that, behind
    `gsap.matchMedia()` `(prefers-reduced-motion: no-preference)`, reveals the
    `data-skills-anim` targets staggered on scroll via `gsap.from(..., { opacity: 0, y, immediateRender: false })`;
    reduced-motion / no-JS leave content visible. Remove the section's `[data-reveal]`.
- Does NOT include:
  - Redesign of any other section (Projects, Experience, Contact, Nav, Footer) — later
    SPECs.
  - Changing the section-index label (Skills is already `04`).
  - Changing `src/data/skills.ts` (content unchanged).
  - Removing the marquee or its infinite-loop mechanism (kept, only restyled).
  - Removing the harvest-gold token `--color-accent-2` globally (still used by
    `Experience.astro`, `ProjectCard`, `.accent-rule`).
  - The deferred site-wide secondary-text visibility decision (`concrete-300` brightness);
    Skills uses `concrete-300` for its muted intro, consistent with the other redesigned
    sections, and is covered by that separate decision.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `skills_no_rainbow_no_gold`: the rendered `#skills` references no per-cluster hex colors
  and no `--color-accent-2` (`d6a84e`); the `clusterColor` map and per-chip `--c` are gone;
  green is the only chromatic signal in the section.
- `skills_no_legacy`: the rendered `#skills` uses none of the old-palette utilities
  (`bg-surface`, `border-border`, `text-ink`, `text-muted`, `accent-rule`, `rounded-*` on
  chips); it consumes `--color-concrete-*` + green.
- `cluster_hover_preserved`: hovering a chip or legend item still highlights that cluster
  (its chips get `is-active`, others `is-dim`); the highlight color is green.
- `marquee_preserved`: the three-row full-bleed marquee still renders and loops; under
  emulated `prefers-reduced-motion: reduce` the loop stops.
- `skills_entrance_reduced_motion`: under `prefers-reduced-motion: reduce`, the entrance
  does not animate and content is shown; with JS disabled, content is shown (no CSS
  pre-hide of `data-skills-anim`).
- `skills_texture_decorative`: the grain overlay is `aria-hidden`, not focusable, no text.
- `cls_safe`: the entrance animates transform/opacity only; the Lighthouse CLS budget still
  passes.
- `lighthouse_budget_met`: the existing Lighthouse CI budget (`lighthouserc.json`) passes.
- `content_unchanged`: `git diff` shows no changes under `src/data/` or `src/content/`.

## Reproducibility

- Install: `npm install` (`gsap` already a dependency; ScrollTrigger ships within it).
- Build: `npm run build`; type-check: `npm run check`.
- Performance: Lighthouse via CI per `lighthouserc.json`.
- Reduced-motion: emulate `prefers-reduced-motion: reduce` in devtools, reload, scroll
  Skills into view (marquee loop stops; entrance does not animate).
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core +
  ScrollTrigger), Node 22 in CI.

## Risks and Assumptions

- Assumption: static Astro, no React; ScrollTrigger from the existing `gsap` package.
- Assumption: presentation-only; `src/data/skills.ts` content unchanged.
- Risk: restyling `.skill-chip` to drop `--c` could leave stale rainbow styling if any rule
  still references `--c`. Mitigation: verify no per-cluster hex / `--c` remains in the
  rendered `#skills` and in the chip CSS.
- Risk: the marquee plus a scroll entrance plus the existing loop could affect performance.
  Mitigation: entrance animates transform/opacity only and is matchMedia-gated; the loop is
  unchanged and already CSS-only; watch the Lighthouse budget.
- Invalidation: a decision to introduce React, keep the rainbow, or drop the marquee would
  invalidate this spec.
- Decision lineage: design language (ADR-0002), GSAP (ADR-0003), and ScrollTrigger as the
  section-motion mechanism (ADR-0004) are already recorded; this phase needs no new ADR.
