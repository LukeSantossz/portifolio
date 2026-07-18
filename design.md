# Visual system: Lucas Gonçalves portfolio

## Intent

An **industrial editorial** portfolio for applied AI/ML work: precise, evidence-led, and readable under recruiter time pressure. The interface should feel like a concise field report, not a generic SaaS template or a decorative terminal simulation.

## Principles

1. Put the claim, evidence, and next action in that order.
2. Let typography and measured whitespace create distinction; reserve effects for genuine orientation.
3. Use lime as a signal, not decoration: primary action, active location, or a substantiated outcome.
4. A project is a case file with context, decision, constraint, and result, not a portfolio thumbnail.
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
- `max-w-3xl` is the reading rail. It carries the rendered post body in
  `src/pages/blog/[...slug].astro`, where the reading measure is the point, and it is the
  `'reading'` arm of the `railClass` ternary in `SubpageHeader.astro` so that page's header
  spans the same rail. Those two are its only occurrences in `src/`.

`SubpageHeader.astro` takes a `rail` prop (`'wide' | 'reading'`, default `'wide'`) so the
header always spans the same rail as the content beneath it. A post page passes
`rail="reading"`; everything else takes the default.

Smaller `max-w-*` values still appear inside sections. They cap a paragraph measure, a stat
grid, or a carousel card within a rail and are never the page container. Do not introduce a
new rail value; pick one of the two.

Confirm the rails and their inner caps with
`grep -rno "max-w-[a-z0-9]*" src/ | awk -F: '{print $3}' | sort | uniq -c` rather than
trusting a list in prose, which goes stale on the next edit.

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

- **Inter Variable** (`--font-sans`) carries display and body copy. `font-black` is the
  display weight. Eleven of its twelve occurrences in `src/` sit on an `h1`, `h2`, or `h3`,
  and `.prose-terminal h2, h3` sets `font-weight: 900` in CSS for the same effect inside a
  rendered post. The twelfth is `ProjectCard.astro`, on a display-scale `<p>` carrying the
  card's outcome figure. That one is deliberate: it is a headline in role, so it takes the
  headline weight. Body copy never takes it.
- **JetBrains Mono** (`--font-mono`) carries eyebrows, dates, stack chips, buttons, and form
  labels. Both faces are set uppercase, so uppercase alone does not tell them apart. The
  reliable tell is the sign of the tracking: headings are `font-sans` with negative tracking
  (`tracking-[-0.02em]`, `-0.03em` in the hero) to tighten a heavy display line, while mono
  labels take positive tracking (`tracking-[0.2em]`, `[0.25em]` on eyebrows). Positive
  letter-spacing means mono.
- **Page padding is flat.** Every page container in `src/` uses `px-6` (1.5rem) at every
  width. There is no responsive padding ramp: `grep -rn "max-w-6xl\|max-w-3xl" src/` shows
  `px-6` and no `sm:px-*` or `md:px-*` beside it. If a future change wants wider desktop
  gutters, that is a new decision, not an existing one.
- **Vertical rhythm is uniform, not varied.** Landing sections use `py-16 md:py-28`;
  the subpages (`/blog`, an article, `/404`) use `py-20 md:py-28`. `Projects.astro` is the
  single exception, `pt-16 md:pt-28`, because its carousel track supplies its own bottom
  space. Distinction comes from type scale and borders, not from spacing variation.
