# CLAUDE.md

Project memory for Claude Code. Read this before making changes.

This is a **static Astro 6 portfolio** (single page, `output: 'static'`, Tailwind
v4 via PostCSS, TypeScript strict) that presents each project as a case study and
deploys to Vercel.

The binding development standards — Conventional Commits, the SPEC / Spec-Gate flow,
code conventions, naming, review composition (R1/R2/R3), and the verification policy —
live in the PONT STANDARDS framework, added as a git submodule. Start at its index:

@.standards/docs/standards/INDEX.md

Project-specific structural patterns (directory layout, the content/rendering
decoupling rule, styling tokens, the accessibility baseline) are summarized in Quick
reference below and reflected in the code.

## Quick reference

- **Content is decoupled from components.** Copy lives in `src/data/*.ts` and
  `src/content/projects/*.md`, never hard-coded in `.astro` files.
- **Components are grouped by role:** `src/components/{sections,ui,layout}/`.
- **Verify with the gates:** `npm run build` + `npm run check` + the Lighthouse budget
  + a manual checklist; no unit harness (presentation-only policy, see
  `docs/adr/0001-presentation-only-verification-policy.md`).
- **Commits:** Conventional Commits per `.standards/docs/standards/github.md`; no
  co-author trailers.
