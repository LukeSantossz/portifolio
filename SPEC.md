# SPEC: feat(ui): add a "Signal" geo-tracking section — a line world map with you + the visitor

## Problem

The page ends at Contact → Footer with no personal "reach" flourish. A subtle, on-brand
closing element that connects the author to each individual visitor — framed as a
declassified/radar "tracking" panel — would be memorable for recruiters and reinforce the
Concrete Terminal identity, without competing with content.

## Design Decision

Add **one dedicated "Signal" section** between Contact and the Footer: a **line-drawn world
map** (continent outlines, equirectangular) with **two neon-green points** — the author
(fixed) and the visitor (located client-side by IP). Minimal by choice: **no connecting arc,
no distance/coordinate readouts** — just the two points on the map.

- **Static-site-safe.** The site stays `output: 'static'`:
  - The world map is generated at **build time** from a public dataset (`world-atlas`
    TopoJSON via `topojson-client`, dev-dependencies) by a small script
    (`scripts/generate-world-map.mjs`) that projects land/countries to an **equirectangular**
    SVG `path` and writes it to `src/data/world-map.ts` (`{ viewBox, d }`). The component
    inlines that path as a stroked (no-fill) concrete line drawing. No runtime map library.
  - The **visitor location is fetched client-side** (no SSR/edge): a small module `<script>`
    fetches `https://ipwho.is/` (free, no key, HTTPS, CORS, returns `latitude`/`longitude`),
    projects it with the same equirectangular math, and reveals the visitor dot. **No browser
    Geolocation permission prompt** (IP-based, coarse, country/city-level).
- **The author's point is server-rendered** from `src/data/site.ts` (`site.location =
  { lat, lon, label }`, Pompéia/SP, BR ≈ `-22.12, -50.18`) so it always shows, even with no
  JS / failed geo.
- **Graceful fallback:** if the geo fetch fails, times out (~3s), or returns bad data, only
  the author's point shows — the section never errors or blocks.
- **Accessibility / motion:** the map + points are decorative — the SVG is `aria-hidden` with
  a concise text equivalent for the section's meaning; any point pulse / map line-draw is CSS
  gated by `prefers-reduced-motion` (static otherwise); nothing flashes; the section reserves
  its layout (no CLS when the visitor dot appears).
- **Privacy:** a discreet note ("approximate location from your IP — not stored") sits under
  the map; the IP only ever reaches the geo API (never our origin).

This is a durable, externally-dependent architectural choice → record **ADR-0007
(client-side IP geolocation + build-time world map for a static site)**.

## Alternatives Considered

- **Visitor's country drawn as the full-page background** (the user's first idea) — rejected:
  clutters the grain/CRT background, heavier, less tasteful than a contained panel.
- **Placement in the Footer / inside Contact** — rejected: the user chose a dedicated section
  at the end.
- **Connecting arc + distance/lat-lon readouts** ("full telemetry") — rejected: the user chose
  the minimal two-points treatment.
- **SSR/edge geolocation** (Vercel `request.geo`) — rejected: it would force `output: 'server'`;
  client-side IP geo keeps the site fully static.
- **Browser Geolocation API** — rejected: it shows a permission prompt (intrusive; most
  decline) for a decorative ambient element.
- **A bare graticule/coordinate grid instead of continents** — rejected: the user wants a
  recognizable world map (continent outlines), so real geometry is generated at build.
- **A runtime map library (d3-geo / leaflet)** — rejected: build-time SVG generation keeps the
  runtime lean (no map JS shipped).

## Scope

- Includes:
  - `src/data/site.ts`: add `location: { lat: number; lon: number; label: string }` (the
    author's fixed point).
  - Build-time map: add dev-dependencies `world-atlas` + `topojson-client`; add
    `scripts/generate-world-map.mjs` (reads the world TopoJSON, projects land to
    equirectangular, emits a stroked SVG `path`); add the generated `src/data/world-map.ts`
    (`export const worldMap = { viewBox: string; d: string }`). Wire the generation into the
    build (a `pregenerate`/`prebuild` step or a committed artifact + a documented regen
    command).
  - New `src/components/sections/Signal.astro`: Concrete Terminal chrome (`border-t-2
    border-concrete-50 bg-concrete-950`, grain, `08 / SIGNAL` green mono label, a short
    heading), and an inline SVG (`aria-hidden`) = the `worldMap.d` path (stroked, concrete
    line) + the author's neon-green point at its projected position; a placeholder/hook for
    the visitor point; the privacy note; a concise visible/sr text equivalent.
  - The visitor-geo `<script>` (module): fetch `ipwho.is` with a ~3s timeout, project
    `latitude`/`longitude` with the shared equirectangular helper, position + reveal the
    visitor dot; on any failure leave only the author's dot. No permission prompt; no PII
    stored.
  - Render `<Signal />` between `<Contact />` and `<Footer />` in the page that composes the
    sections (`src/pages/index.astro`).
  - Shared projection helper (equirectangular: `x = (lon+180)/360 * W`, `y = (90-lat)/180 * H`)
    used by both the build script and the runtime script (kept consistent with the SVG
    `viewBox`).
  - `docs/adr/0007-client-side-geolocation-and-build-time-world-map.md` + a README Engineering
    Decisions row.
- Does NOT include:
  - Any change to other sections, the Footer/Contact internals, or content copy.
  - The connecting arc, distance, or coordinate readouts (minimal by choice).
  - SSR/edge rendering, a runtime map library, or the browser Geolocation API.
  - Storing/sending the visitor IP to our own origin or analytics.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0 (including the world-map generation step).
- `typecheck_clean`: `npm run check` reports 0 errors.
- `map_renders_static`: `#signal` server-renders the inline world-map SVG (the `worldMap.d`
  path present) and the author's neon point at the projected `site.location` — visible with
  **no JS** and on geo failure.
