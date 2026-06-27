# Concrete Text-Ramp Coherence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the two off-ramp sections (Services, Experience) onto the canonical Concrete text ramp (`concrete-50` primary / `concrete-300` secondary / green accent), and brighten the two meaning-carrying hairlines (Experience timeline spine, About stack dividers) via one new mid-ramp token.

**Architecture:** Add `--color-concrete-500` to the `@theme` ramp; swap the blanket `text-white` in `Services.astro` and `Experience.astro` for `text-concrete-50` (headings/titles/primary) or `text-concrete-300` (body/meta/secondary) per element; point the Experience spine and About dividers at `border-concrete-500`. No layout, motion, content, or behavior changes. The five conformant sections (Hero/About-text/Skills/Projects/ProjectCard) and all legacy-palette sections are untouched.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6.

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Static Astro only — no React, no new dependency.
- **Canonical text ramp:** primary (section headings `h1/h2`, item titles `h3`, key values) = `text-concrete-50`; secondary (intro/body, descriptions, highlights, meta labels, periods, kind tags, `· org`, section-label wrapper) = `text-concrete-300`; signal = `text-accent` (green), unchanged. Section wrapper default = `text-concrete-50`.
- After this pass, `Services.astro` and `Experience.astro` contain **no** `text-white`.
- Hairlines: `--color-concrete-500: #6b675f` (~3.4:1 on `concrete-950`) is used by the Experience timeline spine and the About stack-list dividers. Purely decorative borders (ProjectCard stack chips, Skills legend marker, `.skill-chip`) stay `concrete-700` — do NOT change them.
- Do NOT change: Hero, Skills, Projects, ProjectCard, the About *text* colors, any legacy-palette section (Contact/Nav/Footer/SocialLinks/404), any `src/content/` or `src/data/`, any layout/motion/copy. The dark-on-green CTA buttons use `text-canvas` (not `text-white`) — leave them.
- All output English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit harness. "Verify" = `npm run check` (0 errors) + `npm run build` (exit 0) + targeted invariant greps + a desktop-width visual check.
- Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), CLS ≤0.1 (error) preserved.

---

### Task 1: Add the `--color-concrete-500` hairline token

**Files:**
- Modify: `src/styles/global.css` (the `@theme` concrete ramp, between `concrete-700` and `concrete-300`)

**Interfaces:**
- Produces: the `--color-concrete-500` token → the Tailwind utilities `border-concrete-500` / `text-concrete-500` (consumed by Tasks 3 and 4).

- [ ] **Step 1: Insert the token**

In `src/styles/global.css`, find:

```css
  --color-concrete-700: #3a3a3a; /* hard rule / divider on dark */
  --color-concrete-300: #b8b5ad; /* muted off-white — secondary text */
```

Replace with:

```css
  --color-concrete-700: #3a3a3a; /* hard rule / divider on dark */
  --color-concrete-500: #6b675f; /* mid hairline rule on dark, ~3.4:1 */
  --color-concrete-300: #b8b5ad; /* muted off-white — secondary text */
```

- [ ] **Step 2: Verify the gates and the utility generates**

Run: `grep -c "color-concrete-500" src/styles/global.css` → Expected: `1`.
Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.
Run: `grep -rhoE '\.border-concrete-500\{[^}]*\}' dist/_astro/*.css` → Expected: a rule like `.border-concrete-500{border-color:var(--color-concrete-500)}` (proves the utility exists for Tasks 3/4).

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(ui): add concrete-500 mid hairline token"
```

---

### Task 2: Move Services onto the Concrete ramp

Replace every `text-white` in `Services.astro` with `text-concrete-50` (headings/title) or `text-concrete-300` (body/meta), per the ramp. Green accent / hover unchanged.

**Files:**
- Modify: `src/components/sections/Services.astro`

**Interfaces:**
- Consumes: `--color-concrete-50` / `--color-concrete-300` / `--color-accent` tokens (already defined).

- [ ] **Step 1: Apply the seven ramp edits**

Make these exact replacements in `src/components/sections/Services.astro` (left → right). Change nothing else:

1. Section wrapper (primary default):
   `border-concrete-50 bg-concrete-950 text-white` → `border-concrete-50 bg-concrete-950 text-concrete-50`
2. Section-label wrapper (secondary):
   `<p class="font-mono text-label uppercase tracking-[0.25em] text-white">` → `<p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">`
3. Heading (primary):
   `tracking-[-0.02em] text-white md:text-6xl` → `tracking-[-0.02em] text-concrete-50 md:text-6xl`
4. Intro paragraph (secondary):
   `text-base leading-relaxed text-white md:text-lg` → `text-base leading-relaxed text-concrete-300 md:text-lg`
