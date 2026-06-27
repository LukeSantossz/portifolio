# SPEC: refactor(ui): unify migrated sections on the Concrete text ramp and brighten meaning-carrying hairlines

## Problem

The audit of the already-migrated sections found two coherence defects (the un-migrated
legacy sections — Contact, Nav, Footer, SocialLinks, 404 — are out of scope; they are
separate redesign phases):

1. **Body-text color is split.** Five sections use the designed Concrete ramp
   (`text-concrete-50` headings + `text-concrete-300` body): Hero, About, Skills, Projects,
   ProjectCard. Two sections — Services and Experience — were forced to pure `text-white`
   for *every* text node during the earlier "invisible text" incidents. Those incidents were
   later root-caused to a Tailwind v4 token collision (`--color-base` ↔ the `text-base`
   font-size utility), now fixed by the `--color-base` → `--color-canvas` rename. With the
   real cause gone, `concrete-300` (#b8b5ad, ~8.9:1) is fully legible, so the pure-white
   override is no longer needed and now makes Services/Experience the off-ramp outliers
   (harsher/cooler than the warm concrete palette, and flatter — no primary/secondary
   hierarchy).

2. **Meaning-carrying hairlines are near-invisible.** `border-concrete-700` (#3a3a3a) on
   `bg-concrete-950` (#0e0e0e) is ~1.6:1. That is acceptable for purely decorative chip/marker
   outlines, but the **Experience timeline spine** (which IS the timeline) and the **About
   stack-list dividers** (structural row separators) carry meaning and are effectively
   invisible.

There are no other token↔utility collisions (audit confirmed all 15 `@theme` color names and
both `--text-*` tokens are safe after the `canvas` rename).

## Design Decision

Adopt one canonical **Concrete text ramp** across all migrated sections and bring the two
outliers onto it; brighten only the meaning-carrying hairlines.

- **Canonical text ramp** (already followed by Hero/About/Skills/Projects/ProjectCard):
  - Primary (section headings `h1/h2`, item titles `h3`, key values): `text-concrete-50`.
  - Secondary (intro/body paragraphs, descriptions, highlights, meta labels, periods, kind
    tags, org suffix, section-label wrapper): `text-concrete-300`.
  - Signal: `text-accent` (green) for the section-label inner span, the role tagline,
    "Result", and hover states — unchanged.
  - Section wrapper default: `text-concrete-50`.
  Services and Experience are rewritten from blanket `text-white` to this ramp. The five
  conformant sections are unchanged (verified to already match).
- **Hairlines:** add one mid-ramp token `--color-concrete-500: #6b675f` (~3.4:1 on
  `concrete-950`) and apply it to the Experience timeline spine and the About stack-list
  dividers. Purely decorative borders (ProjectCard stack chips, Skills legend marker, the
  `.skill-chip` outline) stay at `concrete-700`.

This also resolves the redundant/dead text-color nits: the Experience `· org` span (was
`text-white` inside a `text-white` h3) becomes a meaningful `text-concrete-300`, and the
Services/Experience wrapper defaults become the meaningful primary `concrete-50`.

## Alternatives Considered

- **Standardize on `concrete-50` everywhere (bright warm off-white)** — rejected: flattens the
  primary/secondary hierarchy the ramp is built on; the five conformant sections would all
  change.
- **Standardize on pure `#fff`** — rejected: off the warm concrete ramp (harsh/cool), and
  would change five sections to chase the two outliers.
- **Brighten hairlines to `concrete-300`** — rejected for hairlines: ~8.9:1 reads too heavy
  for a 1–2px rule; a dedicated ~3.4:1 mid token is the right weight.
- **Keep all hairlines at `concrete-700`** — rejected: the timeline spine and structural
  dividers carry meaning and were effectively invisible (user-confirmed).
- **Migrate the legacy sections now (Contact/Nav/Footer/SocialLinks/404)** — rejected: those
  are separate redesign phases, not this coherence pass.

## Scope

- Includes:
  - `src/styles/global.css`: add `--color-concrete-500: #6b675f;` to the `@theme` concrete
    ramp (between `concrete-700` and `concrete-300`), with a one-line comment ("mid hairline
    rule on dark, ~3.4:1").
  - `src/components/sections/Services.astro`: replace blanket `text-white` with the ramp —
    heading/`h3` titles → `text-concrete-50`; intro + service body + the ledger index numbers
    + the section-label wrapper → `text-concrete-300`; section wrapper default →
    `text-concrete-50`. Green accent / `group-hover:text-accent` unchanged.
  - `src/components/sections/Experience.astro`: replace blanket `text-white` with the ramp —
    section wrapper + heading + role `h3` → `text-concrete-50`; section-label wrapper +
    period + kind tag + `· org` span + description + highlights → `text-concrete-300`. Markers
    (`bg-accent` / `border-accent`), the green `▸` bullets, and the section-label inner span
    stay green. The timeline spine `border-concrete-700` → `border-concrete-500`.
  - `src/components/sections/About.astro`: the stack-list dividers `border-concrete-700` →
    `border-concrete-500` (structural separators). No other About change.
- Does NOT include:
  - Any change to Hero, Skills, Projects, ProjectCard (verified already on the ramp) beyond
    a no-op conformance check.
  - Any migration of the legacy-palette sections (Contact, Nav, Footer, SocialLinks, 404).
  - The purely decorative `concrete-700` borders (ProjectCard chips, Skills legend marker,
    `.skill-chip`) — they stay.
  - Any content/copy change, any layout/motion change, any new section behavior.
  - Removing `text-white` from places it is legitimately required (e.g. the dark-on-green CTA
    buttons use `text-canvas`, not `text-white`; unaffected).

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `ramp_unified`: `Services.astro` and `Experience.astro` contain **no** `text-white`; their
  text uses only `text-concrete-50` (primary) and `text-concrete-300` (secondary) plus
  `text-accent` (green). Headings/titles are `concrete-50`; body/meta are `concrete-300`.
- `conformant_unchanged`: Hero, Skills, Projects, ProjectCard, and the About *text* colors are
  unchanged (the only About edit is the divider border token).
- `token_added`: `--color-concrete-500: #6b675f` is defined in the `@theme` block; the
  Experience timeline spine and About stack dividers reference `border-concrete-500`; no
  decorative chip/marker border was changed (they remain `concrete-700`).
- `nits_resolved`: the Experience `· org` span is `text-concrete-300` (distinct from its
  `concrete-50` `h3`); no element carries two conflicting `text-*` color classes.
- `still_visible`: with the `text-base` collision fixed, every changed body text renders its
  intended concrete tone at all breakpoints (no element resolves to the page background);
  spot-checked at desktop width.
- `no_collisions_remain`: no `@theme` color name collides with a Tailwind utility scale word
  (regression guard for the `base` class of bug).
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes
  (accessibility ≥0.95, CLS ≤0.1).
- `content_unchanged`: `git diff` shows no change under `src/content/` or `src/data/`.

## Reproducibility

- Install: `npm install`. Build: `npm run build`; type-check: `npm run check`.
- Color audit: `grep -n "text-white\|text-concrete-\|border-concrete-" src/components/sections/{Services,Experience}.astro`
  — expect no `text-white`, only `concrete-50`/`concrete-300`/`concrete-500`/accent.
- Token: `grep -n "concrete-500" src/styles/global.css` — expect the new token; grep the
  spine/divider usages.
- Visual: `npm run preview`; at **desktop width** confirm Services and Experience body text is
  the warm `concrete-300`, headings `concrete-50`, the timeline spine is visible, and nothing
  is invisible.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, Node 22 in CI.

## Risks and Assumptions

- Assumption: the `--color-base` → `--color-canvas` fix is in place (it is, commit `7a5a179`),
  so `concrete-300` body text renders correctly at all widths.
- Assumption: the five conformant sections already follow the ramp (audit-confirmed); this
  pass only touches the two outliers + the two hairline spots + the token.
- Risk: `concrete-500` (#6b675f, ~3.4:1) could still read faint for the user's environment.
  Mitigation: it is a decorative rule (not text); if too faint, nudge the token lighter — a
  single-line change. Text legibility does not depend on it.
- Risk: reverting Services/Experience off pure white could re-introduce a perceived
  "too dim" reaction. Mitigation: the prior dimness was the `text-base` collision (now fixed),
  not `concrete-300`; the user chose the concrete ramp with that understanding.
- Invalidation: re-introducing a blanket `text-white` override, or migrating a legacy section
  here, invalidates this spec.
