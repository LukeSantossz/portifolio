# Adopt the "Concrete Terminal" industrial-brutalist design language

The portfolio read as a soft "agribusiness-green minimal" site that gave a technical
recruiter no distinctive visual signal in the first scroll. We adopt an
industrial/brutalist design language — "Concrete Terminal" — and ship it in phases:
phase one introduces a reusable design system (monochrome concrete/black/off-white
ramp with green as the single signal, mono-forward typography with extreme
display-vs-label contrast, hard borders + hard-offset shadows, decorative grain and a
Hero-only scanline) and redesigns the Hero as the flagship. Remaining sections follow
in later, separate SPECs.

## Status

Accepted.

Amended, not revoked. The Hero-only `.bt-scanline` described above was superseded by the
global CRT ambient overlay in ADR-0006, which replaced it with one page-wide scanline and
scan-beam layer; the per-section `.bt-grain` stayed. ADR-0013 later tempered the grain
opacity and the cursor-glow values without revoking ADR-0002 or ADR-0006. Everything else
here (the concrete ramp, the single green signal, the mono-forward type contrast, the hard
borders and hard-offset shadow) remains the shipped language. This record keeps its number
and file per the durable-records rule in `.standards/docs/standards/spec_method.md`.

## Considered Options

- **"Concrete Terminal" phased (chosen)**: ship the design system + Hero pilot first,
  migrate other sections later. Validates the language at low risk.
- **"Blueprint / Declassified" heavier industrial**: visible technical grid, heavy
  degradation, pinned/scrubbed Hero. Rejected for now — performance and accessibility
  risk, over-styled for a recruiter audience.
- **"Quiet Brutalist" (minimal motion, no texture)**: rejected — too close to the
  current restrained look, would not deliver a distinctive identity.
- **Full monochrome, drop green entirely**: rejected — loses brand recognition; green
  stays as the single signal.
- **Big-bang redesign of every section at once**: rejected — larger risk, oversized
  hard-to-review change; a phased pilot is safer.

## Consequences

- A reusable token + pattern layer lands in `src/styles/global.css`; the Hero consumes
  only the monochrome ramp + green. The harvest-gold token stays defined but unused in
  the Hero scope.
- Later phases migrate the remaining sections to the language under their own SPECs.
- Verification follows ADR-0001 (build + type-check + Lighthouse + manual checklist).