- `visitor_point_progressive`: with JS + a successful `ipwho.is` response, a second neon point
  appears at the visitor's projected lat/lon; on failure/timeout/no-JS, only the author's
  point shows and nothing errors.
- `no_permission_prompt`: the page never calls `navigator.geolocation` (IP-based only).
- `minimal_treatment`: no connecting arc and no distance/coordinate readouts are rendered
  (two points only).
- `static_site_preserved`: the project stays `output: 'static'`; no SSR/edge; the only new
  runtime code is the inline SVG + the geo `<script>` (no map library in the bundle).
- `decorative_a11y`: the SVG is `aria-hidden`; the section has a concise text equivalent;
  point pulse / line-draw is gated by `prefers-reduced-motion`; nothing flashes.
- `cls_safe`: the section reserves its layout; the late-appearing visitor dot causes no layout
  shift; the Lighthouse CLS budget (≤0.1) holds.
- `privacy_note`: a discreet "approximate, from your IP, not stored" note is present; the IP
  goes only to the geo API.
- `content_decoupled`: the author's coordinates live in `src/data/site.ts` (not hard-coded in
  the component).
- `adr_recorded`: `docs/adr/0007-...md` exists and is linked from the README Engineering
  Decisions table.
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes
  (accessibility ≥0.95, CLS ≤0.1, performance not regressed by the inline SVG / async fetch).

## Reproducibility

- Install: `npm install` (adds `world-atlas` + `topojson-client` devDeps). Regenerate the map:
  `node scripts/generate-world-map.mjs` (also run by the build). Build: `npm run build`;
  type-check: `npm run check`.
- Static/fallback: load with JS disabled, or block `ipwho.is` in devtools → only the author's
  point shows; the section renders fine.
- Visitor point: with network on, the visitor dot appears after the geo fetch resolves.
- Reduced motion: emulate `prefers-reduced-motion: reduce` → no pulse/draw, points static.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, Node 22 in CI; `world-atlas`
  (TopoJSON world dataset, public domain) + `topojson-client` (BSD) as devDeps.

## Risks and Assumptions

- Risk: the geo API (`ipwho.is`) can fail, rate-limit, or be blocked. Mitigation: a short
  timeout + a graceful fallback to the author-only map; the section never depends on it to
  render.
- Risk (privacy): the visitor's IP reaches a third-party geo service. Mitigation: coarse
  (country/city-level), not stored by us, never sent to our origin/analytics, with a
  transparent note; no Geolocation permission prompt. Document in the ADR.
- Risk: the world SVG path could be large. Mitigation: use a simplified land outline
  (low-precision TopoJSON) so the inline path stays small; it is static markup (cacheable).
- Risk: IP geo is approximate (can be off by a city/region, or show the VPN exit). Acceptable
  for a single decorative dot; the note says "approximate".
- Risk: projection mismatch between the build SVG and the runtime dot. Mitigation: one shared
  equirectangular formula keyed to the SVG `viewBox`.
- Invalidation: requiring exact geolocation, adding a permission prompt, moving to SSR, or
  shipping a runtime map library invalidates this spec.
