# Move the accent to blue, and add a reactive WebGL background field

The single chromatic signal moves from green to blue, and a WebGL particle field
laid out along a lemniscate sits behind the hero, reacting to the pointer and to
scroll. Both are author decisions about identity rather than conclusions from the
research pass, and this record exists so the trade-offs are not lost.

## Status

Accepted. Amends ADR-0002 (which set green as the single signal) and revises the
"no 3D" position taken in ADR-0014.

## Considered Options

- **Blue accent plus an ambient field (chosen).** Blue reads as instrumentation
  rather than agriculture, which fits a portfolio about retrieval and evaluation.
  The field gives the first screen depth and responds to the visitor.
- **Keep green, add blue as a second accent with its own job** (blue for measured
  values, green for state). Rejected by the author: two chromatic signals are
  harder to hold consistent than one, and the green carried a domain association
  the site no longer wants.
- **A figure inside the Ravel record instead of a background** (a point cloud
  showing the semantic-entropy clusters, where geometry explains the mechanism).
  Built, then removed: the author wanted ambience behind the site, not a diagram
  inside a case study. Recoverable from this branch's history if it is ever
  wanted back.
- **No 3D at all**, which is what ADR-0014 decided. Superseded here: the cost is
  understood and paid for by the mitigations below rather than assumed away.

## Consequences

- **This is decoration, and the record says so.** The field carries no
  information. ADR-0014 rejected 3D on exactly that basis; the position changed
  because the author asked for it, not because the argument was answered.
- **three.js costs 734 KB raw, about 188 KB gzipped.** It is kept off the
  critical path: the module is imported dynamically after `load` and inside
  `requestIdleCallback`, so no external script blocks the first paint. Measured
  effect on the landing page: LCP 1.7s to 1.8s, TBT 0ms to 60ms, CLS unchanged at
  0.001, performance score unchanged at 99.
- **It stops drawing when nobody is looking:** paused when the tab is hidden and
  when the hero scrolls out of view, since every section below it paints an
  opaque background over the canvas anyway.
- **Reduced motion gets one static frame**, not a frozen loop and not a blank
  canvas.
- **The field is confined to the first screen** by the section backgrounds, so it
  never sits behind the dense reading sections. It is also offset to the right of
  the text column on wide screens, and dimmed on narrow ones where there is no
  spare column.
- Failure is silent to the visitor but not to the developer: no WebGL, or a
  failed import, leaves the plain background and logs a warning.
- `preserveDrawingBuffer` is enabled. It costs little for one small point cloud
  and makes the canvas survive compositing, which is what allows the field to be
  screenshotted and verified at all.
- Lighthouse now reports `valid-source-maps` as failing, because three.js is a
  large bundle shipped without maps. Accepted: it is a debugging diagnostic, and
  publishing 3 MB of source maps to satisfy it would be a worse trade. The
  best-practices score stays at 96, above the 95 budget.
- Every accent value was re-derived for both themes: `#5aa9ff` at 7.9:1 on the
  dark page, `#0b5cad` at 5.5:1 on the light one, both above the 4.5:1 AA bar for
  small text.
