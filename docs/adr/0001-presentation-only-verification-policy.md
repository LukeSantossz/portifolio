# Presentation-only verification: build, type-check, Lighthouse, and manual checks instead of unit TDD

The `.standards` framework mandates test-first development (red-green-refactor), but
this repository is a static Astro presentation site with no business logic and no test
harness: its substance is markup, styling tokens, and copy decoupled into `src/data`
and `src/content`. Forcing a unit-test layer onto presentation would add tooling and
maintenance with almost nothing meaningful to assert. We therefore define, for
presentation-only changes, a binding set of verification gates that stand in for
unit-level TDD, and we record the deviation here rather than letting it pass silently.

For a presentation-only change the binding gates are:

- `npm run build` exits 0,
- `npm run check` reports 0 type errors,
- the Lighthouse CI budget in `lighthouserc.json` still passes, and
- a named manual checklist is satisfied (reduced-motion honored, `:focus-visible`
  visible on interactive elements and skip-link working, decorative texture
  `aria-hidden` and non-focusable).

## Status

Accepted.

## Considered Options

- **Presentation-only gate policy (chosen)**: the four gates above are binding for
  presentation work; the deviation from unit-TDD is documented here. Matches the
  codebase (no logic to unit-test) and keeps governance honest by naming the gap
  instead of ignoring it.
- **Minimal unit harness (Vitest)**: add a runner plus a few invariant tests. Rejected
  for now — adds tooling and maintenance for a site with little to assert; revisit if
  real logic grows.
- **Full TDD harness (Vitest + component/Playwright)**: test-first for DOM and motion.
  Rejected — heaviest setup and maintenance, disproportionate to a static vitrine, and
  it slows delivery without a proportional correctness gain.

## Consequences

- Presentation changes are verified by the four gates, named in each SPEC's Acceptance
  Criteria and in the PR checklist. The absence of a unit harness is a known, documented
  deviation, not a silent gap.
- A change that introduces genuine logic (parsing, computation, data transforms) reverts
  to test-first for that logic; this policy covers presentation only.
- R2 (cross-provider review) and R3 (automated PR review) are unaffected; this ADR
  addresses only the unit-test layer.
- This ADR is the durable home for the rationale, indexed from the README Engineering
  Decisions table, per `.standards/docs/adr/0001-decision-records-flow.md`.
