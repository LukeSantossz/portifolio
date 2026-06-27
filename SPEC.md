# SPEC: feat(ui): an unlabeled easter-egg world map behind the Contact section

## Problem

The page ends at the Contact section with no personal "where you are, relative to me" touch. A
**minimal, unobtrusive** detail — discovered, not announced — would be memorable for recruiters
and reinforce the Concrete Terminal identity, without adding a labeled section or competing with
the contact content.

## Design Decision

Render a **faint line world map as a decorative background layer inside the Contact section** —
an unlabeled easter egg, NOT a dedicated section. It marks two **neon-green points**: the author
(fixed) and the visitor (located client-side by IP). There is **no heading, copy, label, or
privacy note** — just the map and the two points behind the form.

- **Placement:** a `position: absolute`, full-width, `pointer-events: none`, `aria-hidden`
  layer behind the Contact content (`z-0`, the content stays `z-10`). The map fills the section
  width (no `max-w` cap) so it doesn't look cramped; the continent lines are heavily faded
  (`text-concrete-700` at `opacity-40`) so it reads as a whisper, while the points stay
  discernible (the easter egg).
- **Static-site-safe** (unchanged from the prior approach): the world map is generated at
  build/dev time from public-domain `world-atlas` TopoJSON (`topojson-client`, devDeps) by
  `scripts/generate-world-map.mjs` → committed `src/data/world-map.ts` (`{ viewBox, d }`),
  inlined as a stroked path. The visitor is located **client-side** by a coarse IP lookup
  (`https://ipwho.is/`, ~3s timeout) — **no SSR/edge, no browser Geolocation permission
  prompt**.
- **Author point** is server-rendered from `src/data/site.ts` `site.location` (Marília, BR),
  projected with the shared equirectangular formula (`x = lon+180`, `y = 90-lat`, viewBox
  `0 0 360 180`), so it shows with no JS / on geo failure. The **visitor point** is revealed
  only on a successful geo fetch; on any failure/timeout only the author point shows.
- **Decorative + motion:** the SVG is `aria-hidden` (the section's own copy is the page content);
  the point pulse is gated by `prefers-reduced-motion`; nothing flashes; the layer reserves no
  layout (no CLS) and the late visitor dot shifts nothing.
- **Privacy:** the lookup is coarse (country/city-level), not stored, and never sent to our
  origin/analytics. As an easter egg it carries **no visible note** (recorded in ADR-0007).

This reuses the existing build-time map + geo machinery; the durable architectural choice
(client IP geo + build-time world map for a static site) is recorded in **ADR-0007**.

## Alternatives Considered

- **A dedicated, labeled "Signal" section** (the first iteration, since removed) — rejected: the
  user wanted a minimal background detail, not a titled section with heading/copy/note.
- **A visible privacy/explanatory note** — rejected for the easter-egg framing (the coarse,
  not-stored, no-prompt reasoning still holds; documented in the ADR).
- **Capping the map at the content width / centering it** — rejected: it looked cramped; the map
  now fills the full section width.
- **SSR/edge geolocation, the browser Geolocation API, a runtime map library** — rejected as
  before (would break `static`, add a permission prompt, or bloat the bundle).

## Scope

- Includes:
  - `src/components/sections/Contact.astro`: add the decorative background map layer
    (`absolute inset-0 z-0 pointer-events-none`, `aria-hidden`, full-width faded path + the
    author point + a hidden `[data-visitor-point]` hook) BEHIND the existing `z-10` content;
    add the `worldMap` import + the author projection (`ax`/`ay`) in frontmatter; append the
    visitor-geo `<script>` (targets `#contact [data-visitor-point]`, `ipwho.is`, fail-safe).
  - Reused from the prior tasks (kept): `src/data/world-map.ts`, `site.location` in
    `src/data/site.ts`, `scripts/generate-world-map.mjs` + the `world-atlas`/`topojson-client`
    devDeps + the `genmap` script, and the `.signal-point`/`.signal-pulse`/`@keyframes
    signal-ping` + reduced-motion CSS in `src/styles/global.css`.
  - Remove the dedicated section: delete `src/components/sections/Signal.astro` and its
    `<Signal />` wiring in `src/pages/index.astro`.
  - `docs/adr/0007-...md` + the README row reflect the Contact-background easter egg.
- Does NOT include:
  - A heading, copy, label, or privacy note for the map; a dedicated section.
  - SSR/edge rendering, a runtime map library, or `navigator.geolocation`.
  - Any change to other sections or content copy; sending the visitor IP to our origin.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit harness,
per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds` / `typecheck_clean`: `npm run build` exit 0; `npm run check` 0 errors.
- `map_is_contact_background`: the world-map SVG renders inside `#contact` as an
  `absolute inset-0 z-0 pointer-events-none` `aria-hidden` layer behind the content; the
  continent path is full-width and faded (`opacity-40` on `text-concrete-700`).
- `no_dedicated_section`: `Signal.astro` is removed; `#signal` and any `08 / SIGNAL` label do
  not exist; `index.astro` no longer imports/renders `Signal`.
- `unlabeled`: the map area has no heading, label, copy, or privacy note (no `08 / SIGNAL`, no
  "never stored" text).
- `author_point_static` + `visitor_point_progressive`: the author point (projected from
  `site.location`) renders with no JS; on a successful `ipwho.is` fetch the visitor point
  appears; on failure/timeout/no-JS only the author point shows and nothing errors.
- `no_permission_prompt` + `static_preserved`: no `navigator.geolocation`; `output: 'static'`
  unchanged; no SSR adapter / runtime map library in `dependencies`.
- `decorative_a11y` + `cls_safe`: the SVG is `aria-hidden` and non-blocking; the pulse is
  gated by `prefers-reduced-motion`; the layer reserves no layout (the visitor dot causes no
  shift).
- `content_decoupled`: the author coordinates live in `src/data/site.ts` (`site.location`).
- `adr_recorded`: ADR-0007 (updated to the easter-egg framing) exists and is linked from the
  README.
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes
  (accessibility ≥0.95, CLS ≤0.1, performance not regressed by the inline SVG / async fetch).

## Reproducibility

- Install: `npm install` (`world-atlas` + `topojson-client` devDeps). Regen map: `npm run
  genmap`. Build: `npm run build`; type-check: `npm run check`.
- Static/fallback: load with JS off, or block `ipwho.is` → only the author point shows behind
  the Contact content. Visitor point: with network on, it appears after the geo fetch.
- Reduced motion: emulate `prefers-reduced-motion: reduce` → the point pulse stops.
- Visual: the faded full-width map sits behind the form; the two green points are discernible
  but unobtrusive; the map fades into the background.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, Node 22; `world-atlas` +
  `topojson-client` (devDeps).

## Risks and Assumptions

- Risk: the geo API (`ipwho.is`) can fail/rate-limit/be blocked → graceful fallback to the
  author-only map (a short timeout; the layer never depends on it to render).
- Risk (privacy): the visitor IP reaches a third-party geo API. Mitigation: coarse, not stored,
  never sent to our origin, no permission prompt; documented in ADR-0007 (no visible note, per
  the easter-egg framing).
- Risk: the ~66KB inline world-map path adds page weight. Mitigation: a simplified land outline;
  if the Lighthouse transfer/perf budget regresses, externalize it as a `public/` SVG fetched
  lazily.
- Risk: the faded map could read as too faint or too present. Mitigation: opacity/stroke are
  single-line tunables; verified in the browser by the user.
- Invalidation: re-introducing a labeled section, a permission prompt, SSR, or a runtime map
  library invalidates this spec.
