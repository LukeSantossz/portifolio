# Visual system — Lucas Gonçalves portfolio

## Intent

An **industrial editorial** portfolio for applied AI/ML work: precise, evidence-led, and readable under recruiter time pressure. The interface should feel like a concise field report, not a generic SaaS template or a decorative terminal simulation.

## Principles

1. Put the claim, evidence, and next action in that order.
2. Let typography and measured whitespace create distinction; reserve effects for genuine orientation.
3. Use lime as a signal, not decoration: primary action, active location, or a substantiated outcome.
4. A project is a case file with context, decision, constraint, and result—not a portfolio thumbnail.
5. Preserve a linear, readable page with JavaScript disabled or reduced motion enabled.

## Tokens

Every token below is declared in `src/styles/global.css` under Tailwind v4 `@theme`,
so each one compiles to a utility (`--color-accent` becomes `bg-accent`,
`--shadow-hard` becomes `shadow-hard`). Values shown are the dark-theme defaults;
see Light theme for the light-mode remapping.

| Category | Token | Value / use |
| --- | --- | --- |
| Page canvas | `--color-canvas` | `#0d100e`, the `body` background |
| Body ink | `--color-ink` | `#e9ece3`, the `body` text color and `::selection` |
| Signal | `--color-accent` | `#46c06a`, action, status, and evidence |
| Base surface | `--color-concrete-950` | `#0e0e0e`, section backgrounds and the card fill |
| Raised surface | `--color-concrete-900` | `#161616`, code blocks and raised panels |
| Rules | `--color-concrete-700` | `#3a3a3a`, hard rules, dividers, and quiet borders |
| Hairline | `--color-concrete-500` | `#6b675f`, mid-weight hairline rule |
| Secondary ink | `--color-concrete-300` | `#b8b5ad`, supporting copy and labels |
| Primary ink | `--color-concrete-50` | `#ece9e2`, headings, key controls, and 2px borders |
| Signature shadow | `--shadow-hard` | `6px 6px 0 0 var(--color-concrete-50)`, hard offset with no blur |
| Display | `--text-display` | `clamp(3rem, 11vw, 8.5rem)`, the extreme display scale |
| Label | `--text-label` | `0.75rem`, mono labels paired with tracking and uppercase |
| Sans face | `--font-sans` | Inter Variable, then the system sans stack |
| Mono face | `--font-mono` | JetBrains Mono Variable, then the system mono stack |

`--color-canvas` and `--color-ink` are named that way on purpose: a color token named
`base` would hijack the `text-base` font-size utility.

There is no border-width, container-width, or motion-duration token. Border weight is
expressed with the Tailwind utility (`border-2` on a section boundary or an action,
hairline elsewhere), width with the rails below, and duration inline at the call site.

## Width rails

Two container rails exist, and no third one. Anything wider or narrower in `src/` is an
inner measure cap, not a rail.

- `max-w-6xl` is the wide rail. It carries all chrome (`Nav`, `SubpageHeader`, `Footer`)
  and all wide content: every landing section, the blog index, and the 404 page.
- `max-w-3xl` is the reading rail. It is used by exactly one element, the rendered post
  body in `src/pages/blog/[...slug].astro`, where the reading measure is the point.

`SubpageHeader.astro` takes a `rail` prop (`'wide' | 'reading'`, default `'wide'`) so the
header always spans the same rail as the content beneath it. A post page passes
`rail="reading"`; everything else takes the default.

`max-w-2xl` and `max-w-4xl` still appear inside sections. They cap a paragraph measure or
a stat grid within a rail and are never the page container. Do not introduce a new rail
value; pick one of the two.

## Light theme

The site ships both themes from one palette. They are selected automatically from
`prefers-color-scheme`; there is no in-page toggle, no `localStorage`, and no anti-FOUC
script. Dark is the default and is what a visitor with no preference gets. This is
ADR-0012.

The light theme is a single `@media (prefers-color-scheme: light)` block in
`global.css` that redefines the same custom properties on `:root`:

| Token | Dark | Light |
| --- | --- | --- |
| `--color-canvas` | `#0d100e` | `#ece9e2` |
| `--color-ink` | `#e9ece3` | `#1c1a17` |
| `--color-accent` | `#46c06a` | `#176b33` |
| `--color-concrete-950` | `#0e0e0e` | `#ece9e2` |
| `--color-concrete-900` | `#161616` | `#dedad1` |
| `--color-concrete-700` | `#3a3a3a` | `#c3beb2` |
| `--color-concrete-500` | `#6b675f` | `#8a857b` |
| `--color-concrete-300` | `#b8b5ad` | `#57534b` |
| `--color-concrete-50` | `#ece9e2` | `#1c1a17` |

