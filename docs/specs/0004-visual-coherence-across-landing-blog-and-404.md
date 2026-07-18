# SPEC: refactor(ui): unify the visual system across the landing, blog, and 404

## Problem

The site has accumulated four container widths, three competing numbering systems, and two
pages that do not speak the established design language, so the portfolio reads as three
sites stitched together instead of one.

## Design Decision

Consolidate presentation onto two container rails and one numbering system, bring `/404` and
the blog chrome into the Concrete Terminal language already shipped everywhere else, and
rewrite `design.md` so it describes the code rather than an abandoned redesign. Establish the
durable spec archive under `docs/specs/` that the synced standards require, migrating the
three historical specs into it.

No ambient effect, palette, or section copy changes beyond removing prohibited punctuation.
A browser pass at 1440px confirmed the decorative layers (grain, CRT overlay, cursor glow)
are discreet and are not the defect; ADR-0013 calibrated them deliberately and stays in force.

## Alternatives Considered

- **Strip the ambient layers to match the `design.md` authored on the discarded redesign
  branch.** Rejected: a browser pass showed the layers are subtle enough to require looking
  for them, and ADR-0013 explicitly rejected their removal as an over-correction. Reversing a
  recently accepted ADR with no observed defect is unjustified.
- **Keep `max-w-5xl` and only realign the blog chrome.** Rejected: it preserves three rails,
  so the width rule stays impossible to state in one sentence and the drift returns with the
  next section added.
- **One `max-w-6xl` rail for everything, including post bodies.** Rejected: it pushes the
  article measure to roughly 110 characters per line, against the 65-character reading target
  `design.md` sets.
- **Create only `docs/specs/0001` for this change and leave the historical specs in place.**
  Rejected: it leaves a stale `SPEC.md` at the repository root and splits the durable archive
  across two locations, which is the drift the standard exists to prevent.
- **Rework the Skills marquee, whose copy claims "not on a logo wall" while rendering exactly
  that, with visibly duplicated chips.** Deferred rather than rejected: it is a design
  decision needing its own spec and ADR, not a coherence fix, and folding it in here would
  make the scope unreviewable.

## Scope

- Includes:
  - **Width ramp.** Two rails. `max-w-6xl` for chrome and wide content:
    `Nav.astro`, `SubpageHeader.astro`, `Footer.astro`, `Experience.astro`, `Contact.astro`,
    `blog/index.astro`, `404.astro`. `max-w-3xl` retained only for the post body in
    `blog/[...slug].astro`. `max-w-5xl` no longer appears in `src/`.
  - **`404.astro` adopts the language:** `bg-concrete-950` wrapper, heading on the display
    ramp (`font-sans font-black uppercase leading-[0.95] tracking-[-0.02em]`), CTA as
    `border-2 border-accent bg-accent ... font-bold ... text-concrete-950 shadow-hard` with no
    `rounded-lg`, plus `SubpageHeader` and `Footer`, which it currently lacks.
  - **`MobileActionBar` renders on blog routes**, not only on `index.astro`, so the email, CV,
    and LinkedIn thumb-zone actions do not disappear inside an article on mobile.
  - **One numbering system.** The section numbering (`01 / HELLO` through `07 / CONTACT`) is
    kept, as ADR-0011 requires. The two competing systems are removed: the `01`-`04` ordinals
    inside the Services list items, and the `PROJECT 01` prefix on project cards, which keeps
    its domain and period.
  - **Label agreement:** the Services heading and its nav link use the same words.
  - **Prohibited punctuation removed from public copy.** `AGENTS.md` scopes its em and en
    dash ban to public copy, so code comments are deliberately left alone. Seventeen
    occurrences across six files: `Contact.astro:82` and `:180` (as `&mdash;` entities),
    `blog/index.astro:29`, `ProjectCard.astro:117` and `:131` (inside `aria-label`, which
    assistive technology reads aloud), `data/experience.ts:23` and `:24`, and both articles
    in `src/content/blog/` (seven and four occurrences).
  - **Shared card surface** extracted from the duplicated
    `flex h-full flex-col border-2 border-concrete-50 bg-concrete-950 p-6 text-concrete-50 md:p-8`
    in `ProjectCard.astro` and `PostCard.astro`.
  - **Interaction rule:** `hover:-translate-x-0.5 hover:-translate-y-0.5` always pairs with
    `shadow-hard`, fixing `PostCard.astro` and the two link buttons in `ProjectCard.astro`.
  - **Token naming:** `text-label` is the single name for the 0.75rem mono label size,
    replacing `text-xs` where it labels metadata; eyebrow tracking is `0.2em` everywhere;
    the single `border-dashed` occurrence in `blog/index.astro` is replaced by the solid
    border vocabulary.
  - **Weights on the ramp:** `.prose-terminal h2/h3` moves from `font-weight: 800` to `900`,
    matching `font-black`, and the `h3` in `Experience.astro` moves from `font-semibold` to
    `font-bold`, matching the other card headings.
  - **Stale comments in `global.css` corrected:** the comment block announcing About-photo
    badge rules that do not exist, the "Hero scope" wording for a grain used by seven
    sections, and the "hero grid drift" reference to a removed effect.
  - **`design.md` rewritten to describe the code:** real token values, the two width rails,
    the `shadow-hard` pairing rule, and the light theme from ADR-0012, which it never mentions.
  - **`AGENTS.md` corrected** where it bans numbered section labels, which conflicts with the
    accepted ADR-0011.
  - **Durable spec archive** at `docs/specs/`, with the three historical specs migrated in
    merge order and this spec authored as `0004`.
  - **ADR-0002 marked in place** with an amendment note recording that its Hero-only scanline
    was superseded by ADR-0006. The file and its number are kept, per the standard.
