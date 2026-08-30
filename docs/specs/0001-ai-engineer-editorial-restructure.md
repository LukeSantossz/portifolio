# SPEC: refactor(ui): restructure the portfolio as an AI Engineer editorial index

## Problem

The site presents strong, factual engineering evidence in fifth position behind three
lower-value sections, and its structure (seven symmetrically numbered sections, one
cloned section scaffold, a freelancer-style "Services" block, four surfaces repeating
the same stack) reads as generated rather than authored, which is the exact signal an
AI Engineering audience discounts.

## Design Decision

Restructure the landing page from seven symmetric sections into five asymmetric blocks
ordered Hero, Work, Experience, About, Contact, and replace the repeated project card
with a numbered engineering index whose rows expand into a field record built on the
existing six-move case-study schema. Retire the "Services" section and dissolve the
"Skills" section into the places where a technology already carries context. Replace
Inter with Archivo and JetBrains Mono with IBM Plex Mono, both latin-subset variable,
so the typography stops matching the generator preset. Cut the decorative systems from
ten to three and delete the third-party IP lookup.

## Alternatives Considered

- **Keep the seven-section structure and only restyle it.** Rejected: the audit found
  the "AI-generated" signals are structural (symmetry, cloned scaffold, redundant stack
  surfaces), not decorative, so restyling would leave every one of them in place.
- **Replace the card grid with a sortable engineering table.** Rejected for the primary
  layout: the six-move schema carries 60 to 90 words per move, which a table cell
  cannot hold without either truncating the substance or scrolling horizontally on
  mobile. The index-plus-record keeps the density and stays readable at 375px.
- **Adopt a full-page WebGL or procedural 3D element for identity.** Rejected: no
  content on this site is spatial, so a 3D element would be decoration, which both the
  brief and the reference research flag as a template tell. The cost (a WebGL runtime,
  a mobile power budget, a reduced-motion fallback) buys nothing the typography does
  not already deliver.
- **Keep GSAP core for the project index and drop only ScrollTrigger.** Rejected after
  building it: once the index was built on `<details>`, the only thing left for GSAP
  was a short fade of two columns, which one CSS keyframe does. Keeping a 70 KB
  library for that failed its own justification, and the library's `gsap.set` pattern
  writes `opacity: 0; visibility: hidden` inline, which no class-based failsafe can
  undo. GSAP is removed entirely: the shared reveal is CSS plus one
  IntersectionObserver, and total shipped JS drops from 119 KB to 8 KB inline.
- **Keep the real identity data during development.** Rejected: the brief requires
  fictional data in the working environment, and the resume PDF, profile photo and
  JSON-LD all carry real personal data.

## Scope

- Includes:
  - `src/pages/index.astro`: five-block order (Hero, Work, Experience, About, Contact).
  - Delete `src/components/sections/Services.astro` and `src/data/services.ts`.
  - Delete `src/components/sections/Skills.astro`; `src/data/skills.ts` survives, read
    by the About stack line.
  - New `src/components/sections/Work.astro` plus `src/components/ui/ProjectRecord.astro`
    (numbered index rows that expand into a field record); delete
    `src/components/ui/ProjectCard.astro`.
  - New `src/components/layout/Section.astro`: the one section scaffold, replacing the
    six clones.
  - New `src/scripts/reveal.ts`: one shared IntersectionObserver reveal, replacing the
    six duplicated GSAP/ScrollTrigger blocks. The `gsap` dependency is removed.
  - `src/styles/global.css`: Archivo + IBM Plex Mono tokens, fluid `clamp()` type scale,
    the single vertical column rule, removal of the `canvas`/`ink` duplicate tokens, the
    dead `reveal-up` and orphan comment blocks, the marquee rules and the CRT beam.
  - `src/layouts/Layout.astro`: delete `#cursor-glow` and its rAF loop; latin-subset
    font imports.
  - `src/components/sections/Contact.astro`: delete the world map, the `ipwho.is` fetch
    and `src/data/world-map.ts`; fix `text-red-400` to a system token; move the
    hard-coded positioning copy to `src/data/`.
  - `src/components/layout/Nav.astro`: four links (Work, Experience, About, Contact)
    plus Writing; Escape and outside-click close; the `close` icon wired up.
  - Fictional identity across `src/data/site.ts`, `src/data/about.ts`,
    `src/data/experience.ts`, the four `src/content/projects/*.md`, a placeholder resume
    and a placeholder portrait.
  - `docs/adr/0014` (editorial restructure), and retiring ADR-0003, ADR-0004, ADR-0006,
    ADR-0007 and ADR-0009 in place.
  - Two additive fields on the `projects` schema, `kind` and `evaluation`. This
    was outside the original scope ("no schema changes") and was added after the
    review pass: every reviewer independently asked how a result was measured and
    whether a project was professional or personal, and neither question could be
    answered from the six existing moves. Both fields are optional, so no existing
    content breaks.
  - The accent moves from green to blue, and `three` is added as a dependency for
    a reactive background field. Both were requested by the author after the Gate
    and both contradict decisions recorded here (the SPEC rejected 3D outright).
    They are recorded, with their measured cost, in
    `docs/adr/0015-blue-accent-and-ambient-field.md` rather than quietly folded in.