The concrete ramp inverts: `950` becomes the lightest surface and `50` the darkest ink,
so each step keeps its semantic role. `bg-concrete-950` is still the page surface and
`text-concrete-50` is still primary ink. That inversion is the whole mechanism: because
every utility compiles to `var(--color-…)`, redefining nine variables flips the entire
site with no per-component edit and no duplicated component.

The accent is the one token that does not simply invert. It deepens to `#176b33` in light
so small mono labels clear WCAG AA on the light surface, while dark keeps the brighter
`#46c06a`.

The practical consequence for future work: **a new color must be added to both blocks.**
A token declared only in `@theme` will keep its dark value in light mode and will very
likely fail contrast there. Add it to `@theme` and to the light media query in the same
change.

## Typography and layout

- **Inter Variable:** display and body; use black only for short headlines.
- **JetBrains Mono:** labels, dates, metrics, and controls.
- Headlines have a measure of roughly 10–14 words; body copy is capped near 65 characters per line where feasible.
- Page padding: 1.25rem small screens, 1.5rem from tablet, fluid larger gutters on desktop.
- Section spacing is deliberately varied: strong transition into case studies, calmer spacing around supporting profile content.

## Components

- **Primary CTA:** lime fill, dark text, one clear verb. It receives the strongest contrast.
- **Secondary CTA:** quiet outlined treatment; never competes with the primary action.
- **Case study:** a bordered editorial panel with a single outcome, concise context, stack as metadata, and visible source/demo links.
- **Navigation:** compact text links; no decorative interaction competes with content.
- **Form:** persistent labels, high contrast, explicit status, and visible focus.

## Surface and interaction rules

- **Hover lift always carries the shadow.** `hover:-translate-x-0.5 hover:-translate-y-0.5`
  never appears alone. Every occurrence in `src/` sits on an element that also has
  `shadow-hard`, so the lift reads as the element moving off its own hard shadow. Adding
  the translate without the shadow produces a drift with nothing behind it.
- **`.surface-card` is the single card surface.** The hard-bordered concrete panel behind
  both `ProjectCard.astro` and `PostCard.astro` lives in `global.css` as `.surface-card`
  (flex column, full height, `border-2` in primary ink, `--color-concrete-950` fill,
  1.5rem padding rising to 2rem from 768px). Use the class. Do not re-inline its class
  string on a new card; a third copy is how the first two drifted apart.
- **Label size is chosen by role, not by size.** `text-label` and `text-xs` both resolve
  to 0.75rem. `text-label` marks eyebrow and metadata labels, the copy that names a
  section or annotates content. `text-xs` marks interactive chrome and small utility
  copy: nav links, footer links, form labels, buttons, chips, and counters. Keeping the
  split means a change to the label scale moves labels without moving chrome.
- **Eyebrow tracking is the wider one.** Section and page eyebrows use
  `font-mono text-label uppercase tracking-[0.25em] text-concrete-300`. Other mono labels
  use `tracking-[0.2em]`. Both values are deliberate and current; do not normalize one
  into the other. Buttons and CTAs use the Tailwind `tracking-wider` step, and the mobile
  action bar uses `tracking-[0.15em]` at its own smaller size.
- **Numbered section eyebrows are the sanctioned numbering.** The landing runs
  `01 / HELLO` through `07 / CONTACT`, kept by ADR-0011. No other ordinal prefix belongs
  in public copy.

## Interaction and accessibility

- Hover may change color or underline; avoid layout-shifting scale effects.
- All visible animations are optional under `prefers-reduced-motion`.
- Maintain visible focus with the lime outline, 3px offset.
- Do not rely on color alone for state; pair the signal with text, position, or structure.
- Minimum contrast target: WCAG AA for text and controls.

## Responsive behavior

- 320–390px: one column, content-first, no hidden critical text.
- 768px: retain linear content with enhanced spacing and two-column profile where useful.
- 1024px and above: allow denser navigation and wider project composition, but do not replace vertical reading with pinned horizontal navigation.

## Motion policy

- Allow one short hero entrance and discreet in-view reveals for major section introductions.
- Do not loop text, animate the full page background, or attach a cursor glow globally.
- Use CSS transitions for simple hover/focus feedback; use GSAP only for the hero entrance and content-revealing scroll interactions that have a clear cleanup path.