- Does NOT include:
  - The Skills marquee's structure, content, or the contradiction with its own copy.
  - Any change to the grain, CRT overlay, or cursor glow, including their opacity and timing.
  - The palette, the accent color, or the light-theme token values.
  - Section copy beyond punctuation and the two label corrections named above.
  - Em and en dashes inside code comments, which `AGENTS.md` does not cover.
  - Any change to the geo map, the projects carousel, the hero intro, or the count-up.
  - New dependencies, new ADRs, or a move away from `output: 'static'`.
  - Retiring or deleting any existing ADR.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and a named manual checklist, per
ADR-0001 (no unit harness for presentation-only work).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `no_five_xl_rail_remains`: `grep -r "max-w-5xl" src/` returns no matches.
- `post_body_keeps_reading_rail`: `blog/[...slug].astro` still constrains the post body to
  `max-w-3xl`.
- `blog_header_aligns_with_content`: on `/blog` at 1440px the `SubpageHeader` wordmark and the
  page heading share the same left edge.
- `notfound_uses_language`: `404.astro` contains no `rounded-`, renders inside
  `bg-concrete-950`, uses the display heading ramp, and renders both `SubpageHeader` and
  `Footer`.
- `mobile_actions_persist_on_blog`: `MobileActionBar` renders on `/blog` and on a post route
  below 768px.
- `single_numbering_system`: no ordinal appears in a Services list item and no `PROJECT 01`
  prefix appears on a project card; the `01 / HELLO` through `07 / CONTACT` section labels
  are unchanged.
- `services_label_agrees_with_nav`: the Services heading text and its nav link text match.
- `no_prohibited_dashes_in_public_copy`: neither the literal characters nor the `&mdash;` and
  `&ndash;` entities appear in `src/content/blog/`, `blog/index.astro`, `Contact.astro`,
  `ProjectCard.astro`, or `src/data/experience.ts`. Code comments are out of scope and are
  expected to still contain them.
- `card_surface_shared`: the duplicated card surface string appears once in `src/`.
- `translate_pairs_with_shadow`: all eight `hover:-translate-` occurrences in `src/` sit on an
  element that also carries `shadow-hard`. Four already comply (`Hero.astro:74`, `:82`,
  `Contact.astro:150`, `:166`); `PostCard.astro:18`, `ProjectCard.astro:118`, `:132`, and the
  rebuilt `404.astro` CTA are the ones to fix.
- `design_md_matches_code`: every token `design.md` documents exists in `global.css` with the
  stated value, and `design.md` documents the light theme and both width rails.
- `agents_md_consistent_with_adr_0011`: `AGENTS.md` no longer bans numbered section labels.
- `spec_archive_contiguous`: `docs/specs/` contains `0001` through `0004` with no gap and no
  duplicate, no `SPEC.md` remains at the repository root, and `docs/superpowers/specs/` is
  gone.
- `adr_0002_amended_in_place`: ADR-0002 keeps its number and file and carries a note that its
  Hero-only scanline was superseded by ADR-0006.
- `lighthouse_budget_met`: the `lighthouserc.json` budget still passes, with accessibility at
  or above 0.95 and CLS at or below 0.1.
- `visual_pass_recorded`: the landing, `/blog`, one post, and `/404` are inspected in a real
  browser at 390px, 768px, and 1440px, with before and after evidence attached to the PR.

## Reproducibility

- Install: `npm install`. Serve: `npm run dev -- --host 127.0.0.1 --port 4321`. Note the port
  the server actually binds; it falls through when 4321 is taken.
- Gates: `npm run build`, `npm run check`.
- Visual pass: the four routes above at the three widths, in a real browser. This is the step
  that surfaced every defect in this spec; the static gates catch none of them.
- Reduced motion: emulate `prefers-reduced-motion: reduce` and confirm the hero content is
  visible and no looping effect runs.
- No JavaScript: confirm every section and both blog routes stay readable and navigable.
- Versions: Astro `^6.3.7`, Tailwind v4 via PostCSS, TypeScript `^6.0.3`, GSAP `^3.15.0`,
  Node 22.

## Risks and Assumptions

- Assumption: widening `Experience` and `Contact` from `max-w-5xl` to `max-w-6xl` improves
  coherence without harming their reading measure, because both cap their inner text blocks
  independently. Invalidated if either section's body text exceeds a comfortable measure at
  1440px, in which case the inner cap is tightened rather than the rail restored.
- Assumption: the light theme is unaffected, because no palette token changes. Not verified in
  this session; the visual pass must cover it or the assumption must be withdrawn.
- Risk: removing the `PROJECT 01` prefix and the Services ordinals reduces scanability for a
  skimming recruiter. Mitigation: the section numbering that ADR-0011 protects still orients
  the reader, and the project cards keep their domain and period metadata.
- Risk: migrating the historical specs rewrites paths that existing commit messages, PR
  bodies, and README rows may reference. Mitigation: `git mv` preserves history and content,
  and no spec number is reused.
- Risk: the `MobileActionBar` on blog routes may collide with the post footer or the reading
  flow. Mitigation: ADR-0008 already requires it to honor `env(safe-area-inset-bottom)` and to
  reserve footer clearance; the visual pass at 390px checks both blog routes.
- Invalidation: this spec no longer holds if the Skills marquee is reworked, if any ambient
  effect is added or removed, or if the site stops being a single static landing page plus a
  blog subtree.
