# Nav Redesign (Concrete Terminal — Mono Nav Bar) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the fixed top Nav to Concrete Terminal — concrete chrome, mono-uppercase links with the preserved green active-underline, a green→light-green scroll-progress bar (no harvest gold), and a brutalist Resume CTA — keeping the toggle/progress/scroll-spy behavior verbatim.

**Architecture:** One implementation task edits both files this change spans: `Nav.astro`'s `<header>` markup (the `links` array and the entire `<script>` stay untouched) and the two Nav-owned rules in `global.css` (`#scroll-progress` gradient → green-only; `.nav-link.is-current` color → `concrete-50`). The `.nav-link::after` underline rule already uses `accent` and is unchanged. Design language ADR-0002 already recorded — no new ADR. Nav has no `[data-reveal]`/entrance, so no GSAP module.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6.

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Static Astro only — no React, no new dependency.
- **Preserve the Nav behavior verbatim:** the entire `<script>` (mobile toggle flipping `aria-expanded`/`aria-label`, the `--p` scroll-progress, the IntersectionObserver scroll-spy toggling `.is-current`), the element ids `nav-toggle` / `mobile-menu` / `scroll-progress`, the `data-nav-link` attributes, the `nav-link` class, and the `links` array — all unchanged. Only markup styling changes.
- Concrete ramp + accent only in Nav: logo/active `text-concrete-50`; links `text-concrete-300` → `hover:text-concrete-50`; signal `accent`. Links are `font-mono` + `uppercase` + tracking. The scroll-progress bar is **green-only** (green→light-green; NO `--color-accent-2`/`#d6a84e`). NO legacy tokens (`border-border`, `text-ink`, `text-muted`, `bg-surface`, `hover:text-ink`) and NO `rounded-lg`.
- Do NOT touch `SocialLinks.astro`, `Footer.astro`, any content section, `src/data/`, `src/content/`. Do NOT remove `--color-accent-2`, the `.accent-rule` CSS, or `--color-ink`/`--color-muted` tokens (still used by Footer/SocialLinks). No copy/links change.
- All output English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit harness. "Verify" = `npm run check` (0 errors) + `npm run build` (exit 0) + invariant greps + a manual check.
- Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), CLS ≤0.1 (error) preserved.

---

### Task 1: Redesign the Nav bar (markup + the two Nav-owned global.css rules)

Rewrite the `<header>` markup to mono-uppercase concrete styling and drop the gold from the progress bar; keep the frontmatter, the `<script>`, ids, `data-nav-link`, and `nav-link` class intact.

**Files:**
- Modify: `src/components/layout/Nav.astro` (replace the `<header>…</header>` block only)
- Modify: `src/styles/global.css` (`#scroll-progress` background; `.nav-link.is-current` color)

**Interfaces:**
- Consumes: `site` (`site.name`, `site.initials`, `site.cvPath`), `Icon`, `links`; `--color-concrete-*` / `--color-accent` tokens; the `.nav-link`/`.is-current`/`#scroll-progress` rules in `global.css`.
- Produces: the same DOM hooks the unchanged `<script>` already targets (`#nav-toggle`, `#mobile-menu`, `#scroll-progress`, `[data-nav-link]`, `.nav-link`).

- [ ] **Step 1: In `src/components/layout/Nav.astro`, replace the entire `<header>…</header>` block (from `<header` through `</header>`) with this markup**

Leave the frontmatter (the `import`s and the `links` array) and the `<script>` after `</header>` exactly as they are.

