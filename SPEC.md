# SPEC: feat(ui): redesign Projects as a pinned horizontal case-study showcase

## Problem

The Projects section — the portfolio's proof centerpiece — uses a soft, premium 3D
perspective "deck" (`.project-deck` / `.deck-card`, flip-through with tabs) plus rich
cards with gold gradients, rounded corners, and the old palette. The 3D depth is the least
brutalist element on the site, and the presentation buries each project's strongest asset:
a measurable result a recruiter scans for.

## Design Decision

Replace the 3D deck with a **pinned horizontal case-study showcase**, built as a
progressive enhancement over an accessible static base. The DOM renders the four case
studies as hard-bordered "case file" articles; by default (no-JS, `prefers-reduced-motion:
reduce`, or small screens) they read as a normal vertical stack with the full case-study
narrative in a `<details>` disclosure. On desktop with motion allowed, a single
`gsap.matchMedia()` activates GSAP ScrollTrigger to **pin** the section and translate the
case files horizontally with **scrub + snap** (advancing 01→02→03→04 as the user scrolls),
each panel a viewport-filling "case file" led by its **headline metric in giant display
type** (the impact hook). The language is Concrete Terminal: monochrome `--color-concrete-*`
+ green as the only signal, hard borders, no rounded corners, mono-forward type, no harvest
gold. To power the giant metric, a small additive `metric` (+ `metricLabel`) field is added
to each project's frontmatter and the content schema — no case-study prose is rewritten.
The project stays static Astro (no React).

## Alternatives Considered

- **Keep the 3D deck (restyled brutalist)** — rejected: the 3D perspective is intrinsically
  non-brutalist, and the deck's bespoke JS is fragile; the showcase is more impactful and
  the static fallback is more robust.
- **Static case-file stack only (no pin)** — kept, but as the *fallback layer* rather than
  the primary desktop experience; the user chose the cinematic pinned showcase for impact.
- **Flat index + detail (no 3D)** — rejected in favor of the pinned horizontal motion.
- **Cross-fade / vertical-stack pin transitions** — rejected for the horizontal slide
  (the chosen, most iconic cinematic feel).
- **Derive the metric from the prose `result`** — rejected as fragile; a clean additive
  `metric` field is added instead.

## Scope

- Includes:
  - Add `metric: string` and `metricLabel?: string` to the projects content schema
    (`src/content.config.ts`) and to the frontmatter of the four `src/content/projects/*.md`
    files (additive metadata only — the existing prose fields are untouched).
  - Rework `src/components/ui/ProjectCard.astro` to a Concrete Terminal "case file": a giant
    mono `metric` hero, a classification header (index + domain + a status/period), title,
    tagline, the green-signal **Result** punchline, a concise problem→decision summary
    (clamped), the stack tags, and repo/demo links — consuming only `--color-concrete-*` +
    `--color-accent`. Hard borders, no rounded corners. The full narrative
    (constraints/alternatives/retrospective/roadmap and the un-clamped fields) stays behind
    the `<details>` disclosure (read in the static base). Drop all gold: the banner gradient
    (`--color-accent-2`) becomes a monochrome concrete/monogram treatment, and the
    "What is next" label loses `text-accent-2`.
  - Rewrite `src/components/sections/Projects.astro`: remove the 3D deck markup, the tablist,
    and the deck `<script>`. Render the case files as a horizontal track that is, by default,
    an accessible vertical stack; the `"05 / CASE STUDIES"` green mono label, display heading,
    intro, and the "All repositories" link are kept (restyled). A decorative `.bt-grain`
    overlay (`aria-hidden`). Add the showcase motion module.
  - Showcase motion: a `<script>` that, behind `gsap.matchMedia()`
    `(prefers-reduced-motion: no-preference) and (min-width: 1024px)` (Tailwind `lg`),
    registers ScrollTrigger, lays the case files in a horizontal track, pins the section, and
    scrubs the horizontal translation with snap to each panel. The matchMedia cleanup fully
    reverts (kills the ScrollTrigger/pin, clears props) so the static stack is restored when
    the query stops matching. No CSS pre-hide; if the pin never initializes, the static stack
    shows.
  - Remove the now-dead deck CSS (`.project-deck`, `.deck-card`, `.deck-tab`) from
    `src/styles/global.css` (guarded: only if unused elsewhere).
  - New ADR `docs/adr/0005-scrolltrigger-pin-projects-showcase.md` recording the pinning
    decision and its fallback strategy; add a README Engineering Decisions row.