5. Ledger index number (secondary, decorative, keeps green hover):
   `leading-none text-white transition-colors group-hover:text-accent md:text-5xl` → `leading-none text-concrete-300 transition-colors group-hover:text-accent md:text-5xl`
6. Service title `h3` (primary, keeps green hover):
   `tracking-wide text-white transition-colors group-hover:text-accent md:text-lg` → `tracking-wide text-concrete-50 transition-colors group-hover:text-accent md:text-lg`
7. Service body paragraph (secondary):
   `text-sm leading-relaxed text-white md:text-base` → `text-sm leading-relaxed text-concrete-300 md:text-base`

- [ ] **Step 2: Verify no `text-white`, only the ramp**

Run: `grep -c "text-white" src/components/sections/Services.astro` → Expected: `0`.
Run: `grep -c "text-concrete-50" src/components/sections/Services.astro` → Expected: `3` (wrapper + heading + title).
Run: `grep -c "text-concrete-300" src/components/sections/Services.astro` → Expected: `4` (label wrapper + intro + number + body).
Run: `grep -c "text-accent" src/components/sections/Services.astro` → Expected: `> 0` (green signal/hover preserved).

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Services.astro
git commit -m "refactor(ui): move Services text onto the concrete-50/300 ramp"
```

---

### Task 3: Move Experience onto the ramp and brighten its timeline spine

Replace `text-white` with the ramp (3 → `concrete-50`, 6 → `concrete-300`), and brighten the timeline spine to `border-concrete-500`.

**Files:**
- Modify: `src/components/sections/Experience.astro`

**Interfaces:**
- Consumes: `concrete-50` / `concrete-300` / `concrete-500` (Task 1) / `accent` tokens.

- [ ] **Step 1: Apply the ramp + spine edits**

Make these exact replacements in `src/components/sections/Experience.astro`:

1. Section wrapper (primary default):
   `border-t-2 border-concrete-50 bg-concrete-950 text-white` → `border-t-2 border-concrete-50 bg-concrete-950 text-concrete-50`
2. Section-label wrapper (secondary):
   `<p class="font-mono text-label uppercase tracking-[0.25em] text-white">` → `<p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">`
3. Heading (primary):
   `tracking-[-0.02em] text-white md:text-6xl` → `tracking-[-0.02em] text-concrete-50 md:text-6xl`
4. Timeline spine (brightened rule):
   `<ol class="relative border-l-2 border-concrete-700 pl-8">` → `<ol class="relative border-l-2 border-concrete-500 pl-8">`
5. Period AND kind tag — there are two identical `text-xs` mono spans; replace BOTH occurrences of:
   `font-mono text-xs uppercase tracking-[0.2em] text-white` → `font-mono text-xs uppercase tracking-[0.2em] text-concrete-300`
6. Role `h3` (primary):
   `<h3 class="mt-2 font-sans text-lg font-semibold text-white">` → `<h3 class="mt-2 font-sans text-lg font-semibold text-concrete-50">`
7. `· org` span (secondary; resolves the redundant-color nit):
   `<span class="font-normal text-white"> · {item.org}</span>` → `<span class="font-normal text-concrete-300"> · {item.org}</span>`
8. Description (secondary):
   `text-sm leading-relaxed text-white md:text-base` → `text-sm leading-relaxed text-concrete-300 md:text-base`
9. Highlight `<li>` (secondary):
   `gap-x-3 font-sans text-sm leading-relaxed text-white">` → `gap-x-3 font-sans text-sm leading-relaxed text-concrete-300">`

- [ ] **Step 2: Verify no `text-white`, ramp + spine correct**

Run: `grep -c "text-white" src/components/sections/Experience.astro` → Expected: `0`.
Run: `grep -c "text-concrete-50" src/components/sections/Experience.astro` → Expected: `4` (wrapper + heading + role `h3` use `text-concrete-50`; the section top border uses `border-concrete-50` — 3 `text-` + 1 `border-` all match the substring `concrete-50`).
Run: `grep -c "text-concrete-300" src/components/sections/Experience.astro` → Expected: `6` (label wrapper + period + kind + org + description + highlights).
Run: `grep -c "border-concrete-500" src/components/sections/Experience.astro` → Expected: `1` (the spine).
Run: `grep -c "border-concrete-700" src/components/sections/Experience.astro` → Expected: `0` (spine no longer faint).

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Experience.astro
git commit -m "refactor(ui): move Experience text onto the ramp and brighten the timeline spine"
```

---

### Task 4: Brighten the About stack-list dividers

The only About change: the structural row dividers move from the near-invisible `concrete-700` to `concrete-500`. About text colors are untouched.

**Files:**
- Modify: `src/components/sections/About.astro`

**Interfaces:**
- Consumes: `--color-concrete-500` (Task 1).

- [ ] **Step 1: Apply the divider edit**

In `src/components/sections/About.astro`, the stack-list item divider uses `border-t border-concrete-700`. Replace that one occurrence:

`border-t border-concrete-700` → `border-t border-concrete-500`

(If `border-t border-concrete-700` appears more than once, change only the stack-list item divider near line 70; leave any other.)

- [ ] **Step 2: Verify scope (only the divider changed)**

Run: `grep -c "border-concrete-500" src/components/sections/About.astro` → Expected: `1`.
Run: `git diff --unified=0 src/components/sections/About.astro` → Expected: a single line changed, `concrete-700` → `concrete-500` on a `border-t` divider; no text-color lines touched.

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/About.astro
git commit -m "refactor(ui): brighten About stack dividers to concrete-500"
```

