# Footer + SocialLinks Redesign (Concrete Terminal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the last two legacy-palette pieces — the shared `SocialLinks` icon buttons (hard-bordered concrete squares, hover→green; propagates to Hero/Contact/Footer) and the `Footer` (concrete chrome, mono copyright, a `↑ Top` back-to-top link) — completing the Concrete Terminal migration of the whole page.

**Architecture:** `SocialLinks.astro` gets a single anchor-class swap (its links/`rel`/`aria-label`/`Icon`/`class` prop unchanged), which restyles the social icons everywhere they render. `Footer.astro` gets concrete chrome + a back-to-top anchor grouped with `<SocialLinks>`. No section file is edited (the shared restyle propagates). Design language ADR-0002 already recorded — no new ADR.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6.

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Static Astro only — no React, no new dependency.
- **`SocialLinks` contract preserved verbatim:** the `links` array (`site.github`/`site.linkedin`/`mailto:site.email`), the `target`/`rel` logic (`noopener noreferrer` + `_blank` on external, none on mail), the `aria-label`s, the `Icon`, and the `class` prop merge — all unchanged. Only the per-anchor visual classes change.
- Concrete ramp + accent only: social anchor `border-concrete-700` + `bg-concrete-900` + `text-concrete-300`, `hover:border-accent hover:text-accent`, NO `rounded-lg`. Footer top rule `border-t-2 border-concrete-50` on `bg-concrete-950`; name `text-concrete-50` (the `>` stays `text-accent`); copyright `font-mono text-xs text-concrete-300`. NO legacy tokens (`border-border`, `text-ink`, `text-muted`, `bg-surface`).
- The back-to-top is an `<a href="#top">`, mono uppercase, `hover:text-accent`, with `aria-label="Back to top"` and the `↑` glyph `aria-hidden`.
- Do NOT edit any section file (Hero/Contact/etc.), `src/data/site.ts`, or `src/content/`. Do NOT remove dead legacy tokens / `.accent-rule` / migrate `404.astro` (separate final cleanup). No copy/links change.
- All output English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit harness. "Verify" = `npm run check` (0 errors) + `npm run build` (exit 0) + invariant greps + a manual check.
- Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), CLS ≤0.1 (error) preserved.

---

### Task 1: Restyle `SocialLinks` to hard-bordered concrete squares

One anchor-class swap; the shared component restyles the social icons in Hero, Contact, and Footer at once.

**Files:**
- Modify: `src/components/ui/SocialLinks.astro` (the anchor `class` only)

**Interfaces:**
- Consumes: `--color-concrete-700/900/300` + `--color-accent` tokens (already defined).
- Produces: the restyled social buttons consumed by Hero, Contact, Footer (no API change).

- [ ] **Step 1: Swap the anchor `class`**

In `src/components/ui/SocialLinks.astro`, replace:

```astro
        class="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
```

with:

```astro
        class="grid h-10 w-10 place-items-center border border-concrete-700 bg-concrete-900 text-concrete-300 transition-colors hover:border-accent hover:text-accent"
```

Change nothing else (the `links` array, `target`/`rel`, `aria-label`, `Icon`, and the `class` prop merge stay).

- [ ] **Step 2: Verify no legacy / no rounded; contract intact**

Run: `grep -Ec "rounded-lg|border-border|bg-surface|text-muted" src/components/ui/SocialLinks.astro` → Expected: `0`.
Run: `grep -Ec "border-concrete-700|bg-concrete-900|text-concrete-300|hover:border-accent" src/components/ui/SocialLinks.astro` → Expected: `>= 1` each (the new classes present).
Run (contract intact): `grep -Ec 'site.github|site.linkedin|mailto:|aria-label|noopener noreferrer' src/components/ui/SocialLinks.astro` → Expected: `> 0` (links + rel + labels unchanged).

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/SocialLinks.astro
git commit -m "refactor(ui): restyle SocialLinks as hard-bordered concrete icon buttons"
```

---

### Task 2: Redesign `Footer` chrome + add the back-to-top link

Concrete chrome, mono copyright, and a `↑ Top` anchor grouped with `<SocialLinks>`.

**Files:**
- Modify: `src/components/layout/Footer.astro`

**Interfaces:**
- Consumes: `site` (`site.name`), `SocialLinks`, `--color-concrete-*` / `--color-accent`; the build-time `year`.

- [ ] **Step 1: Apply the four edits**

In `src/components/layout/Footer.astro`:

1. The `<footer>` element:
   `<footer class="border-t border-border/60">` → `<footer class="border-t-2 border-concrete-50 bg-concrete-950">`
2. The name line:
   `<p class="font-mono text-sm font-bold text-ink">` → `<p class="font-mono text-sm font-bold text-concrete-50">`
3. The copyright line:
   `<p class="mt-1 text-xs text-muted">` → `<p class="mt-1 font-mono text-xs text-concrete-300">`
4. Replace the bare `<SocialLinks />` with a flex group that adds the back-to-top link:

```astro
      <div class="flex items-center gap-6">
        <SocialLinks />
        <a
          href="#top"
          aria-label="Back to top"
          class="font-mono text-xs uppercase tracking-[0.2em] text-concrete-300 transition-colors hover:text-accent"
        >
          <span aria-hidden="true">&uarr;</span> Top
        </a>
      </div>