- Does NOT include:
  - Any change to the `blog` collection schema, or to the six existing case-study
    moves.
  - The `/blog/` area, `PostCard.astro`, `SubpageHeader.astro`, `404.astro`.
  - Any analytics change.
  - The security headers in `vercel.json`, the CI workflows, the Lighthouse budget.
  - Restoring the real identity data (a separate, final commit once the design is
    approved).
  - Deleting `public/my_resume.pdf` or the real portrait files; they stay in place and
    are simply no longer referenced.

## Acceptance Criteria

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `landing_has_five_sections`: `src/pages/index.astro` renders exactly Hero, Work,
  Experience, About, Contact; `Services.astro` and `Skills.astro` no longer exist.
- `work_is_second_block`: the first section after the hero is Work, and a project title
  is reachable within one viewport of scroll at 1440x900 and at 390x844.
- `projects_are_not_cards`: the Work section renders numbered index rows; no repeated
  bordered card component exists in the tree.
- `six_moves_preserved`: every field in the `projects` schema that a `.md` file sets is
  rendered for each project, including the two added fields.
- `measurement_is_stated`: each project record states its dataset, its split and the
  baseline its headline number is measured against.
- `no_third_party_beacon`: no network request leaves the page on load; grepping `src/`
  for `ipwho` returns nothing.
- `single_reveal_implementation`: exactly one reveal implementation exists in `src/`;
  grepping `src/` and `package.json` for `gsap` returns nothing.
- `no_hidden_first_reveal`: no reveal sets `opacity: 0` before its trigger fires, so a
  script failure leaves content visible.
- `contrast_aa`: no color outside the design tokens is used for text; the form error
  message passes 4.5:1 in both themes, measured.
- `keyboard_complete`: the project index opens, closes and moves between records by
  keyboard alone with a visible focus ring; the nav menu closes on Escape.
- `reduced_motion_honored`: with `prefers-reduced-motion: reduce`, no animation runs and
  all content is visible.
- `copy_is_decoupled`: no section heading or body paragraph is hard-coded in a `.astro`
  file.
- `fictional_identity`: grepping `src/` and `public/` for the real name, email, GitHub
  handle, LinkedIn URL and city returns nothing.
- `js_budget`: no external script blocks the first paint. three.js (about 188 KB
  gzipped) loads only after `load` and only inside `requestIdleCallback`, so the
  measured effect is LCP 1.7s to 1.8s and TBT 0ms to 60ms, both inside budget.
- `lighthouse_budget_met`: `lighthouserc.json` passes unchanged (accessibility >= 0.95,
  CLS <= 0.1, SEO >= 0.95).

## Reproducibility

- Node 22, `npm ci`, `npm run check`, `npm run build`. No new runtime dependency; two
  font packages replace two font packages.
- Measure JS: `find dist/_astro -name "*.js" -exec ls -la {} \;` summed, compared to the
  119,460-byte baseline recorded on 2026-08-29.
- Visual and keyboard checks run in a real browser at 1440x900, 768x1024 and 390x844, in
  dark and light, with and without `prefers-reduced-motion`.
- Restore the real identity later with
  `git checkout <this-commit>~1 -- src/data src/content/projects`.

## Risks and Assumptions

- Risk: deleting Services and Skills removes surface area a recruiter might scan for
  keywords. Mitigated by keeping every technology visible inside the project records and
  a compact stack line in About, where each one has context. Reversible: both files stay
  in git history.
- Risk: the index-and-record interaction is the one genuinely new pattern and could fail
  on touch or by keyboard. Mitigated by building it on `<details>` semantics so the
  no-JS and no-motion paths are the native ones, with GSAP layered on top.
- Risk: a font swap changes every measurement on the page and can regress CLS. Mitigated
  by keeping both faces variable and self-hosted with the same `font-display` behavior,
  and by re-running the Lighthouse budget.
- Risk: retiring five ADRs is a large documentation change. Per `spec_method.md` the
  records are retired in place, never deleted or renumbered.
- Assumption: the brief's ordering (clarity, technical proof, credibility, visual
  experience, performance) authorizes removing sections whose content is redundant, even
  though nothing about them is broken.
