# A swipe carousel for Case studies, replacing the pinned-scroll showcase

The Case studies section previously pinned on scroll and scrubbed horizontally through the case
files (GSAP ScrollTrigger `pin` + `scrub` + `snap`, desktop + motion only; see ADR-0005). That
reads as a signature interaction on a capable desktop but is scroll-hijacking: it fights the
visitor's scroll, is invisible on mobile (the exact place a horizontal gesture is most natural),
and depends on motion being allowed. The section is now a **horizontal swipe carousel** — visitors
alternate between cards by swiping/dragging sideways (or with prev/next buttons and arrow keys)
instead of scrolling down.

## Status

Accepted. Supersedes ADR-0005.

## Considered Options

- **A native scroll-snap swipe carousel (chosen)**: the track is a horizontally scrollable
  scroll-snap list (`snap-x snap-mandatory`, one card centered with peeking neighbors). Touch swipe,
  trackpad, and arrow keys all work natively; the JS only wires the prev/next buttons and the
  `NN / NN` position readout and keeps them in sync. With no JS the track is still a native
  scrollable list, so every card stays reachable — the same progressive-enhancement discipline as
  before, minus the scroll-hijack. Works identically on mobile and desktop.
- **Keep the pinned-scroll showcase (ADR-0005)**: rejected — scroll-hijacks, is desktop-only, and
  the horizontal move was unavailable on mobile where swiping is the intuitive gesture.
- **A JS-driven transform carousel (translateX per index)**: rejected — reimplements momentum,
  snapping, and touch physics the browser already gives for free via scroll-snap, and breaks
  without JS.

## Consequences

- The `.projects-pinned` CSS and the ScrollTrigger pin logic are removed; a `.projects-carousel`
  scroll-snap layer + a `.no-scrollbar` utility replace them. The GSAP heading entrance is kept.
- The full `<details>` case study is now always visible in each card (it was hidden in pin mode),
  and the result punchline is no longer line-clamped.
- The prev/next scroll uses `behavior: 'auto'` under `prefers-reduced-motion: reduce`.
