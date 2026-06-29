# Adaptive mobile experience (mobile-only chrome + divergent feature treatments)

Below the `md` breakpoint (768px) the landing page is adapted for a recruiter on a phone — who
arrives in the majority of first visits and decides in seconds — rather than stretching one layout
to every width. Mobile gains dedicated chrome (a fixed thumb-zone action bar: Email · Download CV ·
LinkedIn) and divergent treatments of hover/decorative features: the Skills marquee becomes a static
grouped, scannable list; the Contact-background map and its client-side IP lookup are suppressed; the
hero is compacted so identity and the strongest proof stat land in the first screen; and section
vertical rhythm is tightened. Desktop (`≥ 768px`) is unchanged. Tablets (768–1024px) follow the
desktop layout.

## Status

Accepted.

## Considered Options

- **Adaptive mobile (chosen)**: mobile-only components rendered below `md` (`md:hidden`) and
  desktop-only behavior kept at `md:`/`lg:`. Delivers the recruiter shortcuts (always-available
  contact/CV, scannable skills) with no desktop regression and no second information architecture to
  maintain. Trade-off: a few features render differently per breakpoint, which must be kept in sync.
- **One responsive layout stretched to all widths**: rejected — fixes overflow but never delivers the
  thumb-zone contact shortcut or a touch-usable Skills view; hover-only features stay dead on mobile.
- **A dedicated mobile information architecture (snapshot card + accordions)**: rejected — largest
  build and an ongoing dual-IA maintenance burden, and the unrequested-abstraction risk the standards
  warn against, for no additional reach over the adaptive approach.

## Consequences

- New `src/components/layout/MobileActionBar.astro` is rendered only on the landing page
  (`index.astro`) and is `md:hidden`; a mobile-only clearance spacer keeps it from occluding the
  footer, and it honors `env(safe-area-inset-bottom)`.
- Skills, Contact map, and Hero each carry breakpoint-divergent markup; a change to one must be
  checked at both `< md` and `≥ md`.
- All changes are server-rendered and degrade with no JS and under reduced motion; no new dependency.
- Verification remains presentation-only (ADR-0001): the mobile behavior is confirmed by the manual
  checklist at 320/360/390/430px plus the build, type-check, and Lighthouse budget.
