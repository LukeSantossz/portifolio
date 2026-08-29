> **Retired.** Retired in place by [ADR-0014](0014-editorial-index-restructure.md): the CRT overlay and its scan-beam were removed. The static grain is the remaining analog texture.

# Add a global CRT scan-beam ambient overlay

The Concrete Terminal design leans on a CRT/terminal identity, but its only moving ambience
was a Hero-only scanline; the rest of the page was static. A single global decorative overlay
(faint scanlines + a slow top->bottom scan-beam) unifies the terminal feel across the whole
page. It is built as a non-interactive, accessibility-safe enhancement: `aria-hidden`,
`pointer-events: none`, a pure-CSS transform animation (no JS, no layout shift), and the beam
is removed under `prefers-reduced-motion`. It sits above content but at low opacity so text
stays legible; it is below the fixed nav (z-index) and never blocks interaction.

## Status

Accepted.

## Considered Options

- **Global above-content CRT overlay (chosen)**: one continuous page-wide sweep, cheapest
  (a single `transform`), and it unifies the scanlines site-wide. Risk: an above-content layer
  can hurt legibility — mitigated by low opacity, a brief beam pass, and a hard visual
  legibility gate; the fallback is a per-section behind-content beam.
- **Per-section behind-content beam**: content-safest, but it resets per section and
  multiplies across nine sections; kept as the fallback if legibility suffers.
- **Animated grid / aurora / particles / matrix / brightness flicker**: rejected — off-brand
  AI-slop and/or accessibility hazards (WCAG 2.3 flashing).

## Consequences

- The Hero-only `.bt-scanline` is removed (superseded); the per-section `.bt-grain` grain stays.
- The effect is pure CSS — no JS, `transform`-only (no CLS) — and fully removed under reduced
  motion. The scanline / beam opacities are single-line tunables if legibility needs a nudge.