```

- [ ] **Step 2: Verify no legacy; chrome + back-to-top present**

Run: `grep -Ec "border-border|text-ink|text-muted" src/components/layout/Footer.astro` → Expected: `0`.
Run: `grep -c "border-t-2 border-concrete-50" src/components/layout/Footer.astro` → Expected: `1`.
Run: `grep -c 'href="#top"' src/components/layout/Footer.astro` → Expected: `1`.
Run: `grep -c 'aria-label="Back to top"' src/components/layout/Footer.astro` → Expected: `1`.
Run: `grep -c 'aria-hidden="true"' src/components/layout/Footer.astro` → Expected: `1` (the `↑` glyph).

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Manual visual check**

`npm run preview`. Confirm: the footer has a hard concrete-50 top rule on concrete-black; `> {name}` is bright with a green `>`; the copyright is mono/dim; the social icons are hard-bordered squares turning green on hover; the `↑ Top` link sits next to them and scrolls to the top of the page. Scroll up Hero and Contact too — their social icons now match (hard squares).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat(ui): redesign Footer in Concrete Terminal with a back-to-top link"
```

---

### Task 3: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `sociallinks_brutalist` + `footer_no_legacy`**

Run: `grep -Ec "rounded-lg|border-border|bg-surface|text-muted" src/components/ui/SocialLinks.astro` → Expected: `0`.
Run: `grep -Ec "border-border|text-ink|text-muted" src/components/layout/Footer.astro` → Expected: `0`.

- [ ] **Step 3: `back_to_top_present` + `sociallinks_contract`**

Run: `grep -c 'href="#top"' src/components/layout/Footer.astro` → Expected: `1`; `grep -c 'aria-label="Back to top"' src/components/layout/Footer.astro` → Expected: `1`.
Run: `grep -c "noopener noreferrer" src/components/ui/SocialLinks.astro` → Expected: `1` (external `rel` intact); `grep -Ec "site.github|site.linkedin" src/components/ui/SocialLinks.astro` → Expected: `>= 1`.

- [ ] **Step 4: `propagation_safe` + `content_unchanged`**

Run: `git diff --name-only a3e4d16 HEAD -- src/components/sections src/data src/content` → Expected: empty (no section/content edited; the SocialLinks restyle propagates without touching them). (Use the Footer phase base `a3e4d16` — the SPEC commit's parent area — or substitute `git merge-base feat/ui-brutalist-nav HEAD`.)

- [ ] **Step 5: `lighthouse_budget_met` (CI)**

Run Lighthouse via CI (or `npx lhci autorun` if available) against `lighthouserc.json`. Record outputs for the PR Evidence; note the R2 (pre-push Codex) status.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → Task 1 Step 3, Task 2 Step 3, Task 3 Step 1.
- `sociallinks_brutalist` → Task 1 + Task 1 Step 2 + Task 3 Step 2.
- `footer_no_legacy` → Task 2 + Task 2 Step 2 + Task 3 Step 2.
- `back_to_top_present` → Task 2 Step 1 edit 4 + Task 2 Step 2 + Task 3 Step 3.
- `sociallinks_contract` → Global Constraint + Task 1 Step 2 + Task 3 Step 3.
- `propagation_safe` → no section file edited (Tasks 1–2 touch only SocialLinks/Footer) + Task 2 Step 4 visual + Task 3 Step 4.
- `content_unchanged` → Global Constraint + Task 3 Step 4.
- `lighthouse_budget_met` → Task 3 Step 5.
- Scope "Does NOT include" (sections/site.ts/content, 404, dead-token removal) → respected.

**Placeholder scan:** no TBD/TODO; every code step shows the exact find→replace or markup.

**Type/name consistency:** the social anchor classes (`border-concrete-700`/`bg-concrete-900`/`text-concrete-300`/`hover:border-accent`), the Footer chrome (`border-t-2 border-concrete-50`/`bg-concrete-950`), and the back-to-top (`href="#top"`/`aria-label="Back to top"`/`aria-hidden` `↑`) are used identically across Tasks 1–2 and the Task 3 checks.
