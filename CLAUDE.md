# CLAUDE.md

Project memory for Claude Code. Read this before making changes.

This is a **static Astro 6 portfolio** (single page, `output: 'static'`, Tailwind
v4 via PostCSS, TypeScript strict) that presents each project as a case study and
deploys to Vercel.

The full conventions — directory layout, the content/rendering decoupling rule,
styling tokens, accessibility baseline, how to add a project, and working norms —
live in the project guidelines:

@.claude/guidelines.md

## Quick reference

- **Content is decoupled from components.** Copy lives in `src/data/*.ts` and
  `src/content/projects/*.md`, never hard-coded in `.astro` files.
- **Components are grouped by role:** `src/components/{sections,ui,layout}/`.
- **Verify with the build:** `npm run build` (there are no automated tests).
- **Commits:** concise imperative subjects, no co-author trailers.
