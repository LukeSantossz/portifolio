# Visual system: Lucas Gonçalves portfolio

## Intent

An **industrial editorial** portfolio for applied AI/ML work: precise, evidence-led, and
readable under recruiter time pressure. The interface should read as a concise field
report, not a generic SaaS template and not a decorative terminal simulation.

The structure carries most of that intent. Five asymmetric blocks (Hero, Work, Experience,
About, Contact) replace the seven symmetric sections the site used to have, because
symmetry and a cloned section scaffold are the structural tells an engineering audience
discounts. See [ADR-0014](docs/adr/0014-editorial-index-restructure.md).

## Principles

- **Evidence over decoration.** A number appears with the conditions that produced it, or
  it does not appear.
- **One signal color, and it never fills a surface.** The accent marks state: focus, the
  current nav section, the open index row. Buttons and surfaces stay monochrome.
- **One of each thing.** One section scaffold, one reveal implementation, two button
  patterns, one structural ornament. A second variant needs a reason.
- **The static page is the real page.** Disclosure is native `<details>`; motion is
  additive. A script that never loads must not be able to hide content.

## Tokens

All tokens live in the `@theme` block of `src/styles/global.css`. Tailwind v4 compiles each
one to a utility (`--color-accent` becomes `bg-accent`, `text-accent`, `border-accent`), so
prefer the token utility to an arbitrary value.

| Role | Token | Dark (default) | Notes |
| --- | --- | --- | --- |
| Page background | `--color-concrete-950` | `#0e0e0e` | |
| Raised surface | `--color-concrete-900` | `#161616` | open index row, code blocks, inputs |
| Hard rule | `--color-concrete-700` | `#3a3a3a` | section top border, column rule, index row borders |
| Mono label text | `--color-concrete-500` | `#8f8b82` | 5.7:1 on the page |
| Secondary text | `--color-concrete-300` | `#b8b5ad` | body copy default |
| Primary ink | `--color-concrete-50` | `#ece9e2` | headings, primary button fill |
| Signal | `--color-accent` | `#5aa9ff` | state only, 7.9:1 on the page |
| Point cloud | `--color-accent-vivid` | `#2f8fff` | WebGL graphics only, not held to a text ratio |
| Alert | `--color-alert` | `#ff8a75` | form error text, 7.4:1 |

The accent is blue rather than green: the cool signal reads as instrumentation instead of
agriculture, and the site is about retrieval and evaluation as much as about the field. The
change is recorded in [ADR-0015](docs/adr/0015-blue-accent-and-ambient-field.md), which
amends ADR-0002.

Other tokens:

| Role | Token | Value |
| --- | --- | --- |
| Hard shadow | `--shadow-hard` | `5px 5px 0 0 var(--color-concrete-50)`, no blur |
| Sans face | `--font-sans` | Archivo Variable, then the system sans stack |
| Mono face | `--font-mono` | IBM Plex Mono, then the system mono stack |

## Type scale

The scale is fluid: one `clamp()` per role rather than per-breakpoint sizes, so every step
is continuous between 375px and 1440px and no size is defined twice.

| Token | Clamp | Used for |
| --- | --- | --- |
| `--text-display` | `clamp(2.75rem, 9vw, 7rem)` | the name, once per page |
| `--text-headline` | `clamp(1.75rem, 4.5vw, 3rem)` | section headings |
| `--text-index` | `clamp(1.375rem, 3.2vw, 2.25rem)` | project index rows |
| `--text-lede` | `clamp(1.0625rem, 0.98rem + 0.4vw, 1.25rem)` | opening paragraph of a section |
| `--text-label` | `0.6875rem` | mono label, always with uppercase + wide tracking |

Archivo carries display and body copy; `font-semibold` is the heaviest weight in use, with
`tracking-[-0.03em]` on headings. IBM Plex Mono carries labels, periods, metrics, stack
lists, buttons and form labels. A mono label is always uppercase with tracking between
`0.2em` and `0.3em`; that pairing is what makes it read as an instrument label rather than
as small body text.

## Light theme

Automatic, following the visitor's OS or browser preference
([ADR-0012](docs/adr/0012-automatic-light-dark-theme.md)). The same six ramp names are
re-mapped so `bg-concrete-950` still means "page" and `text-concrete-50` still means "ink";
no markup changes between themes.

| Token | Dark | Light |
| --- | --- | --- |
| `--color-concrete-950` | `#0e0e0e` | `#ece9e2` |
| `--color-concrete-900` | `#161616` | `#dedad1` |
| `--color-concrete-700` | `#3a3a3a` | `#c3beb2` |
| `--color-concrete-500` | `#8f8b82` | `#605c55` |
| `--color-concrete-300` | `#b8b5ad` | `#57534b` |
| `--color-concrete-50` | `#ece9e2` | `#1c1a17` |
| `--color-accent` | `#5aa9ff` | `#0b5cad` |
| `--color-alert` | `#ff8a75` | `#a3231a` |

