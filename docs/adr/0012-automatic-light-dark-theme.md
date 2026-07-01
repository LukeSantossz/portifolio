# Automatic light/dark theme via `prefers-color-scheme`, sharing the palette

The portfolio shipped dark-only (the Concrete Terminal palette). Visitors whose OS/browser is set
to light should get a light presentation without any manual action. The site now serves **both a
dark (default) and a light theme in the same palette**, chosen automatically from the visitor's
system preference — there is **no in-page theme toggle**.

## Status

Accepted.

## Considered Options

- **Token re-mapping under `@media (prefers-color-scheme: light)` (chosen)**: the design system is
  a set of CSS custom properties defined by Tailwind v4 `@theme` (the concrete ramp + accent).
  Every utility compiles to `var(--color-…)`, so redefining those variables inside a
  `prefers-color-scheme: light` media query flips the entire site — no per-component edits. The
  concrete ramp is inverted (950 = lightest surface … 50 = darkest ink) so each token keeps its
  semantic role (`bg-concrete-950` = page background, `text-concrete-50` = primary text, …). The
  accent green is deepened (`#176b33`) so small mono labels clear WCAG AA (~5.3:1) on the light
  surface; dark mode keeps the brighter `#46c06a`.
- **A manual toggle (with `localStorage` + a `data-theme` attribute)**: rejected for now — the
  request was to follow the system theme; a toggle adds a control, persistence, and an
  anti-FOUC inline script for no stated need. The token structure leaves the door open to add one
  later (switch the media query for a `[data-theme]` selector).
- **A separate light stylesheet / duplicated components**: rejected — doubles maintenance; the
  variable-flip keeps one source of truth.

## Consequences

- Light values live in one block in `src/styles/global.css`; the dark theme remains the default
  (served when the preference is dark or unset). `<meta name="theme-color">` is split by
  `media` so the browser UI tint matches each theme.
- The decorative overlays (`.bt-grain`, the CRT scanlines/beam) are low-opacity black/accent
  mixes that read acceptably on both surfaces, so they are unchanged.
- Contrast was checked for the light surface: primary text ~13:1, secondary (`concrete-300`) ~6:1,
  accent labels ~5.3:1 — all clear AA. The Lighthouse accessibility budget still applies.
