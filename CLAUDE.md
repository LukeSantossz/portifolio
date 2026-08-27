# CLAUDE.md

Project memory for Claude Code. Read this before making changes.

This is a **static Astro 6 portfolio** (single page, `output: 'static'`, Tailwind
v4 via PostCSS, TypeScript strict) that presents each project as a case study and
deploys to Vercel.

Development conventions here are the repository's own, stated in Quick reference
below. This project no longer vendors the PONT STANDARDS framework: the submodule
was pinned five commits before that framework's first release, was never
activated — no `.framework.toml`, no `.framework.lock`, no `core.hooksPath` — and
the documents it pointed at have since been rewritten. A governance layer nothing
reads and nothing enforces is worse than none, because it reads as one.

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
- **Commits:** Conventional Commits — `type(scope): imperative subject`, types
  `feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert`; no co-author or
  AI-attribution trailers.