---

### Task 5: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `ramp_unified`**

Run: `grep -c "text-white" src/components/sections/Services.astro src/components/sections/Experience.astro` → Expected: `0` for both.
Run: `grep -roE "text-concrete-(50|300)|text-accent" src/components/sections/Services.astro src/components/sections/Experience.astro | wc -l` → Expected: `> 0` (only ramp + accent text colors present).

- [ ] **Step 3: `token_added` + hairlines**

Run: `grep -c "color-concrete-500" src/styles/global.css` → Expected: `1`.
Run: `grep -c "border-concrete-500" src/components/sections/Experience.astro src/components/sections/About.astro` → Expected: `1` each.
Run (decorative borders untouched): `grep -c "border-concrete-700" src/components/ui/ProjectCard.astro src/components/sections/Skills.astro` → Expected: `> 0` each (still `concrete-700`).

- [ ] **Step 4: `conformant_unchanged` + `content_unchanged`**

Run: `git diff --name-only $(git merge-base main HEAD) HEAD -- src/components/sections/Hero.astro src/components/sections/Skills.astro src/components/sections/Projects.astro src/components/ui/ProjectCard.astro` → Expected: empty (these were not touched in this pass — confirm none appear that were not already changed by earlier phases; scope check is the per-task diffs).
Run: `git diff --name-only $(git merge-base main HEAD) HEAD -- src/content src/data` → Expected: empty (no content/data change in THIS pass — confirm the coherence commits added nothing here).

- [ ] **Step 5: `no_collisions_remain` (regression guard)**

Run: `grep -rhoE '\.text-(canvas|surface|surface-2|ink|muted|accent|accent-2|paper|paper-soft|concrete-[0-9]+|display|label)\{[^}]*\}' dist/_astro/*.css | grep -i 'font-size' || echo "no color token hijacks a font-size utility ✓"` → Expected: the "✓" line (no `text-{color}` rule emits a font-size; the only font-size `text-*` rules are the real scale like `text-base`).

- [ ] **Step 6: `still_visible` + `lighthouse_budget_met` (visual / CI)**

`npm run preview`; at **desktop width** confirm: Services and Experience body text is the warm `concrete-300`, headings are bright `concrete-50`, the Experience timeline spine is visible, nothing is invisible. (If a browser is unavailable, note it deferred and confirm from `dist/index.html` that `#services`/`#experience` body nodes carry `text-concrete-300` and no `text-white`.) Run Lighthouse via CI per `lighthouserc.json`; record outputs and the R2 (pre-push Codex) status for the PR Evidence.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → every task + Task 5 Step 1.
- `ramp_unified` → Tasks 2–3 + Task 5 Step 2.
- `conformant_unchanged` → scope discipline (Tasks 2–4 only touch Services/Experience/About-divider) + Task 5 Step 4.
- `token_added` → Task 1 + Tasks 3–4 (consumers) + Task 5 Step 3.
- `nits_resolved` → Task 3 Step 1 edit 7 (`· org` → concrete-300, distinct from the `concrete-50` h3); no double color classes (each edit swaps one token for one token).
- `still_visible` → relies on the shipped `--color-base`→`--color-canvas` fix (commit `7a5a179`) + Task 5 Step 6.
- `no_collisions_remain` → Task 5 Step 5 (regression guard).
- `lighthouse_budget_met` → Task 5 Step 6.
- `content_unchanged` → Global Constraint + Task 5 Step 4.
- Scope "Does NOT include" (legacy sections, conformant sections, decorative borders, content/layout/motion) → respected across all tasks.

**Placeholder scan:** no TBD/TODO; every code step shows the exact find→replace pair or token text.

**Type/name consistency:** the tokens `concrete-50` / `concrete-300` / `concrete-500` / `accent` and the utilities `text-concrete-*` / `border-concrete-*` are used identically across Tasks 1–4; the expected grep counts (Services 3×50 / 4×300; Experience 4×"concrete-50" incl. the border / 6×300 / 1×500) match the edits listed.
