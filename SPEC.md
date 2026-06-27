# SPEC: feat(ui): add a global CRT scan-beam background animation

## Problem

The Concrete Terminal design hints at a CRT/terminal identity — a static film grain
(`.bt-grain`) on every section and CRT scanlines (`.bt-scanline`) — but the scanlines exist
**only on the Hero**, and nothing moves in the background elsewhere. The ambient texture is
fragmented and almost entirely static, so the "terminal screen" feel doesn't carry across the
page. The site wants one cohesive, subtle, page-wide CRT ambience that reinforces the
aesthetic without competing with content or regressing the performance / accessibility
baseline.

## Design Decision

Add **one global, decorative CRT overlay** (in `Layout.astro`) that unifies the terminal
ambience across the whole page:

- A `position: fixed`, full-viewport overlay, `aria-hidden="true"`, `pointer-events: none`,
  containing two purely-decorative layers:
  1. **Faint static scanlines** — a `repeating-linear-gradient` of horizontal lines at very
     low opacity (~3%), spanning the viewport.
  2. **An animated scan-beam** — a soft, tall (~30vh) translucent band that sweeps top→bottom
     on a slow linear loop (~10s), evoking a CRT refresh beam. Pure CSS `transform: translateY`
     (GPU-composited), no JS.
- The overlay sits **above content** (the canonical CRT-screen treatment) but is non-blocking
  (`pointer-events: none`) and tuned to **low opacities** so text legibility is preserved. It
  uses a subtle blend so it tints the page rather than darkening it.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, the scan-beam is removed
  (`display: none` / `animation: none`); the static scanlines may remain (they are not motion)
  but are already neutral. No flashing at any point (WCAG 2.3.1) and no perceptible brightness
  flicker.
- The now-redundant Hero-only `.bt-scanline` div + its CSS are removed (the global overlay
  supersedes it); the per-section `.bt-grain` static grain stays.

No JS, no layout impact (a fixed overlay reserves no space), no new dependency. Static Astro.
This is a durable, site-wide visual-identity decision → record **ADR-0006 (CRT ambient
overlay)**.

## Alternatives Considered

- **Per-section, behind-content scan-beam** (a beam inside each section at `z-0`, like the
  grain, so it never overlays text) — content-safest, but the beam resets per section instead
  of a continuous page-wide sweep, and it multiplies the effect across 9 sections. Rejected for
  the single, continuous, cheaper global overlay — but this is the fallback if the
  above-content overlay proves to harm legibility (see Risks).
- **Animated grid / drifting blueprint lines** — on-brand for the brutalist side, but a
  different metaphor than the CRT the site already leans into; rejected for cohesion.
- **Animated gradients / aurora / particles / "matrix rain" / heavy parallax** — rejected:
  off-brand AI-slop for an industrial-brutalist site, and a perf/distraction risk.
- **Brightness flicker for CRT realism** — rejected: flashing/flicker is an accessibility
  hazard (WCAG 2.3) and distracting.
- **Keep the scanlines Hero-only, add only the beam** — viable, but the user approved unifying
  the scanlines site-wide too; the overlay does both in one layer.

## Scope

- Includes:
  - `src/layouts/Layout.astro`: add one decorative overlay element near the existing
    `#cursor-glow` — `<div class="crt-overlay" aria-hidden="true"><div class="crt-beam"></div></div>`
    (`pointer-events: none`, fixed, full-viewport). It must not intercept clicks or enter the
    a11y tree.
  - `src/styles/global.css`:
    - `.crt-overlay` — `position: fixed; inset: 0; pointer-events: none;` a high but
      non-blocking stacking position; the static scanline `repeating-linear-gradient` at low
      opacity.
    - `.crt-beam` — the soft translucent band; a `@keyframes crt-sweep` translating it
      top→bottom; a slow linear infinite duration.
    - A `@media (prefers-reduced-motion: reduce)` rule that disables the beam (no sweep).
    - Remove the now-dead `.bt-scanline` rule + its `@keyframes bt-scan` (superseded), and the
      reduced-motion entry that referenced `.bt-scanline`.
  - `src/components/sections/Hero.astro`: remove the `<div class="bt-scanline" aria-hidden="true"></div>`
    element (the global overlay replaces it); keep the `.bt-grain` div.
  - `docs/adr/0006-crt-ambient-overlay.md`: record the decision (global CRT overlay, above
    content, reduced-motion-gated, the legibility trade-off and the per-section fallback); add a
    README Engineering Decisions row.
- Does NOT include:
  - Removing or changing the per-section `.bt-grain` grain or the `#cursor-glow`.
  - Any content, section markup (other than the Hero scanline removal), `src/data/`, or
    `src/content/` change.
  - The separate final cleanup (dead tokens / `404.astro` / focus-ring) — that follows this
    phase.
  - Any JS-driven animation.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `overlay_decorative`: the `.crt-overlay` is `aria-hidden="true"`, `pointer-events: none`,
  not focusable, contains no text, and does not intercept pointer events over any
  link/button/input.
- `beam_motion_gated`: the scan-beam animates only when motion is allowed; under emulated
  `prefers-reduced-motion: reduce` the beam does not move (no sweep) and nothing flashes.
- `no_js`: the effect is pure CSS — no `<script>` is added for it.
- `cls_safe`: the overlay is `position: fixed` (reserves no layout) and animates `transform`
  only; the Lighthouse `cumulative-layout-shift` budget (≤0.1) is not regressed.
- `legibility_preserved`: with the overlay active, body text across sections remains clearly
  legible at desktop and mobile widths (low opacity; the beam pass is brief). This is the
  primary visual gate — verified in a real browser.
- `hero_scanline_deduped`: the Hero `.bt-scanline` element and the `.bt-scanline` CSS +
  `@keyframes bt-scan` are removed; no double scanlines on the Hero; the `.bt-grain` grain
  remains.
- `adr_recorded`: `docs/adr/0006-crt-ambient-overlay.md` exists and is linked from the README
  Engineering Decisions table.
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes
  (accessibility ≥0.95, performance not regressed, CLS ≤0.1).

## Reproducibility

- Install: `npm install`. Build: `npm run build`; type-check: `npm run check`.
- Visual: `npm run preview`; scroll the page — a faint scan-beam sweeps top→bottom over the
  whole page, with subtle scanlines, and **all text stays legible**. Emulate
  `prefers-reduced-motion: reduce` and reload — the beam is static/absent, content unchanged.
- Non-blocking: click links/buttons under the overlay — they respond (the overlay never
  intercepts).
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, Node 22 in CI.

## Risks and Assumptions

- Risk (primary): an above-content overlay can reduce text legibility — a recurring concern on
  this site. Mitigation: very low scanline opacity (~3%) and a brief, faint moving beam; the
  opacities are single-line tunables; `legibility_preserved` is a hard visual gate. If it still
  reads poorly, fall back to the per-section behind-content beam (Alternatives) — a contained
  change.
- Risk: a moving full-screen overlay could distract or cost GPU. Mitigation: a single slow
  `transform` animation (compositor-only), low opacity, and full removal under reduced motion.
- Risk: flashing/flicker is a WCAG 2.3 hazard. Mitigation: no opacity/brightness flicker — only
  a slow positional sweep; nothing flashes.
- Assumption: removing the Hero `.bt-scanline` has no other consumer (grep-confirmed
  Hero-only).
- Invalidation: introducing JS for the effect, a flashing/flicker treatment, or an opacity that
  measurably harms contrast invalidates this spec.
