# A swipe carousel for Case studies, replacing the pinned-scroll showcase

The Case studies section previously pinned on scroll and scrubbed horizontally through the case
files (GSAP ScrollTrigger `pin` + `scrub` + `snap`, desktop + motion only; see ADR-0005). That
reads as a signature interaction on a capable desktop but is scroll-hijacking: it fights the
visitor's scroll, is invisible on mobile (the exact place a horizontal gesture is most natural),
and depends on motion being allowed. The section is now a **horizontal swipe carousel on mobile
only** — below the `md` breakpoint (768px) visitors alternate between cards by swiping/dragging
sideways (or with prev/next buttons and arrow keys) instead of scrolling down. At `md` and up the
section falls back to the **default accessible vertical stack** (no carousel, no hijack).

## Status

Accepted. Supersedes ADR-0005.

## Considered Options

- **A native scroll-snap swipe carousel on mobile, the vertical stack on desktop (chosen)**: below
  `md` the track is a horizontally scrollable scroll-snap list (`snap-x snap-mandatory`, one card
  centered with peeking neighbors); touch swipe, trackpad, and arrow keys work natively, and the JS
  only wires the prev/next buttons and the `NN / NN` readout and adds the carousel ARIA. At `md`+
  the responsive classes lay the cards out as the plain vertical stack and the JS strips the
  carousel controls + ARIA, so desktop keeps the familiar default. With no JS the track is still a
  native scrollable list — the same progressive-enhancement discipline as before, minus the
  scroll-hijack.
- **Applying the carousel at every width**: rejected — the swipe gesture is a mobile/touch idiom;
  on desktop the horizontal scroll-snap adds little over the readable stack, so larger screens keep
  the default layout.
- **Keep the pinned-scroll showcase (ADR-0005)**: rejected — scroll-hijacks, is desktop-only, and
  the horizontal move was unavailable on mobile where swiping is the intuitive gesture.
- **A JS-driven transform carousel (translateX per index)**: rejected — reimplements momentum,
  snapping, and touch physics the browser already gives for free via scroll-snap, and breaks
  without JS.

## Consequences

- The `.projects-pinned` CSS and the ScrollTrigger pin logic are removed; a `.projects-carousel`
  scroll-snap layer (mobile) + a `.no-scrollbar` utility replace them, with `md:` classes switching
  the track to the vertical stack. The GSAP heading entrance is kept.
- The carousel controls + ARIA are applied by the script only while `(max-width: 767.98px)` matches
  and are re-toggled on breakpoint change, so desktop exposes no carousel semantics.
- The full `<details>` case study is now always visible in each card (it was hidden in pin mode),
  and the result punchline is no longer line-clamped.
- The prev/next scroll uses `behavior: 'auto'` under `prefers-reduced-motion: reduce`.
