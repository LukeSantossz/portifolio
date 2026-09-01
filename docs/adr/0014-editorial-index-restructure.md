# Restructure the landing page as an editorial index, and drop the motion library

The site put its strongest evidence (four case studies with measured results) fifth,
behind About, Services and Skills, and expressed it as a repeated card. Research into
current engineer portfolios found that seven of nine well-regarded personal sites use no
card grid at all, and that the one that does is the most-cloned template on the web. The
landing page becomes five asymmetric blocks (Hero, Work, Experience, About, Contact) and
the projects become a numbered index whose rows expand into a field record.

## Status

Accepted. Supersedes ADR-0003, ADR-0004, ADR-0006, ADR-0007 and ADR-0009.

## Considered Options

- **Editorial index with expanding records (chosen)**: a numbered `<details>` row per
  project, expanding into the six case-study moves in prose beside a mono data column.
  Keeps the density of the existing schema, scans without opening anything, and works
  with no JS and no motion because the disclosure is native.
- **Restyle the seven sections in place**: rejected. The audit found the
  "AI-generated" signals were structural (seven symmetric numbered sections, one section
  scaffold cloned six times, four separate surfaces listing the same stack), so a
  restyle would have left every one of them standing.
- **A sortable engineering table of projects**: rejected as the primary layout. Each of
  the six moves runs 60 to 90 words, which a table cell cannot hold without truncating
  the substance or scrolling sideways on a phone.
- **A procedural 3D or WebGL identity element**: rejected here, on the grounds that
  nothing on this site is spatial so it would be decoration. **Revised by
  [ADR-0015](0015-blue-accent-and-ambient-field.md)**, which adds an ambient background
  field at the author's request and states the cost rather than the justification.
- **Keep GSAP for the index and drop only ScrollTrigger**: rejected once the index was
  built. With the disclosure native, the only work left for the library was a short fade
  of two columns, which one CSS keyframe does. A 70 KB dependency could not justify
  itself on that, and `gsap.set` writes `opacity: 0; visibility: hidden` as inline style,
  which a class-based failsafe cannot undo.

## Consequences

- **Motion is one implementation.** `src/scripts/reveal.ts` is a single
  IntersectionObserver; the hidden state is one CSS rule behind `html.reveal-ready`. An
  inline script arms that class before first paint and disarms it on a timer unless the
  module signals it has taken over, so a module that fails to load cannot leave the page
  blank. Nothing writes an inline style, which is the property the previous GSAP-based
  reveals lacked.
- **Shipped JavaScript falls from 119,460 bytes across two external chunks to roughly
  8 KB inline.** The `gsap` dependency is removed. (three.js later arrives for the
  ambient field in [ADR-0015](0015-blue-accent-and-ambient-field.md), lazily and off the
  critical path.)
- **Sections share one scaffold.** `src/components/layout/Section.astro` replaces six
  near-identical copies, and section copy moves to `src/data/sections.ts`.
- **The decorative layer is smaller.** The CRT beam, the skills marquee, the cursor glow
  (which was painted behind opaque section backgrounds and therefore invisible except on
  `/404`), the world map and its client-side IP lookup are gone. What remains is the
  static grain, the column rule and the scroll progress bar.
- **No visitor data leaves the page.** Removing the map removed a per-pageload request
  that sent the visitor's IP to a third-party geolocation service for a decorative dot.
- **Typography changed**, from Inter and JetBrains Mono to Archivo Variable and IBM Plex
  Mono, latin subsets only. This changes every measurement on the page, so the Lighthouse
  budget is the guard on CLS.
- **The accent marks state only.** The primary button is a solid off-white block; the
  accent is left to focus rings, hover, the active nav link and the open index row. (The
  hue itself moves to blue in [ADR-0015](0015-blue-accent-and-ambient-field.md).)
- ADR-0008 (the mobile action bar) still holds. ADR-0012 (automatic light/dark) still
  holds, and its token remapping absorbed the palette changes with no per-component edit.
- Verification follows ADR-0001 (build, type-check, Lighthouse budget, manual checklist).