```astro
<header
  class="fixed inset-x-0 top-0 z-40 border-b border-concrete-700 bg-concrete-950/80 backdrop-blur-md"
>
  <!-- Scroll progress bar: fills left-to-right as the page scrolls. -->
  <div
    id="scroll-progress"
    aria-hidden="true"
    class="pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
  >
  </div>
  <nav class="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
    <a
      href="#top"
      class="font-mono text-sm font-bold tracking-tight text-concrete-50"
      aria-label={`${site.name}, home`}
    >
      <span class="text-accent">&gt;</span> {site.initials}
    </a>

    <!-- Desktop links -->
    <ul class="hidden items-center gap-7 md:flex">
      {
        links.map((link) => (
          <li>
            <a
              href={link.href}
              class="nav-link font-mono text-xs uppercase tracking-[0.2em] text-concrete-300 transition-colors hover:text-concrete-50"
              data-nav-link
            >
              {link.label}
            </a>
          </li>
        ))
      }
      <li>
        <a
          href={site.cvPath}
          download
          class="border-2 border-accent px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-concrete-950"
        >
          Resume
        </a>
      </li>
    </ul>

    <!-- Mobile toggle -->
    <button
      id="nav-toggle"
      class="grid h-10 w-10 place-items-center text-concrete-50 md:hidden"
      aria-label="Open menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
    >
      <Icon name="menu" />
    </button>
  </nav>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden border-t border-concrete-700 bg-concrete-950 md:hidden">
    <ul class="space-y-1 px-6 py-4">
      {
        links.map((link) => (
          <li>
            <a
              href={link.href}
              class="block px-3 py-2 font-mono text-sm uppercase tracking-[0.2em] text-concrete-300 transition-colors hover:bg-concrete-900 hover:text-concrete-50"
              data-nav-link
            >
              {link.label}
            </a>
          </li>
        ))
      }
      <li>
        <a
          href={site.cvPath}
          download
          class="mt-1 block border-2 border-accent px-3 py-2 text-center font-mono text-sm font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-concrete-950"
          data-nav-link
        >
          Download Resume
        </a>
      </li>
    </ul>
  </div>
</header>
```

- [ ] **Step 2: In `src/styles/global.css`, recolor the scroll-progress bar green-only**

Find:

```css
#scroll-progress {
  transform: scaleX(var(--p, 0));
  transform-origin: left center;
  transition: transform 0.1s linear;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-2));
}
```

Replace the `background` line with:

```css
  background: linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 50%, white));
```

- [ ] **Step 3: In `src/styles/global.css`, recolor the active nav link onto the concrete ramp**

Find:

```css
.nav-link.is-current {
  color: var(--color-ink);
}
```

Replace with:

```css
.nav-link.is-current {
  color: var(--color-concrete-50);
}
```

- [ ] **Step 4: Verify no legacy / gold; ramp + mono + preserved hooks**

Run: `grep -Ec "border-border|text-ink|text-muted|bg-surface|hover:text-ink|rounded-lg" src/components/layout/Nav.astro` → Expected: `0`.
Run: `grep -Ec "text-concrete-50|text-concrete-300|border-accent|text-accent" src/components/layout/Nav.astro` → Expected: `> 0`.
Run (mono uppercase links): `grep -c "font-mono text-xs uppercase" src/components/layout/Nav.astro` → Expected: `1` (desktop link map); `grep -c "font-mono text-sm uppercase" src/components/layout/Nav.astro` → Expected: `>= 1` (mobile links + CTAs).
Run (hooks preserved): `grep -Ec 'id="nav-toggle"|id="mobile-menu"|id="scroll-progress"' src/components/layout/Nav.astro` → Expected: `3`. Run: `grep -c "data-nav-link" src/components/layout/Nav.astro` → Expected: `3`. Run: `grep -c "nav-link " src/components/layout/Nav.astro` → Expected: `1` (the desktop `nav-link` class on the link).
Run (progress green-only): `grep -A4 "#scroll-progress {" src/styles/global.css | grep -c "accent-2"` → Expected: `0`. Run: `grep -A4 "#scroll-progress {" src/styles/global.css | grep -c "color-mix"` → Expected: `1`.
Run (is-current ramp): `grep -A2 ".nav-link.is-current {" src/styles/global.css | grep -c "concrete-50"` → Expected: `1`.

- [ ] **Step 5: Verify the `<script>` and `links` are untouched**

Run: `git diff src/components/layout/Nav.astro` and confirm the changed lines are ALL inside the `<header>…</header>` block; the frontmatter `links` array and every line of the `<script>` (toggle/progress/scroll-spy) show as unchanged.
Run: `grep -c "addEventListener('scroll'" src/components/layout/Nav.astro` → Expected: `1`. Run: `grep -c "is-current" src/components/layout/Nav.astro` → Expected: `1` (the scroll-spy `classList.toggle('is-current', …)` in the script).

