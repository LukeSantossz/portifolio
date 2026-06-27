# Use GSAP ScrollTrigger pinning for the Projects showcase, over an accessible base

The Projects section is the portfolio's proof centerpiece. To present each case study with
maximum impact, it pins on scroll and moves horizontally through metric-forward "case
files" (GSAP ScrollTrigger `pin` + `scrub` + `snap`). Pinning/scroll-hijacking carries real
accessibility and performance risk (the Hero SPEC deferred it for exactly that), so it is
built strictly as a progressive enhancement: the DOM is an accessible vertical stack of full
case files (with the complete `<details>` narrative), and the pin is activated only by a
single `gsap.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 1024px)')`
that fully reverts on cleanup.

## Status

Accepted.

## Considered Options

- **Pinned horizontal showcase over an accessible static base (chosen)**: maximum impact on
  capable desktops, with no-JS / reduced-motion / small-screen users getting the readable
  stack. The pin never traps focus and preserves document order.
- **Keep the 3D perspective deck**: rejected — least brutalist element, bespoke fragile JS.
- **Static stack only (no pin)**: kept as the fallback, not the primary desktop experience;
  the cinematic showcase was the explicit goal.

## Consequences

- The static stack is the source of truth; the pin is an enhancement gated by `matchMedia`.
- The full case-study narrative is read in the static base (and each repo); the pinned panel
  shows the concise impact view (metric + Result + summary).
- Animation is transform/opacity only and uses a pin-spacer; the Lighthouse a11y (≥0.95) and
  CLS (≤0.1) error budgets gate it.
- Verification follows ADR-0001 (build + type-check + Lighthouse + manual/browser checklist).
