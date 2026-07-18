# Portfolio operating guide

> Execute autonomously safe verification, initialization, tests, and fixes whenever possible. Stop only for risk of data loss, an irreversible change, or a product decision that cannot be inferred.

## Product

- **Objective:** present Lucas Gonçalves as an AI/ML Engineer for remote and international opportunities.
- **Audience:** recruiters, engineering managers, and technical collaborators assessing applied ML work.
- **Value proposition:** grounded AI/ML work for real constraints, demonstrated through traceable case studies rather than unsupported claims.
- **Primary action:** open the case studies, then start contact. Downloading the résumé is secondary.

## Stack and commands

- Astro 6, TypeScript, Tailwind CSS 4, GSAP, Inter Variable, and JetBrains Mono Variable.
- `npm.cmd run dev -- --host 127.0.0.1 --port 4321` starts the local site on Windows.
- `npm.cmd run check` runs Astro and TypeScript checks.
- `npm.cmd run build` creates the production build (and regenerates the social image).
- `npm.cmd run og` regenerates only the Open Graph image.

## Architecture

- `src/data/` owns site copy and structured content.
- `src/components/sections/` owns page sections; `src/components/ui/` owns reusable UI; `src/components/layout/` owns global chrome.
- `src/content/projects/` holds project case studies.
- `src/styles/global.css` owns global tokens, focus styles, and cross-component interaction rules.
- Public assets live in `public/`: photos in `public/images/`, document downloads at its root, and sharing/favicons at its root until a category needs more than one asset.

## Design and component rules

- Follow `design.md`. Prefer tokens to arbitrary component-level values.
- The industrial editorial language uses concrete neutrals, off-white ink, and one lime signal color. Lime indicates action, current state, or proven outcome.
- Make each component earn its visual weight. Avoid generic SaaS card grids, decorative metric inflation, and duplicated section rhythms.
- Use existing local SVG icons via `Icon.astro`; do not mix icon libraries. Add an icon only when it disambiguates an action, and retain its text label when the action is not universally obvious.
- Use semantic landmarks and heading order. Every interactive control needs a visible keyboard focus state and a minimum practical touch target.
- Public copy uses plain punctuation: no em or en dashes and no `&mdash;` / `&ndash;` entities. Use a comma, a colon, parentheses, or a new sentence instead. Code comments are out of scope. Numbered section eyebrows (`01 / HELLO` through `07 / CONTACT`) are the one sanctioned numbering in public copy, per ADR-0011; no other ordinal prefix belongs there.

## Responsive and motion rules

- Validate at roughly 320px, 390px, 768px, 1440px, and 1600px wide.
- Mobile is the baseline: preserve linear reading order and never require hover or horizontal pinned scrolling to reach content.
- Motion must orient, confirm, or reveal hierarchy. No continuous animation unless it conveys useful state.
- Respect `prefers-reduced-motion`; content must remain fully visible and operable without JavaScript.

## Verification and completion

- Before a meaningful change, inspect `git status`; preserve unrelated changes.
- Use small, descriptive Git checkpoints after stable milestones and review each diff before committing.
- For UI work: capture equivalent before/after screenshots, inspect desktop/tablet/mobile, keyboard navigation, overflow, console errors, and reduced-motion behavior.
- Run `npm.cmd run check` and `npm.cmd run build` before deployment. Do not claim a check that was not run.
- Before publishing, confirm environment variables, metadata, favicon, Open Graph image, routes, and public/private access. Do not alter domains or access settings without explicit approval.