The accent and the alert are the two tokens that do not simply invert: both are re-derived
so small text clears WCAG AA on the light surface (5.5:1 and 5.9:1 respectively).

## Layout

- **One page container.** `mx-auto max-w-6xl px-6`, applied by `Section.astro` and by the
  hero. There is no second width rail; a block that needs to feel narrower does it with a
  `max-w-[Nch]` measure on the text, not with a different container.
- **Measure caps.** Headings cap at `max-w-[18ch]`, ledes at `max-w-[62ch]`, body at
  `max-w-[64ch]`.
- **Section rhythm.** `py-20 md:py-28`, with a `border-t border-concrete-700` at the top of
  every block. No section defines its own vertical rhythm.
- **The column rule** (`.column-rule`) is the one structural ornament: a single hairline
  down the left edge of the content column at `lg` and up, with the index numbers hanging
  off it so it reads as an alignment guide. Hidden below `lg`, where the column is the
  viewport.

## Components

- **Section scaffold.** `src/components/layout/Section.astro` is the only one. It owns the
  top rule, the grain layer, the container, and the label + heading + optional lede header.
  The heading is a real `<h2>` and the section is `aria-labelledby` it, so the outline is
  correct with no extra ARIA. Labels are words (`Work`, `Experience`), not ordinals: the
  numbered eyebrows are gone, and the only numbering left on the page is the project index.
- **Buttons.** Two patterns and no more. `.btn-primary` is a solid off-white block with
  inverted ink; `.btn-ghost` is a hairline outline that fills on hover. Both carry
  `--shadow-hard` and a two-pixel nudge on hover. The accent never fills either, so the
  primary button is off-white, not blue.
- **Project index.** `Work.astro` renders numbered rows; `ProjectRecord.astro` renders the
  record each row opens. Built on `<details>`/`<summary>`, so keyboard, touch, no-JS and
  reduced-motion all get the native path. Open state is marked three ways that survive
  reduced motion: the row background raises, the number turns accent, and the title
  tracking widens.
- **Portrait.** Grayscale by default so it sits inside the monochrome ramp, color on hover,
  and always color where hover does not exist.
- **Icons.** Local SVG through `Icon.astro`. Do not mix icon libraries, and keep the text
  label on any action that is not universally obvious.

## Interaction and accessibility

- **Focus.** Every `a`, `button`, `summary`, `input`, `textarea` and `[tabindex]` takes
  `outline: 3px solid var(--color-accent)` at `outline-offset: 3px`, site-wide. The ring
  follows the accent token, so it deepens in the light theme with everything else.
- **Contrast.** WCAG AA for text and controls is the floor, and it is what drove the light
  accent to `#0b5cad`. Nothing outside the token system sets a text color.
- **Semantics.** Landmarks and heading order are load-bearing, not decorative. The nav menu
  closes on Escape and on an outside click.
- **Touch targets.** A minimum practical target on every control; the mobile action bar
  reserves its own bottom clearance so it never overlaps the footer.

## Motion policy

There is exactly one reveal implementation on the site: a CSS transition plus one
`IntersectionObserver` in `src/scripts/reveal.ts`, driven by `[data-reveal]`. GSAP and
ScrollTrigger are gone, and with them the six duplicated per-section motion blocks
(supersedes ADR-0003 and ADR-0004).

The hidden state is one rule behind one class on `<html>`. An inline script in
`Layout.astro` arms the class before first paint and disarms it on a timer unless the
module has taken over, so a module that never loads cannot strand content at
`opacity: 0`. That is the specific failure the old `gsap.set` inline-style pattern could
not rule out.

Beyond the reveal, motion is limited to:

- The index row state changes described above.
- The nav scroll-progress bar and the active-link underline. Both are state, not decoration.
- The WebGL ambient field behind the hero (`AmbientField.astro`). This one is decoration and
  [ADR-0015](docs/adr/0015-blue-accent-and-ambient-field.md) says so plainly. It is confined
  to the first screen, dynamically imported after `load` inside `requestIdleCallback`, paused
  when the tab is hidden or the hero scrolls away, and reduced to a single static frame under
  reduced motion. No WebGL, or a failed import, leaves the plain background.

The CRT overlay and scan beam, the cursor glow, the skills marquee and the swipe carousel
are all removed. `prefers-reduced-motion: reduce` neutralizes every animation and
transition, and explicitly restores any element still holding the pre-reveal state.

## Responsive behavior

- Validate at roughly 320px, 390px, 768px, 1440px and 1600px.
- Mobile is the baseline: linear reading order, and no content that requires hover to reach.
- Do not pin a section and hijack vertical scroll to drive horizontal movement. That is the
  pattern [ADR-0009](docs/adr/0009-projects-swipe-carousel.md) rejected when it superseded
  ADR-0005, and the editorial index removed the last place it could have applied.
