# SPEC: feat(ui): recruiter-first adaptive mobile experience

## Problem

On a phone — where ~68% of recruiters first see a portfolio and decide within
15–30 seconds — the landing page makes a recruiter scroll through seven full
sections to grasp who the author is, whether he fits, and how to reach him, while
hover-only and decorative features (Skills cluster-highlight, the Contact-background
map) add no value or are invisible on touch.

## Design Decision

Adopt an **adaptive** mobile experience rather than one stretched layout: below the
existing `md` breakpoint (768px) the landing page gains dedicated chrome and
divergent feature treatments, while `≥ 768px` stays visually unchanged. Concretely,
mobile gets a fixed thumb-zone action bar (Email · Download CV · LinkedIn), a
compacted recruiter-first hero that lands identity + the strongest proof stat in the
first screen, a static grouped Skills view replacing the hover-driven marquee, a
hidden Contact map (with its client-side IP lookup suppressed), and a tighter
vertical rhythm. All of it stays inside the Concrete-Terminal language (ADR-0002)
and touches no content in `src/data/*` (the content-decoupling rule holds).

## Alternatives Considered

- **Responsive refinement only** (tune spacing/fold/touch, no new mobile chrome):
  rejected — it fixes friction but never delivers the recruiter "shortcuts"
  (always-available contact/CV in the thumb zone) the 15–30s first-impression goal
  needs.
- **Dedicated mobile information architecture** (recruiter-snapshot card +
  collapsible/accordion sections): rejected — largest build, ongoing dual-IA
  maintenance burden, and the unrequested-abstraction risk the standards warn
  against; the adaptive approach reaches the same goal with far less divergence.
- **Keep the Contact map on mobile but enlarge its points**: rejected — it clutters
  the small-screen form area and keeps an unnecessary third-party IP lookup running
  on phones for a near-invisible decorative element.
- **Tap-to-highlight on the Skills marquee (mobile)**: rejected — moving text is hard
  to read while scrolling; a static grouped list is scanned faster, which is the
  point on mobile.

## Scope

- **Includes:**
  - New mobile-only component `src/components/layout/MobileActionBar.astro` (fixed
    bottom, `md:hidden`, three ≥44×44px targets: Email/`mailto`, Download CV/`cvPath`,
    LinkedIn/external), rendered in `src/pages/index.astro`; page bottom clearance so
    it never occludes the Footer; honors `env(safe-area-inset-bottom)`.
  - Hero (`Hero.astro`): reduced mobile top padding and inter-block spacing,
    full-width stacked CTAs, the inline `SocialLinks` row hidden on mobile (the bar
    carries social/contact), and stat[0] surfaced within the first mobile screen with
    the full 3-up strip immediately below; desktop unchanged.
  - Skills (`Skills.astro` + `global.css`): a `md:hidden` static grouped view listing
    each `skillGroups` category as a mono label with its items as bordered chips; the
    marquee and legend become `hidden md:block`; desktop unchanged.
  - Contact map (`Contact.astro`): wrapper gains `hidden md:flex`; the `ipwho.is`
    fetch is guarded behind `matchMedia('(min-width: 768px)')` so no lookup fires on
    phones; desktop easter egg unchanged.
  - Global vertical rhythm: section padding `py-24 → py-16` on mobile (keep
    `md:py-28`) across About, Services, Skills, Experience, Contact, Projects.
  - New `docs/adr/0008-adaptive-mobile-experience.md`; a one-line consequence appended
    to ADR-0007 (map desktop-only, no mobile IP lookup); README Engineering Decisions
    indexes ADR-0008.
- **Does NOT include:**
  - The technical blog (its own later SPEC).
  - Any change to `src/data/*` content/copy, the résumé PDF, or SEO metadata.
  - Any desktop (`≥ 768px`) visual change.
  - A new design language, color, or font.
  - Tablet-specific treatment (768–1024px follows the desktop layout).
  - Changes to the Nav hamburger behavior or the scroll-progress/scroll-spy logic.

## Acceptance Criteria

1. `map_absent_and_no_ip_lookup_below_md`: at viewport `< 768px` the
   Contact-background map SVG is not displayed and no network request to `ipwho.is`
   is issued.
2. `action_bar_present_below_md_absent_at_md`: at `< 768px` a fixed bottom bar shows
   exactly three ≥44×44px controls linking to `mailto:` the configured email, the
   `cvPath` download, and the LinkedIn URL; at `≥ 768px` the bar is not rendered.
3. `action_bar_does_not_occlude_footer`: with the bar present, the Footer (incl.
   "Back to top") is fully reachable and unobscured, and the bar clears the iOS
   safe-area inset.
4. `skills_static_groups_below_md_marquee_at_md`: at `< 768px` the five skill groups
   render as labeled static lists with every item visible and no horizontal scroll,
   and the marquee is hidden; at `≥ 768px` the marquee renders and the static list is
   hidden.
5. `hero_essentials_in_first_screen_at_375`: at 375×667 the strongest stat
   ("3rd of 1,300+") and both CTAs are within the first viewport without scrolling;
   the headline causes no horizontal overflow at 320px width.
6. `no_horizontal_overflow`: `document.documentElement.scrollWidth` equals the layout
   viewport width at 320, 360, 390, and 430 px (no horizontal scroll on any section).
7. `gates_pass`: `npm run build` and `npm run check` complete with no new errors or
   warnings beyond those already present on `main`.
8. `desktop_unchanged_at_md_plus`: at `≥ 768px` the pinned Projects showcase, Skills
   marquee, Contact map, and hero spacing are visually unchanged (confirmed by visual
   pass / diff).
9. `degrades_without_motion_or_js`: under `prefers-reduced-motion: reduce` and with
   JavaScript disabled, all content including the new mobile views is fully visible
   and the action-bar links work.

## Reproducibility

- Versions: Astro `^6.3.7`, Tailwind `^4.3.0`, `@astrojs/check` `^0.9.9`, TypeScript
  `^6.0.3`; Node per the project's local toolchain.
- Static gates: `npm install` → `npm run build` → `npm run check`.
- Manual visual pass (mandatory, per the visual-verify policy): `npm run dev`, then in
  the browser device toolbar inspect widths 320 / 360 / 390 / 430 and verify AC1–AC6,
  AC8, AC9; run the Lighthouse mobile budget. iOS Safari real-device check for the
  safe-area inset (AC3).

## Risks and Assumptions

- Assumption: `md` (768px) is the correct mobile/desktop divider and tablets follow
  the desktop layout. Invalidated if the author wants 768–1024px treated as mobile.
- Assumption: hiding the hero's inline social row on mobile is acceptable because the
  action bar carries LinkedIn/email (author-approved during design).
- Assumption: no `src/data/*` content changes are required to meet the goal.
- Risk: the `--text-display` clamp floor (`3rem`) may overflow at 320px; mitigation —
  lower the mobile floor only if the manual pass shows overflow (AC5).
- Risk: iOS Safari's dynamic toolbar / safe-area can clip a fixed bottom bar;
  mitigation — `env(safe-area-inset-bottom)` padding plus a real-device check (AC3).
- Risk: presentation-only verification (no unit harness, ADR-0001) means AC1–AC6/AC8/
  AC9 are confirmed by the manual checklist rather than automated tests; mitigation —
  the checklist is explicit and run on a real device.
