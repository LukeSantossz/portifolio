> **Retired.** Retired in place by [ADR-0014](0014-editorial-index-restructure.md): GSAP was removed from the project. The reveal is now CSS plus one IntersectionObserver, and no external script ships.

# Use GSAP as the motion library for the Hero intro

The Hero needs a controlled, staggered load-time intro. We add GSAP (core only) and
gate it behind `gsap.matchMedia()` for `prefers-reduced-motion` and breakpoints, with a
pre-paint anti-FOUC class and a failsafe so no-JS and reduced-motion users always see
the final content. The intro animates transforms/opacity only, so it does not shift
layout (protects the CLS budget).

## Status

Accepted.

## Considered Options

- **GSAP core + matchMedia (chosen)**: framework-agnostic, works in static Astro with no
  React, precise timeline/stagger control, first-class reduced-motion gating.
- **CSS keyframes only** (as today's `.reveal`): no JS payload, but awkward to sequence a
  multi-step stagger and to coordinate a single reduced-motion gate; less control.
- **A React animation library (Framer Motion / gsap-react)**: rejected — would require
  introducing React, which is explicitly out of scope.

## Consequences

- Adds the `gsap` dependency (core import only, deferred/bundled by Astro). The Lighthouse
  performance budget is watched; if it breaks, reduce the motion scope per the SPEC.
- ScrollTrigger and migrating the global `[data-reveal]` reveals to GSAP are deferred to
  later phases.
- Verification follows ADR-0001.
