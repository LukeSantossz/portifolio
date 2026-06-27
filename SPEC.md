# SPEC: feat(ui): redesign Experience as a Concrete Terminal service-record timeline

## Problem

`Experience.astro` is the last content section still rendered in the legacy "dark tech"
palette. It uses the old tokens (`border-border`, `text-ink`, `text-muted`,
`.accent-rule`) and the legacy IntersectionObserver `[data-reveal]` reveal path, while
every other section (Hero, About, Services, Skills, Projects) has migrated to the
Concrete Terminal language with the GSAP `matchMedia` + ScrollTrigger entrance. It also
distinguishes work from education with a **second chromatic color** — harvest gold
(`--color-accent-2`) for education versus green for work — which the locked design
language forbids: green is the only chromatic signal. The result is the one section that
visibly breaks the site's coherence.

## Design Decision

Rebuild Experience as a **Concrete Terminal "service-record" timeline**: a hard 2px
concrete vertical spine (`--color-concrete-700`) threading the entries (most recent
first), preserving the chronological metaphor that suits a career/education history.
Each entry sits on a **square station marker** — **filled** for work, **hollow/outlined**
for education — which is the primary work-vs-education distinction (replacing the dropped
harvest gold). Because shape alone fails WCAG 1.4.1 and is invisible to assistive tech,
each marker is paired with a short **mono kind label** (`WORK` / `EDUCATION`) so the
distinction is both visible and announced. Periods render as mono uppercase labels; the
section label `06 / EXPERIENCE` is a green mono tracking label; the heading "Experience &
education" uses the brutalist display sans; body and highlights use the concrete ramp
(`--color-concrete-50` / `--color-concrete-300`) with **green as the only chromatic
accent** (highlight bullets, marker rendering). A decorative `.bt-grain` overlay
(`aria-hidden`) matches the other sections' texture.

Motion migrates to the proven, fail-safe pattern used by Services/Skills/Projects: a
single `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` block registers
ScrollTrigger and animates `data-experience-anim` targets in with
`immediateRender: false` (so content stays at its natural, visible state if ScrollTrigger
never fires), `once: true`, and a cleanup that kills the triggers and clears props. The
legacy `[data-reveal]` markup is removed from this section. The section stays static Astro
(no React). Content (`src/data/experience.ts`) is **consumed, not rewritten** — its
existing `kind` field already drives the marker and label.

## Alternatives Considered

- **Service-record ledger (hard-bordered blocks, no rail)** — rejected: visually too
  close to the Services capability ledger; the rail gives Experience its own identity and
  keeps the timeline/chronology reading.
- **Two-column "declassified record" table** — rejected in favor of the rail: weaker
  chronology metaphor and more fragile on mobile (column stacking).
- **Mono text tag (`// WORK` / `// EDU`) as the sole distinction** — the chosen primary
  signal is the marker glyph (filled vs hollow square); a mono kind label is retained, but
  only as the accessible/secondary label, not the primary visual.
- **Concrete two-tone markers (green work / grey education)** — rejected: a grey-vs-green
  marker is still a quasi-second-color distinction; filled-vs-hollow shape plus a text
  label is more on-language with "green is the only signal".
- **Keep the legacy `[data-reveal]` IntersectionObserver reveal** — rejected for
  consistency with the site-wide GSAP `matchMedia` + ScrollTrigger entrance.

## Scope

- Includes:
  - Rewrite `src/components/sections/Experience.astro`:
    - Section chrome matches the other Concrete Terminal sections:
      `relative overflow-hidden border-t-2 border-concrete-50 bg-concrete-950 text-white`
      with a decorative `.bt-grain` overlay (`aria-hidden`, `pointer-events:none`).
    - Header: green mono uppercase label `06 / EXPERIENCE`; brutalist display heading
      "Experience & education" (font-black uppercase scale, matching Services); drop the
      `.accent-rule` underline.
    - Timeline: replace the `border-l border-border` rail with a hard
      `border-l-2 border-concrete-700` spine. Each entry renders a **square station
      marker** — filled (`bg-accent`/solid) for `kind === 'work'`, hollow (bordered,
      transparent fill) for `kind === 'education'` — plus a mono `WORK` / `EDUCATION`
      label for the accessible/visible distinction.
    - Entry body: mono uppercase `period`; `role` in `concrete-50`, ` · org` in
      `concrete-300`; `description` in `concrete-300`; `highlights` as a list with green
      `▸` markers and `concrete-300` text.
    - Replace every legacy utility (`border-border`, `text-ink`, `text-muted`,
      `text-accent-2`/`bg-accent-2`, `.accent-rule`) with `concrete-*` + `accent`. No
      harvest gold in this section.
    - Replace `[data-reveal]` targets with `data-experience-anim`; add the GSAP
      `matchMedia` + ScrollTrigger entrance `<script>` modeled on `Services.astro`
      (registerPlugin, `gsap.from` opacity/y, `immediateRender:false`, `once:true`,
      cleanup that kills triggers + `clearProps:'all'`).
  - `src/data/experience.ts` is unchanged (content/rendering decoupling rule).
  - Section index stays `06`.