- **Measure is capped inside a rail, never by it.** Body copy in `ProjectCard.astro` and
  `PostCard.astro` uses `max-w-prose` (Tailwind's 65ch). Section intros mostly use
  `max-w-2xl`. The hero stat grid uses `max-w-4xl`.

## Components

- **Primary CTA:** `border-2 border-accent bg-accent text-concrete-950`, plus `shadow-hard`
  and the paired hover lift, with one clear verb. Describe it as accent fill with inverted
  ink, not as "lime fill, dark text": `--color-concrete-950` inverts with the ramp, so the
  same classes render dark ink on lime in the dark theme and light ink on deep green in the
  light theme. Both directions are intentional. It ships in `Hero.astro`, `Contact.astro`
  (submit and the follow-up action), and `404.astro`.
- **Secondary CTA:** the same geometry, weight, and `shadow-hard`, but outlined:
  `border-2 border-concrete-50 bg-transparent text-concrete-50`. It reads as an alternative
  rather than a quieter one; only the fill separates it from the primary action.
- **Case study:** a bordered editorial panel (`.surface-card`) with a single outcome,
  concise context, stack as metadata, and visible source and demo links.
- **Navigation:** compact mono text links; no decorative interaction competes with content.
- **Form:** persistent labels above each field, a `role="status"` `aria-live="polite"`
  region for submission state, and the site-wide focus ring.

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
- **`text-label` and `text-xs` do not currently split by role.** Both resolve to 0.75rem,
  so the difference is invisible on screen and the codebase has drifted. `text-label` has
  sixteen uses in `src/` beyond its declaration, and they are coherent: thirteen are section
  or page eyebrows, and three are the card and article meta lines in `ProjectCard.astro`,
  `PostCard.astro`, and `blog/[...slug].astro`. `text-xs` covers genuine interactive chrome
  (footer links, the nav CTA, form labels, the carousel controls) but also a large amount of
  non-interactive annotation: the metric label, the `Result` marker, the stack chips, and
  the decision-list terms in `ProjectCard.astro`, the tag chips in `PostCard.astro` and
  `blog/[...slug].astro`, and the role and period meta line in `Experience.astro`, which is
  the same kind of meta line the two blog surfaces render at `text-label`.

  This is unresolved drift, the same status as the `tracking-wide` outliers below, not a
  sanctioned convention. It was left in place deliberately because both tokens resolve to
  the same 0.75rem and renaming them would be a large no-op diff; that decision stands, but
  it does not make a rule exist. Do not cite this document as authority for choosing one
  over the other. When adding a label, match the nearest sibling in the same component and
  do not widen the split. Get the current shape with `grep -rn "text-label" src/` and
  `grep -rn "text-xs" src/` rather than trusting a description in prose.
- **Eyebrow tracking is the wider one.** Section and page eyebrows use
  `font-mono text-label uppercase tracking-[0.25em] text-concrete-300`. Most other mono
  labels use `tracking-[0.2em]`; both values are deliberate and current, do not normalize
  one into the other. Buttons and CTAs use the Tailwind `tracking-wider` step, and the
  mobile action bar uses `tracking-[0.15em]` at its own smaller size. In-card labels and
  headings are not yet consistent with this: seven of them, inside `ProjectCard.astro`,
  `Services.astro`, and `Skills.astro`, use the much tighter Tailwind `tracking-wide` step
  instead. That is unresolved drift, not a fifth sanctioned category; do not copy it into
  new labels. Get the current count with `grep -rn "tracking-wide\b" src/` rather than
  trusting this sentence, since a list of positions in prose goes stale on the next edit.
- **Numbered section eyebrows are the sanctioned numbering.** The landing runs
  `01 / HELLO` through `07 / CONTACT`, kept by ADR-0011. No other ordinal prefix belongs
  in public copy.

## Interaction and accessibility

- Hover may change color, underline, or apply the paired translate-and-shadow lift above.
  No element in `src/` uses `hover:scale-*`; do not introduce one, because a scale on a
  hard-shadowed panel breaks the offset the shadow depends on.
- Focus is one site-wide rule in `global.css`, not a per-component class: `a`, `button`,
  `input`, `textarea`, and `[tabindex]` take `outline: 3px solid var(--color-accent)` at
  `outline-offset: 3px`. The outline follows the accent token, so it deepens in the light
  theme along with everything else. Do not override it locally.
- Do not rely on color alone for state; pair the signal with text, position, or structure.
- Minimum contrast target: WCAG AA for text and controls. This is what drove the accent to
  a deeper green in the light theme.
- Reduced motion is handled globally; see Motion policy.

## Responsive behavior

`md` (768px) is the one breakpoint that carries structure. It is where the layout changes
character, and almost every responsive class in `src/` is an `md:` class.

- **Below 768px:** one column, content first, no hidden critical text. The nav collapses to
  a toggle-driven `#mobile-menu`, the Case studies section becomes the horizontal swipe
  carousel of ADR-0009, and the mobile action bar renders on the landing page and both blog
  routes. Section padding is `py-16`, subpage padding `py-20`.
- **From 768px:** the desktop nav link list appears (`hidden ... md:flex`) and the mobile
  menu and its toggle are hidden; the Case studies carousel falls back to the plain vertical
  stack; the About section goes two-column (`md:grid-cols-[1.6fr_1fr]`); section padding
  opens to `md:py-28` and headings step up a size.
- **From 1024px:** exactly one thing changes. `lg:` appears once in all of `src/`, on the
  About contact-facts grid going to four columns. Navigation does not get denser at 1024px;
  it already switched at 768px. Verify with `grep -rn "lg:" src/`.

Horizontal gutters do not change at any breakpoint; see Typography and layout.

## Motion policy

Motion here splits into two kinds, and the rules differ.

**Content motion** is the hero entrance and the discreet in-view reveals on major section
introductions. These are GSAP, one per section, each with an explicit cleanup path, and each
written so the content is visible if the trigger never fires. Use CSS transitions for simple
hover and focus feedback; reach for GSAP only for the hero entrance and content-revealing
scroll interactions. Do not add a second reveal to a section that already has one.

**Ambient motion is sanctioned, deliberate, and load-bearing to the identity.** Three
continuous ambient layers ship on every route today, and they are protected by accepted
ADRs. Do not remove them as cleanup:

- **The CRT overlay and scan-beam.** `.crt-overlay` and `.crt-beam` are rendered from
  `Layout.astro`, so the faint scanline field and its 10s `crt-sweep` pass over the page
  background on every route. This is ADR-0006, which chose the global above-content overlay
  precisely so the terminal ambience would not reset per section, and it is `aria-hidden`
  with `pointer-events: none`.
- **The cursor glow.** `#cursor-glow` in `Layout.astro` is a fixed, full-viewport radial
  gradient at `-z-10` that trails the pointer through a `requestAnimationFrame` lerp.
  Global is the intended scope. ADR-0013 tuned its radius and alpha down rather than
  scoping or removing it.
- **The Skills marquee.** `.marquee-track` runs `marquee-scroll` on a `linear infinite`
  loop, so the skills text loops continuously by design.

ADR-0013 tempered the grain opacity and the glow radius and alpha after research on
first-impression visual complexity, and it explicitly **rejected** removing the CRT overlay
and grain as an over-correction, on the grounds that the evidence supports low complexity
rather than zero. It tempers ADR-0002 and ADR-0006; it does not revoke them. SPEC-0004 puts
all ambient effects under "Does NOT include" for the same reason. A future change that
deletes looping text, the animated page background, or the global glow is reversing two
accepted ADRs and needs its own ADR, not a tidy-up commit.

**Every self-animating ambient layer is reduced-motion-gated**, which is what makes the
above acceptable. The `@media (prefers-reduced-motion: reduce)` block in `global.css` clamps
all animation and transition durations to 0.001ms and iteration counts to 1, then
neutralizes the looping effects outright: `.marquee-track` gets `animation: none`,
`.crt-beam` gets `display: none`, and `.signal-pulse` gets both `animation: none` and
`opacity: 0` so the static geo-map dots remain. A second block drops the carousel to
`scroll-behavior: auto` and its panel transition to `none`.

The cursor glow is the one exception. It has no `prefers-reduced-motion` branch in either
the CSS block or the `Layout.astro` script, so under reduced motion it still trails the
pointer. It is pointer-driven rather than self-animating, so it produces no motion for a
visitor who is not moving a pointer, which is presumably why it was never added to the
block; no ADR records that reasoning, so treat it as observed behavior rather than a
decision. Do not describe it as gated. Adding it to the block would be a defensible change
and needs no ADR, but make it a deliberate one.

Anything continuous you add must be neutralized in that same block, and the page must stay
complete and readable once it is.