- Does NOT include:
  - Redesign of any other section (Experience, Contact, Nav, Footer) — later SPECs.
  - Changing the section-index label (Projects is already `05`).
  - Editing the case-study prose in `src/content/projects/*.md` (only the additive `metric`
    /`metricLabel` fields are added; which fields are displayed and any clamping are
    presentation choices).
  - Removing the harvest-gold token `--color-accent-2` globally (still used by
    `Experience.astro` and `.accent-rule` until those migrate).
  - Migrating other sections' `[data-reveal]` reveals.
  - The deferred site-wide secondary-text visibility decision (`concrete-300` brightness);
    the giant metric/title/Result are bright, the secondary summary uses `concrete-300`.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `metric_field_added`: the projects schema declares `metric` (required) + `metricLabel`
  (optional); all four project `.md` files supply a `metric`; the giant metric renders per
  case file.
- `projects_no_gold_no_legacy`: the rendered `#projects` references no `--color-accent-2`
  (`d6a84e`) and none of the old-palette utilities (`bg-surface`, `border-border`,
  `text-ink`, `text-muted`, `card-lit`, `accent-rule`, `rounded-*`); green is the only
  chromatic signal.
- `deck_removed`: no `.project-deck` / `.deck-card` / `.deck-tab` markup, CSS, or deck
  `<script>` remains (verified in `Projects.astro`, `global.css`).
- `static_base_accessible`: with JS disabled (or the pin query not matching), `#projects`
  renders as a readable vertical stack of full case files with the `<details>` narrative;
  the "All repositories" link works.
- `pin_gated_and_reverts`: the pin/scrub activates ONLY under
  `(prefers-reduced-motion: no-preference)` + the desktop breakpoint; under emulated
  `prefers-reduced-motion: reduce` (or a narrow viewport) the section is the static stack
  with no pinning, no horizontal scroll-hijack, and no trapped focus.
- `reading_order_preserved`: the case files are in document order; keyboard tab moves
  through them and the repo/demo links/disclosure in a sensible order; no element is removed
  from the accessibility tree by the pin.
- `cls_safe`: the showcase does not regress the Lighthouse `cumulative-layout-shift` budget
  (pin uses a pin-spacer; the static base reserves layout).
- `projects_texture_decorative`: the grain overlay is `aria-hidden`, not focusable, no text.
- `adr_recorded`: `docs/adr/0005-scrolltrigger-pin-projects-showcase.md` exists and is
  linked from the README Engineering Decisions table.
- `lighthouse_budget_met`: the existing Lighthouse CI budget (`lighthouserc.json`) still
  passes (accessibility ≥0.95 and CLS ≤0.1 are errors).
- `content_prose_unchanged`: `git diff` shows only additive `metric`/`metricLabel` frontmatter
  in `src/content/projects/*.md` (no prose edits) and no other `src/content/` changes.

## Reproducibility

- Install: `npm install` (`gsap` already a dependency; ScrollTrigger ships within it).
- Build: `npm run build`; type-check: `npm run check`.
- Performance/accessibility: Lighthouse via CI per `lighthouserc.json`.
- Pin vs fallback: in browser devtools, emulate `prefers-reduced-motion: reduce` and/or a
  narrow viewport, reload — expect the static stack (no pin); with motion + a desktop width,
  expect the pinned horizontal showcase. Disable JS — expect the static stack.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core +
  ScrollTrigger), Node 22 in CI.

## Risks and Assumptions

- Assumption: static Astro, no React; ScrollTrigger from the existing `gsap` package.
- Assumption: adding `metric`/`metricLabel` is acceptable additive content (the user
  approved it); the case-study prose is unchanged.
- Risk (primary): pinning/scroll-hijack can harm accessibility (focus trap, reading order)
  and performance (CLS). Mitigation: the static accessible stack is the source of truth and
  the universal fallback; the pin is gated by `matchMedia` (motion + desktop), never traps
  focus, preserves document order, and uses a pin-spacer; the Lighthouse a11y (≥0.95) and
  CLS (≤0.1) error budgets are the gate.
- Risk: long case-study content can overflow a viewport panel. Mitigation: the pinned panel
  shows the concise impact view (clamped summary); the full narrative is in the static base
  and the repo.
- Risk: removing the bespoke deck JS/CSS could leave dead references. Mitigation: guarded
  removal verified by grep.
- Invalidation: introducing React, keeping the 3D deck, or refusing the `metric` field
  would invalidate this spec.
- ADR candidate (promote at the Gate): adopting ScrollTrigger **pinning** for the showcase
  (with the fallback strategy) is a durable, hard-to-reverse, genuinely risky decision —
  recorded as ADR-0005.