- Does NOT include:
  - Editing Experience copy/content (`src/data/experience.ts`) — only consumed.
  - Redesign of Contact, Nav, or Footer — later SPECs.
  - The separate coherence-audit pass over the already-done sections — its own later
    change (per the agreed scope).
  - Removing the `--color-accent-2` token or `.accent-rule` CSS globally — both remain in
    use by Contact, Nav, Footer, the 404 page, and SocialLinks until those migrate; only
    Experience stops referencing them.
  - A new ADR — this reuses the already-recorded decisions (ADR-0002 industrial-brutalist
    language, ADR-0003 GSAP, ADR-0004 ScrollTrigger for section motion); no new durable,
    surprising trade-off is introduced.

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `experience_no_legacy`: the rendered `#experience` references none of the legacy-palette
  utilities (`border-border`, `text-ink`, `text-muted`, `accent-rule`, and no
  `--color-accent-2` / `d6a84e` / `text-accent-2` / `bg-accent-2`) and no `[data-reveal]`;
  green (`--color-accent`) is the only chromatic signal.
- `work_edu_distinct`: work versus education is conveyed by the **filled vs hollow square
  marker** AND a text kind label (`WORK` / `EDUCATION`) — never by color or shape alone;
  the label is in the accessibility tree.
- `motion_failsafe_and_gated`: the entrance runs only under
  `(prefers-reduced-motion: no-preference)` via `gsap.matchMedia`; under emulated
  `prefers-reduced-motion: reduce` or with JS disabled the full timeline is visible at its
  natural state (no entry stuck hidden), and the matchMedia cleanup reverts cleanly.
- `content_unchanged`: `git diff` shows no change to `src/data/experience.ts` (nor any
  other `src/data/` or `src/content/` file).
- `reading_order_preserved`: entries are in document order (most recent first); keyboard
  and AT traversal is sensible; the decorative grain is `aria-hidden` and not focusable.
- `lighthouse_budget_met`: the existing Lighthouse CI budget (`lighthouserc.json`) still
  passes (accessibility ≥0.95 and CLS ≤0.1 are errors).
- `texture_decorative`: the grain overlay is `aria-hidden`, not focusable, contains no
  text.

## Reproducibility

- Install: `npm install` (`gsap` + ScrollTrigger already dependencies).
- Build: `npm run build`; type-check: `npm run check`.
- Performance/accessibility: Lighthouse via CI per `lighthouserc.json`.
- Motion gating: in devtools, emulate `prefers-reduced-motion: reduce` and reload — expect
  the full static timeline with no entrance animation and nothing stuck hidden; with motion
  allowed, expect the staggered entrance. Disable JS — expect the full static timeline.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core +
  ScrollTrigger), Node 22 in CI.

## Risks and Assumptions

- Assumption: static Astro, no React; ScrollTrigger from the existing `gsap` package.
- Assumption: the existing `kind: 'work' | 'education'` field is sufficient to drive both
  the marker and the label; no content change is needed.
- Risk (primary): distinguishing work from education without a second color could be
  unclear. Mitigation: filled-vs-hollow square marker plus an explicit `WORK` /
  `EDUCATION` text label (visible and in the a11y tree), satisfying WCAG 1.4.1.
- Risk: a GSAP entrance can leave content hidden if ScrollTrigger never fires. Mitigation:
  `immediateRender:false` + `matchMedia` gating + reduced-motion fallback — the same proven
  pattern shipped in Services/Skills/Projects.
- Risk: removing legacy tokens from this section could orphan `--color-accent-2` /
  `.accent-rule`. Mitigation: confirmed still used by Contact/Nav/Footer/404/SocialLinks;
  the global tokens are retained, only Experience stops referencing them.
- Invalidation: introducing React, or reintroducing a second chromatic color for the
  work/education distinction, invalidates this spec.
