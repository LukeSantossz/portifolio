# About Redesign (Concrete Terminal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. For visual fidelity, the `industrial-brutalist-ui` and `gsap-scrolltrigger` skills may be consulted during Tasks 3–4.

**Goal:** Redesign the About section into the Concrete Terminal language (Dossier layout), decouple its copy into `src/data/about.ts`, rename the design-system tokens `--color-stone-*` → `--color-concrete-*`, and add GSAP ScrollTrigger scroll-entrances — keeping the site static Astro and the accessibility/Lighthouse baseline.

**Architecture:** A mechanical token rename across `global.css` + `Hero.astro` lands first; then the About copy moves to a data module; then `About.astro` is rewritten to the Dossier layout consuming only `--color-concrete-*` + the green `--color-accent`; then a `gsap.matchMedia()`-gated ScrollTrigger module reveals the section's elements on scroll (reduced-motion and no-JS show the final content; transform/opacity only → CLS-safe).

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6, GSAP 3 (core already installed; `gsap/ScrollTrigger` ships with it), `@fontsource-variable/*`.

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x` (core + ScrollTrigger from the existing `gsap` package — no new dependency), Node 22 in CI.
- Static Astro only — **no React, no UI framework.**
- **Content relocated, not edited:** the About copy moves to `src/data/about.ts` verbatim; no copy is reworded. No changes under `src/content/projects/*`. (`content_unchanged` = no copy/content edits.)
- The harvest-gold token `--color-accent-2` **stays defined and in use** by `Services.astro`, `Experience.astro`, `ProjectCard`, `.accent-rule` — do not remove it or touch those sections. Only the **About** drops gold.
- Green signal = `--color-accent` (`#46c06a`); it is the only chromatic signal **in the About**.
- The token rename touches **only** `src/styles/global.css` and `src/components/sections/Hero.astro` (the design system's only consumers). Other sections use the legacy palette (`--color-base/surface/ink/...`) and are untouched.
- Accessibility baseline preserved; Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), seo ≥0.95 (error), CLS ≤0.1 (error), performance ≥0.9 (warn), best-practices ≥0.95 (warn), LCP ≤2500 (warn), TBT ≤200 (warn).
- All output in English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit-test harness by design. Each task is verified by gates — `npm run check` (0 errors) + `npm run build` (exit 0) + targeted invariant greps + manual checks. "Run the test" below means "run these gates."
- Out of scope (do NOT do): any other section; renumbering other sections' `0X /` labels (only About becomes `02`); migrating other sections' `[data-reveal]`; changing Hero behavior beyond the mechanical rename.

---

### Task 1: Rename design-system tokens `stone-*` → `concrete-*`

Mechanical rename to remove the collision with Tailwind v4's built-in `stone` palette before more sections adopt the system. The design system's only consumers are `global.css` (definitions) and `Hero.astro` (utilities).

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/sections/Hero.astro`

**Interfaces:**
- Produces: utilities `bg-concrete-950`, `text-concrete-50/300/700`, `border-concrete-50/700`, and tokens `--color-concrete-950/900/700/300/50` (consumed by Task 3). `--shadow-hard`, `--shadow-hard-ink`, `--text-display`, `--text-label`, `--color-accent` keep their names.

- [ ] **Step 1: Guard — confirm `stone-` lives only in the two design-system files**

Run: `grep -rln "stone-" src`
Expected: exactly `src/styles/global.css` and `src/components/sections/Hero.astro`. If any other file appears, STOP and report it (do not edit it) — it may be an unrelated coincidental match.

- [ ] **Step 2: Replace in `global.css`**

Replace every occurrence of the substring `stone-` with `concrete-` in `src/styles/global.css` (this renames the five `--color-stone-<shade>` definitions, the two `var(--color-stone-…)` references in `--shadow-hard`/`--shadow-hard-ink`, and the `var(--color-stone-950)` reference inside `.bt-scanline`). Comments contain no `stone-` substring, so they are unaffected. Use a replace-all edit.

- [ ] **Step 3: Replace in `Hero.astro`**

Replace every occurrence of the substring `stone-` with `concrete-` in `src/components/sections/Hero.astro` (renames all `*-stone-<shade>` utility classes). Use a replace-all edit.

- [ ] **Step 4: Verify no `stone-` remains and the rename is consistent**

Run: `grep -rc "stone-" src` → Expected: every file `0`.
Run: `grep -c -- "--color-concrete-" src/styles/global.css` → Expected: `5` (the ramp; the two shadow refs also match `concrete-`, so this may read higher — any value `≥ 5` is fine).

- [ ] **Step 5: Verify the gates and that the Hero is unaffected**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.
Run: `grep -o "accent-2\|d6a84e" dist/index.html | wc -l` then confirm none fall inside the Hero — quick check: `awk '/<section id="top"/{f=1} f{print} f&&/<\/section>/{exit}' dist/index.html | grep -o "accent-2\|d6a84e" | wc -l` → Expected: `0` (Hero still gold-free).

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/components/sections/Hero.astro
git commit -m "refactor(ui): rename design tokens stone-* to concrete-*"
```

---

### Task 2: Decouple About copy into `src/data/about.ts`

Move the hardcoded `paragraphs` and `facts` out of the component into a data module (matching `skills.ts`/`experience.ts`), and have `About.astro` consume it. Copy moves verbatim; markup is otherwise unchanged this task (the redesign is Task 3).

**Files:**
- Create: `src/data/about.ts`
- Modify: `src/components/sections/About.astro` (replace the local `paragraphs`/`facts` consts with an import)

**Interfaces:**
- Produces: `export const about = { paragraphs: string[]; facts: { label: string; value: string }[] }` (consumed by Task 3). The `Email` fact's value is `site.email`.

- [ ] **Step 1: Create `src/data/about.ts`**

```ts
/**
 * About section content.
 * Decoupled from the component so copy edits never touch markup
 * (matches the src/data/*.ts pattern used across the site).
 */
