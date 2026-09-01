> **Retired.** Retired in place by [ADR-0014](0014-editorial-index-restructure.md): ScrollTrigger left with GSAP. Section reveals are one shared IntersectionObserver.

# Use GSAP ScrollTrigger for scroll-driven section entrances

ADR-0003 adopted GSAP for the Hero's load-time intro. As the brutalist redesign extends
to below-the-fold sections (starting with About), those need scroll-driven entrances. We
adopt GSAP's ScrollTrigger plugin (imported from the existing `gsap` package) as the
mechanism, gated by `gsap.matchMedia()` for `prefers-reduced-motion`. The hide is applied
only inside the motion branch, so reduced-motion, no-JS, and a failed script load all
leave content visible; entrances animate transform/opacity only, protecting the CLS
budget. The legacy CSS `[data-reveal]` system stays in place for the not-yet-redesigned
sections until they migrate.

## Status

Accepted.

## Considered Options

- **GSAP ScrollTrigger (chosen)**: cohesive with the Hero's GSAP intro, precise staggered
  reveals, first-class reduced-motion gating, no new dependency (ships with `gsap`).
- **Keep the CSS `[data-reveal]` IntersectionObserver reveals**: zero new code, but a
  softer fade/slide with no shared motion vocabulary and limited sequencing control.
- **No scroll motion**: lightest, but loses the entrance rhythm the rest of the site has.

## Consequences

- ScrollTrigger is registered where used; per-section motion modules gate with
  `matchMedia` and animate transform/opacity only.
- `[data-reveal]` remains for legacy sections; each redesigned section replaces its
  `[data-reveal]` usage with a ScrollTrigger module.
- Lighthouse performance/CLS budgets are watched; if a budget breaks, reduce motion scope.
- Verification follows ADR-0001 (build + type-check + Lighthouse + manual checklist).
