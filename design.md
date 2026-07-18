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

| Category | Token | Value / use |
| --- | --- | --- |
| Canvas | `--color-concrete-950` | `#0e0e0e`, main background |
| Surface | `--color-concrete-900` | `#161616`, restrained raised surface |
| Primary ink | `--color-concrete-50` | `#ece9e2`, headings and key controls |
| Secondary ink | `--color-concrete-300` | `#b8b5ad`, supporting copy |
| Rules | `--color-concrete-700` | `#3a3a3a`, dividers and quiet borders |
| Signal | `--color-accent` | `#46c06a`, action, status, and evidence |
| Display | `--text-display` | fluid name/title scale; uppercase only for short labels |
| Label | `--text-label` | `0.75rem`; mono metadata with tracking |
| Content width | `--content-width` | `72rem` / Tailwind `max-w-6xl` |
| Border | `--border-strong` | `2px`; use on a section boundary or action, not every element |
| Motion | `--motion-enter` | 220–320ms, transform/opacity only |

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