import { site } from './site.ts';

export const about = {
  paragraphs: [
    "I'm an AI/ML Engineer bridging two worlds that rarely meet: the commercial reality of global agriculture and the engineering of modern machine learning systems.",
    "I study Big Data for Agribusiness at Fatec Shunji Nishimura (graduating December 2026) and work at Jacto, one of the world's largest manufacturers of agricultural machinery, an experience that taught me to read a problem from the field before reaching for a model.",
    "That perspective shapes what I build. My flagship project, VisioSoil, runs computer vision on-device (Flutter + TensorFlow Lite) for soil analysis; it placed 3rd at FETEPS 2025 among 1,300+ submissions and was accepted for poster presentation at ICPA/ConBAP 2026.",
    "Beyond agriculture, I work across the modern AI stack: retrieval-augmented generation with LangGraph and Qdrant, hallucination detection via semantic entropy, and sentiment pipelines on RoBERTa. I also contribute to open source, including an accepted fix in AutoMQ.",
    "I'm now focused on remote and international ML / AI Engineer roles, where real domain understanding meets production-grade engineering.",
    "Off the keyboard: technical deep-dives (O'Reilly, Manning), Formula 1, and learning out loud in developer communities.",
  ],
  facts: [
    { label: 'Based in', value: 'Marília, São Paulo, Brazil' },
    { label: 'Education', value: 'B.Tech in Big Data for Agribusiness, Fatec (2026)' },
    { label: 'Focus', value: 'LLM agents · RAG · computer vision · NLP · MLOps' },
    { label: 'Email', value: site.email },
  ],
} as const;
```

- [ ] **Step 2: Consume it in `About.astro`**

In `src/components/sections/About.astro` frontmatter, delete the local `const paragraphs = [...]` and `const facts = [...]` blocks and add the import. Keep `import { site }` (still used for `site.name` and `site.heroBadges`) and keep `badgePositions` (presentational, removed in Task 3). Change the frontmatter top to:

```astro
---
import { site } from '../../data/site.ts';
import { about } from '../../data/about.ts';