- [ ] **Step 6: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 7: Manual visual check**

`npm run preview`. Confirm: the fixed header is concrete-black/blurred with a subtle bottom rule; the logo is `> LG` (green `>`); desktop links are mono uppercase, dimmed, brightening on hover; scrolling fills a green→light-green progress bar (no gold) and the in-view section's link shows the green underline; the Resume button is a bordered green pill that fills green with dark text on hover. Resize to mobile → the toggle opens/closes the menu (mono-uppercase links), `aria-expanded` flips.

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/Nav.astro src/styles/global.css
git commit -m "feat(ui): redesign Nav in Concrete Terminal with a mono nav bar and green progress"
```

---

### Task 2: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to Task 1.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `nav_no_legacy` + `mono_uppercase_links`**

Run: `grep -Ec "border-border|text-ink|text-muted|bg-surface|hover:text-ink|rounded-lg" src/components/layout/Nav.astro` → Expected: `0`.
Run: `grep -Ec "font-mono.*uppercase" src/components/layout/Nav.astro` → Expected: `>= 2` (desktop + mobile link maps; CTAs also mono uppercase).

- [ ] **Step 3: `progress_green_only`**

Run: `grep -A4 "#scroll-progress {" src/styles/global.css | grep -Ec "accent-2|d6a84e"` → Expected: `0`.
Run: `grep -A4 "#scroll-progress {" src/styles/global.css | grep -c "var(--color-accent)"` → Expected: `>= 1` (green present).

- [ ] **Step 4: `js_behavior_preserved`**

Run: `grep -Ec "aria-expanded|scroll-progress|is-current|addEventListener" src/components/layout/Nav.astro` → Expected: `> 0` (the toggle/progress/scroll-spy script intact).
Confirm via `git diff $(git merge-base main HEAD) HEAD -- src/components/layout/Nav.astro` that no line inside the `<script>` block changed.

- [ ] **Step 5: `content_unchanged` + `sociallinks_footer_untouched`**

Run: `git diff --name-only b52e70b HEAD -- src/data src/content src/components/ui/SocialLinks.astro src/components/layout/Footer.astro` → Expected: empty (none changed since the Nav phase began; use the Nav phase base — the commit the branch started from — if `b52e70b` predates it, substitute `git merge-base feat/ui-brutalist-contact HEAD`).

- [ ] **Step 6: `lighthouse_budget_met` (CI)**

Run Lighthouse via CI (or `npx lhci autorun` if available) against `lighthouserc.json`. Record outputs for the PR Evidence; note the R2 (pre-push Codex) status.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → Task 1 Step 6, Task 2 Step 1.
- `nav_no_legacy` → Task 1 (rewrite drops legacy + rounded) + Task 1 Step 4 + Task 2 Step 2.
- `progress_green_only` → Task 1 Step 2 + Task 1 Step 4 + Task 2 Step 3.
- `mono_uppercase_links` → Task 1 (mono uppercase link classes) + Task 1 Step 4 + Task 2 Step 2; active underline kept via the unchanged `.nav-link::after` + `.is-current` (Task 1 Step 3 recolor).
- `js_behavior_preserved` → Task 1 (script untouched; ids/data-nav-link/nav-link kept) + Task 1 Step 5 + Task 2 Step 4.
- `content_unchanged` / `sociallinks_footer_untouched` → Global Constraint + Task 2 Step 5.
- `lighthouse_budget_met` → Task 2 Step 6.
- Scope "Does NOT include" (SocialLinks/Footer/content, removing accent-2/accent-rule/ink, links change) → respected.

**Placeholder scan:** no TBD/TODO; every code step shows the exact markup or find→replace.

**Type/name consistency:** the ids (`nav-toggle`/`mobile-menu`/`scroll-progress`), `data-nav-link`, the `nav-link` class, `.is-current`, and the `--color-concrete-*`/`--color-accent` tokens are referenced identically in the markup, the global.css rules, and the (unchanged) script; the green-only gradient uses `color-mix(in srgb, var(--color-accent) 50%, white)` consistently.
