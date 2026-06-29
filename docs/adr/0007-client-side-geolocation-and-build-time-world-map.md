# Client-side IP geolocation + a build-time world map (Contact-background easter egg)

A faint line world map sits behind the Contact section as an unlabeled easter egg: it marks the
author and the visitor with two neon points, with no heading, copy, or explanation. To keep the
site `output: 'static'` (no SSR/edge), the world map is generated at build/dev time from
public-domain `world-atlas` TopoJSON (projected equirectangular into a committed
`src/data/world-map.ts`), and the visitor's location is resolved **client-side from a coarse IP
lookup** (`ipwho.is`) — not via SSR geo headers and not via the browser Geolocation permission
prompt. The author point is server-rendered from `src/data/site.ts`, so the map shows with no JS
and on geo failure (only the author point shows).

## Status

Accepted.

## Considered Options

- **Client-side IP geo + build-time SVG map (chosen)**: keeps the site fully static and the
  runtime lean (no map library), no permission prompt, graceful fallback. Trade-off: the
  visitor IP reaches a third-party geo API (coarse, country/city-level, not stored, never sent
  to our origin). As an unobtrusive easter egg it carries no visible note.
- **SSR/edge geolocation (Vercel `request.geo`)**: rejected — forces `output: 'server'`.
- **Browser Geolocation API**: rejected — an intrusive permission prompt for a decorative
  element.
- **Runtime map library (d3-geo/leaflet)**: rejected — build-time SVG keeps the bundle lean.
- **A dedicated, labeled "Signal" section**: rejected — the user wanted a minimal background
  detail, not a titled section with explanatory copy.

## Consequences

- `world-atlas` + `topojson-client` are dev-dependencies; the generated path is committed, so
  the production build does not depend on them. Regenerate with `npm run genmap`.
- The map SVG is purely decorative: `aria-hidden`, `pointer-events: none`, behind the Contact
  content, unlabeled. Points pulse only with motion allowed; the layer reserves no layout
  (no CLS); the visitor IP is never sent to our origin/analytics.
- The map and its client-side IP lookup are **desktop-only**: the layer is hidden below `md` (768px)
  and the `ipwho.is` request is skipped on mobile, so phones make no third-party geo call. See
  [ADR-0008](0008-adaptive-mobile-experience.md).