// Where each floating stack badge sits around the photo (md+ only).
const badgePositions = ['-right-6 top-8', '-right-6 bottom-10', '-left-6 top-1/2'];
---
```

Then update the two references in the markup: `paragraphs.map((p) =>` becomes `about.paragraphs.map((p) =>`, and `facts.map((fact) =>` becomes `about.facts.map((fact) =>`. Make no other markup changes this task.

- [ ] **Step 3: Verify copy is byte-identical and gates pass**

Run: `git stash` is NOT needed — instead confirm the rendered copy is unchanged by building and diffing the About text against the prior build is impractical; instead verify the strings match the source: open `src/data/about.ts` and confirm each paragraph/fact string is identical to what `About.astro` previously held (no rewording).
Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.
Run: `grep -c "const paragraphs\|const facts" src/components/sections/About.astro` → Expected: `0` (copy no longer hardcoded in the component).

- [ ] **Step 4: Commit**

```bash
git add src/data/about.ts src/components/sections/About.astro
git commit -m "refactor(content): decouple About copy into src/data/about.ts"
```

---

### Task 3: Rewrite `About.astro` to the Concrete Terminal "Dossier" layout

Replace the soft markup with the Dossier: wide bio left; right rail = hard-framed grayscale photo (color on hover/focus/touch) + a static hard-bordered STACK panel; a hard-bordered FACTS strip below. Consumes only `--color-concrete-*` + green. Adds `data-about-anim` hooks (Task 4 uses them) and a decorative grain overlay. Adds an `#about :focus-visible` ring and makes the Email fact a `mailto:` link (the section's interactive element).

**Files:**
- Modify (full rewrite of markup): `src/components/sections/About.astro`
- Modify (append focus rule): `src/styles/global.css`

**Interfaces:**
- Consumes: `about` (Task 2), `site.name` + `site.heroBadges` (`{ title: string; sub: string }[]`), `--color-concrete-*` + `--color-accent` + `--shadow-hard` + `--text-label` (Task 1), `.bt-grain` (from the Hero phase).
- Produces: DOM hooks `data-about-anim` on the heading block, each bio paragraph, the photo figure, the STACK panel, and the FACTS strip (consumed by Task 4).

- [ ] **Step 1: Replace the entire contents of `src/components/sections/About.astro`**

```astro
---
import { site } from '../../data/site.ts';
import { about } from '../../data/about.ts';
---

<section
  id="about"
  class="relative overflow-hidden border-t-2 border-concrete-50 bg-concrete-950 text-concrete-50"
>
  <!-- Decorative analog grain (no semantics, not focusable). -->
  <div class="bt-grain" aria-hidden="true"></div>

  <div class="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-28">
    <!-- Section label + heading -->
    <div data-about-anim class="mb-12">
      <p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">
        <span class="text-accent">02 / ABOUT</span>
      </p>
      <h2
        class="mt-3 font-sans text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-concrete-50 md:text-6xl"
      >
        About me
      </h2>
    </div>

    <div class="grid gap-10 md:grid-cols-[1.6fr_1fr] md:gap-12">
      <!-- Bio -->
      <div class="space-y-5">
        {
          about.paragraphs.map((p) => (
            <p
              data-about-anim
              class="max-w-2xl font-sans text-base leading-relaxed text-concrete-300 md:text-lg"
            >
              {p}
            </p>
          ))
        }
      </div>

      <!-- Right rail: photo + STACK -->
      <div class="space-y-6">
        <figure
          data-about-anim
          class="group relative aspect-square w-full overflow-hidden border-2 border-concrete-50 shadow-hard"
        >
          <picture>
            <source srcset="/images/profile.webp" type="image/webp" />
            <img
              src="/images/profile.jpg"
              alt={`${site.name}, ${site.role}`}
              width="800"
              height="800"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0 [@media(hover:none)]:grayscale-0"
            />
          </picture>
        </figure>

        <div data-about-anim class="border-2 border-concrete-50 shadow-hard">
          <p
            class="border-b-2 border-concrete-50 bg-concrete-900 px-4 py-2 font-mono text-label uppercase tracking-[0.2em] text-accent"
          >
            Stack
          </p>
          <ul>
            {
              site.heroBadges.map((badge, index) => (
                <li class={`px-4 py-3 ${index > 0 ? 'border-t border-concrete-700' : ''}`}>
                  <p class="font-mono text-sm font-bold text-concrete-50">{badge.title}</p>
                  <p class="mt-0.5 font-mono text-xs text-concrete-300">{badge.sub}</p>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>

    <!-- Facts strip: hard 2px frame + 2px dividers via the gap trick. -->
    <dl
      data-about-anim
      class="mt-12 grid grid-cols-1 gap-[2px] border-2 border-concrete-50 bg-concrete-50 sm:grid-cols-2 lg:grid-cols-4"
    >
      {
        about.facts.map((fact) => (
          <div class="bg-concrete-950 p-4">
            <dt class="font-mono text-label uppercase tracking-[0.2em] text-concrete-300">
              {fact.label}
            </dt>
            <dd class="mt-1 break-words font-mono text-sm font-medium text-concrete-50">
              {fact.label === 'Email' ? (
                <a
                  href={`mailto:${fact.value}`}
                  class="underline-offset-2 hover:text-accent hover:underline"
                >
                  {fact.value}
                </a>
              ) : (
                fact.value
              )}
            </dd>
          </div>
        ))
      }
    </dl>
  </div>
</section>
```

- [ ] **Step 2: Append the About focus ring to `global.css`**

In `src/styles/global.css`, find the existing Hero focus rule:

```css
#top a:focus-visible,
#top button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}
```

and extend the selector list so it also covers the About:

```css
#top a:focus-visible,
#top button:focus-visible,
#about a:focus-visible,
#about button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}
```

- [ ] **Step 3: Verify no gold / no legacy palette in the About, and only concrete + green**

Run: `grep -c "accent-2\|headline-gradient\|bg-surface\|border-border\|text-ink\|text-muted\|card-lit\|accent-rule\|rounded-" src/components/sections/About.astro` → Expected: `0`.
Run: `grep -c "concrete-\|text-accent\|bg-accent\|border-accent" src/components/sections/About.astro` → Expected: `> 0`.
Run: `grep -c "data-about-anim" src/components/sections/About.astro` → Expected: `5` (heading, photo, stack, facts, plus the paragraph map = the literal attribute appears 5 times in source).

- [ ] **Step 4: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 5: Manual visual check**

`npm run preview`; scroll to About. Confirm: concrete-black section with a hard top rule, off-white display heading, green "02 / ABOUT" label, hard-framed grayscale photo that turns color on hover, a hard-bordered STACK panel (no floating/bobbing), a hard-bordered 4-up FACTS strip, faint grain. No rounded corners, no gold.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/About.astro src/styles/global.css
git commit -m "feat(ui): redesign About in Concrete Terminal Dossier layout"
```

---

### Task 4: Add GSAP ScrollTrigger scroll-entrances to the About

Reveal the `data-about-anim` elements staggered as they scroll into view, gated by `gsap.matchMedia()`. Below-the-fold, so no pre-paint anti-FOUC is needed: the hide happens only inside the motion branch, so reduced-motion and no-JS (or a failed GSAP load) leave content visible. Transform/opacity only → CLS-safe.

**Files:**
- Modify: `src/components/sections/About.astro` (append a bundled module `<script>`)

**Interfaces:**
- Consumes: the `data-about-anim` hooks from Task 3 and the `gsap` package (with `gsap/ScrollTrigger`).
- Produces: runtime behavior only.

- [ ] **Step 1: Append the ScrollTrigger module at the end of `About.astro`**

Add to the bottom of `src/components/sections/About.astro` (after the closing `</section>`):

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Motion allowed: hide the entrance targets, then reveal them in a staggered
  // batch as they scroll into view. Reduced motion / no-JS never hide anything.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = gsap.utils.toArray('#about [data-about-anim]');
    gsap.set(targets, { autoAlpha: 0, y: 24 });

    const triggers = ScrollTrigger.batch(targets, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: true,
        }),
    });

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(targets, { clearProps: 'all' });
    };
  });
</script>
```

- [ ] **Step 2: Verify the gates (ScrollTrigger resolves and bundles)**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0, no "failed to resolve import 'gsap/ScrollTrigger'".
Run: `grep -o "About.astro_astro_type_script" dist/index.html | head -1` → Expected: a match (the About module bundled).

- [ ] **Step 3: Manual behavior check**

`npm run preview`.
- Normal: scrolling the About into view staggers its elements in (heading → paragraphs → photo → stack → facts); no layout jump.
- Reduced motion: emulate `prefers-reduced-motion: reduce`, reload, scroll. Expected: no animation; all About content visible.
- (If a browser is unavailable, say so and instead confirm from the built output that the module bundled and `#about [data-about-anim]` hooks are present in `dist/index.html`.)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/About.astro
git commit -m "feat(ui): add GSAP ScrollTrigger entrances to About"
```

---

### Task 5: Record the ScrollTrigger decision (ADR-0004) and index it

The SPEC flags adopting ScrollTrigger as the scroll-driven section-motion mechanism as a durable decision.

**Files:**
- Create: `docs/adr/0004-scrolltrigger-for-section-motion.md`
- Modify: `README.md` (one Engineering Decisions row)

**Interfaces:** documentation only.

- [ ] **Step 1: Create the ADR**

Create `docs/adr/0004-scrolltrigger-for-section-motion.md`:

```markdown
# Use GSAP ScrollTrigger for scroll-driven section entrances

ADR-0003 adopted GSAP for the Hero's load-time intro. As the brutalist redesign extends
to below-the-fold sections (starting with About), those need scroll-driven entrances. We
adopt GSAP's ScrollTrigger plugin (imported from the existing `gsap` package) as the
mechanism, gated by `gsap.matchMedia()` for `prefers-reduced-motion`. The hide is applied
only inside the motion branch, so reduced-motion, no-JS, and a failed script load all
leave content visible; entrances animate transform/opacity only, protecting the CLS
budget. The legacy CSS `[data-reveal]` system stays in place for the not-yet-redesigned
sections until they migrate.

## Status

Accepted.

## Considered Options

- **GSAP ScrollTrigger (chosen)**: cohesive with the Hero's GSAP intro, precise staggered
  reveals, first-class reduced-motion gating, no new dependency (ships with `gsap`).
- **Keep the CSS `[data-reveal]` IntersectionObserver reveals**: zero new code, but a
  softer fade/slide with no shared motion vocabulary and limited sequencing control.
- **No scroll motion**: lightest, but loses the entrance rhythm the rest of the site has.

## Consequences

- ScrollTrigger is registered where used; per-section motion modules gate with
  `matchMedia` and animate transform/opacity only.
- `[data-reveal]` remains for legacy sections; each redesigned section replaces its
  `[data-reveal]` usage with a ScrollTrigger module.
- Lighthouse performance/CLS budgets are watched; if a budget breaks, reduce motion scope.
- Verification follows ADR-0001 (build + type-check + Lighthouse + manual checklist).
```

- [ ] **Step 2: Add the README Engineering Decisions row**

In `README.md`, in the Engineering Decisions table, after the ADR-0003 row, add:

```markdown
| GSAP ScrollTrigger for scroll-driven section entrances | Keep CSS `[data-reveal]`; no scroll motion | Cohesive staggered, reduced-motion-gated reveals as the brutalist redesign moves below the fold, with no new dependency. See [ADR-0004](docs/adr/0004-scrolltrigger-for-section-motion.md). |
```

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add docs/adr/0004-scrolltrigger-for-section-motion.md README.md
git commit -m "docs: record ScrollTrigger section-motion ADR"
```

---

### Task 6: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `token_rename_complete`**

Run: `grep -rc "stone-" src` → Expected: every file `0`.
Run: `grep -c -- "--color-concrete-" src/styles/global.css` → Expected: `≥ 5`.
Run (Hero still gold-free): `awk '/<section id="top"/{f=1} f{print} f&&/<\/section>/{exit}' dist/index.html | grep -o "accent-2\|d6a84e" | wc -l` → Expected: `0`.

- [ ] **Step 3: `about_no_gold_no_legacy` (scoped to the rendered About)**

Run: `awk '/<section id="about"/{f=1} f{print} f&&/<\/section>/{exit}' dist/index.html | grep -o "accent-2\|d6a84e\|bg-surface\|border-border\|card-lit\|accent-rule" | wc -l` → Expected: `0`.
Run (green present in About): `awk '/<section id="about"/{f=1} f{print} f&&/<\/section>/{exit}' dist/index.html | grep -o "text-accent\|bg-accent\|border-accent" | wc -l` → Expected: `> 0`.

- [ ] **Step 4: `about_content_decoupled` + `content_unchanged`**

Run: `grep -c "const paragraphs\|const facts" src/components/sections/About.astro` → Expected: `0`.
Run: `git diff --name-only $(git merge-base main HEAD) HEAD -- src/content` → Expected: empty.
Manually confirm the `about.ts` strings are byte-identical to the original copy (no rewording).

- [ ] **Step 5: `about_texture_decorative` + `about_focus_visible` (static)**

Run: `awk '/<section id="about"/{f=1} f{print} f&&/<\/section>/{exit}' dist/index.html | grep -o 'class="bt-grain" aria-hidden="true"'` → Expected: a match.
Run: `grep -roh "#about a:focus-visible" dist/_astro/*.css | head -1` → Expected: a match (focus rule bundled).

- [ ] **Step 6: `about_scrolltrigger_reduced_motion` + `cls_safe` + `lighthouse_budget_met`**

`npm run preview` and confirm in a browser: entrances animate on scroll; under emulated reduced-motion they do not and content is shown; only transform/opacity animate (no layout shift). Run Lighthouse via CI (or `npx lhci autorun` if `@lhci/cli` is available) against `lighthouserc.json`. Record outputs for the PR Evidence and note R2 status.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → every task + Task 6.
- `token_rename_complete` → Task 1 + Task 6 Step 2.
- `about_no_gold_no_legacy` → Task 3 (rewrite drops legacy/gold) + Task 6 Step 3.
- `about_content_decoupled` → Task 2 + Task 6 Step 4.
- `about_scrolltrigger_reduced_motion` → Task 4 (matchMedia, hide only in motion branch) + Task 6 Step 6.
- `about_texture_decorative` → Task 3 (`.bt-grain` aria-hidden) + Task 6 Step 5.
- `about_focus_visible` → Task 3 (focus rule + mailto link) + Task 6 Step 5.
- `cls_safe` → Task 4 (transform/opacity only) + Task 6 Step 6.
- `lighthouse_budget_met` → Task 6 Step 6.
- `content_unchanged` → Global Constraint + Task 2 (verbatim move) + Task 6 Step 4.
- Scope "Includes" (rename, about.ts, Dossier rewrite, ScrollTrigger, a11y, ADR) → Tasks 1–5. "Does NOT include" → respected (no other sections, gold kept globally, only About → 02, no `src/content` edits).

**Placeholder scan:** no TBD/TODO; every code step contains complete content.

**Type/name consistency:** `about.paragraphs`/`about.facts`, `site.heroBadges` `{title,sub}`, `--color-concrete-*`, `data-about-anim`, and the `mm`/`triggers` locals are used identically across Tasks 2–4.
