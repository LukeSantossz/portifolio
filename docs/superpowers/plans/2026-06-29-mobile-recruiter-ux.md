# Recruiter-First Adaptive Mobile Experience — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio landing page land "who / fit / how to reach" for a recruiter in the first screen or two on a phone, by adding mobile-only chrome and divergent feature treatments below `md`, with desktop untouched.

**Architecture:** All changes are gated on the existing Tailwind `md` breakpoint (768px). New mobile chrome renders below `md` and is `md:hidden`; desktop-only behavior stays at `md:`/`lg:`. No content (`src/data/*`) changes; everything is server-rendered Astro + Tailwind utilities, so it degrades with no JS and under reduced motion. Stays inside the Concrete-Terminal language (ADR-0002).

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4, TypeScript 6. No new dependencies.

## Global Constraints

- Mobile/desktop divider is Tailwind `md` = 768px. Tablets (768–1024px) follow the desktop layout. (SPEC: Scope, Risks)
- Do NOT change `src/data/*` content/copy, the résumé PDF, or SEO metadata. (SPEC: Does NOT include)
- Do NOT change any desktop (`≥ 768px`) visual. (SPEC: AC8)
- No new design language, color, or font; stay within Concrete-Terminal / ADR-0002. (SPEC: Design Decision)
- Tap targets ≥ 44×44px; honor `env(safe-area-inset-bottom)`. (SPEC: AC2, AC3)
- Verification is presentation-only (ADR-0001): there is NO unit-test harness — do not add one. Each task's gate is `npm run build` (exit 0) + `npm run check` (0 errors) + a manual visual check at 320 / 360 / 390 / 430 px. (SPEC: Reproducibility)
- Conventional Commits; no co-author / AI-attribution trailers (`.standards/github.md`). One commit per task.
- Read from `src/data/site.ts`: `site.email`, `site.cvPath`, `site.linkedin`.

---

### Task 1: Mobile sticky action bar

**Files:**
- Create: `src/components/layout/MobileActionBar.astro`
- Modify: `src/pages/index.astro` (add import + render + bottom-clearance spacer)

**Interfaces:**
- Consumes: `site.email`, `site.cvPath`, `site.linkedin` from `src/data/site.ts`; `Icon` from `src/components/ui/Icon.astro` (icon names `mail`, `download`, `linkedin` — all confirmed to exist).
- Produces: a fixed bottom `<nav aria-label="Quick contact">`, `md:hidden`, with three ≥44px controls. Consumed only by `index.astro`.

- [ ] **Step 1: Create the component**

Create `src/components/layout/MobileActionBar.astro`:

```astro
---
import Icon from '../ui/Icon.astro';
import { site } from '../../data/site.ts';

// Mobile-only sticky action bar: the three highest-intent recruiter actions in the
// thumb zone, always one tap away. Hidden at md+ (desktop keeps the hero CTAs and
// the Contact section). Reads the single source of truth in site.ts.
const actions = [
  { href: `mailto:${site.email}`, label: 'Email', icon: 'mail' as const, external: false, download: false },
  { href: site.cvPath, label: 'CV', icon: 'download' as const, external: false, download: true },
  { href: site.linkedin, label: 'LinkedIn', icon: 'linkedin' as const, external: true, download: false },
];
---

<nav
  aria-label="Quick contact"
  class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t-2 border-concrete-50 bg-concrete-950 md:hidden"
  style="padding-bottom: env(safe-area-inset-bottom);"
>
  {
    actions.map((action, index) => (
      <a
        href={action.href}
        download={action.download ? true : undefined}
        target={action.external ? '_blank' : undefined}
        rel={action.external ? 'noopener noreferrer' : undefined}
        class={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-concrete-50 transition-colors hover:text-accent ${
          index > 0 ? 'border-l-2 border-concrete-50' : ''
        }`}
      >
        <Icon name={action.icon} size={20} />
        {action.label}
      </a>
    ))
  }
</nav>
```

- [ ] **Step 2: Wire it into the page with bottom clearance**

In `src/pages/index.astro`, add the import alongside the other layout imports:

```astro
import Footer from '../components/layout/Footer.astro';
import MobileActionBar from '../components/layout/MobileActionBar.astro';
```

Replace the closing of the Layout (currently `  <Footer />\n</Layout>`) with the Footer, a mobile-only clearance spacer, and the bar:

```astro
  <Footer />
  <!-- Bottom clearance so the fixed mobile action bar never overlaps the footer. -->
  <div aria-hidden="true" class="md:hidden" style="height: calc(3.25rem + env(safe-area-inset-bottom));"></div>
  <MobileActionBar />
</Layout>
```

- [ ] **Step 3: Run the build gate**

Run: `npm run build`
Expected: completes with no errors (ends with the Astro "Complete!" build summary).

- [ ] **Step 4: Run the type/check gate**

Run: `npm run check`
Expected: `0 errors` (no new warnings introduced by the new file).

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open the device toolbar.
Verify (SPEC AC2, AC3): at 360px the bar is fixed to the bottom with three cells — Email (`mailto:`), CV (downloads `my_resume.pdf`), LinkedIn (opens in a new tab); each cell is ≥44px tall; scrolling to the very bottom shows the full Footer (incl. "Back to top") above the bar. At 768px the bar is **not** present.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/MobileActionBar.astro src/pages/index.astro
git commit -m "feat(ui): add mobile sticky action bar for recruiter contact"
```

---

### Task 2: Compact recruiter-first hero on mobile

**Files:**
- Modify: `src/components/sections/Hero.astro`

**Interfaces:**
- Consumes: nothing new. Pure responsive-class edits to existing markup; `site.heroStats[0]` is already the accent-colored first cell of the stats `<dl>`.
- Produces: no new interface. Behavior: top-aligned hero on mobile, full-width stacked CTAs, hidden inline social row (the action bar carries it), strongest stat inside the first viewport.

- [ ] **Step 1: Top-align and reduce top padding on mobile**

In `src/components/sections/Hero.astro`, change the inner container class from:

```
class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 pb-16 pt-32 md:pt-36"
```

to:

```
class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start px-6 pb-16 pt-24 md:justify-center md:pt-36"
```

- [ ] **Step 2: Make the CTAs full-width and stacked on mobile, hide the inline social row**

Change the CTA wrapper class from:

```
class="mt-10 flex flex-wrap items-center gap-4"
```

to:

```
class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-10"
```

On the **"View projects"** anchor, add `w-full justify-center sm:w-auto` to its class list (it currently begins `inline-flex items-center gap-2 border-2 border-accent bg-accent ...`), making it:

```
class="inline-flex w-full items-center justify-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-concrete-950 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:w-auto"
```

On the **"Download CV"** anchor, likewise add `w-full justify-center sm:w-auto`:

```
class="inline-flex w-full items-center justify-center gap-2 border-2 border-concrete-50 bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-concrete-50 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:w-auto"
```

Change the social wrapper from:

```
<div class="ml-1 flex items-center gap-4">
```

to (hidden below `md`, where the action bar carries social/contact):

```
<div class="ml-1 hidden items-center gap-4 md:flex">
```

- [ ] **Step 3: Tighten the stats strip top margin on mobile**

Change the stats `<dl>` class from:

```
class="mt-14 grid max-w-4xl grid-cols-1 border-2 border-concrete-50 sm:grid-cols-3"
```

to:

```
class="mt-8 grid max-w-4xl grid-cols-1 border-2 border-concrete-50 sm:grid-cols-3 md:mt-14"
```

- [ ] **Step 4: Run the build gate**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 5: Run the type/check gate**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 6: Manual verification**

Run/refresh `npm run dev`.
Verify (SPEC AC5): at **375×667** the first viewport shows — without scrolling — the availability label, name, role, headline, both full-width CTAs, and the **first/strongest stat ("3rd of 1,300+")**. At **320px** the name headline does not cause horizontal scrolling. The inline social icons are gone on mobile (covered by the action bar) and reappear at ≥768px. At ≥768px the hero is visually unchanged (centered, social row present, original spacing).

> If the strongest stat sits just below the fold at 375×667, the only allowed tuning is to reduce the stat cell padding `p-5 → p-4` on mobile and/or lower the `--text-display` clamp floor in `global.css` (e.g. `clamp(2.5rem, 11vw, 8.5rem)`); re-verify 320px afterward. Do not hide hero content.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero.astro
git commit -m "feat(ui): compact recruiter-first hero on mobile"
```

---

### Task 3: Static grouped Skills view on mobile

**Files:**
- Modify: `src/components/sections/Skills.astro`

**Interfaces:**
- Consumes: `skillGroups` from `src/data/skills.ts` (already imported in the file): array of `{ category: string; items: string[] }`.
- Produces: a `md:hidden` static grouped block. The existing marquee + legend become desktop-only (`hidden md:block`). No `global.css` change — the static chips use Tailwind utilities, not the `.skill-chip` class.

- [ ] **Step 1: Make the marquee desktop-only**

In `src/components/sections/Skills.astro`, change the marquee wrapper from:

```
<div data-skills-anim class="skills-marquee relative z-10 space-y-3">
```

to:

```
<div data-skills-anim class="skills-marquee relative z-10 hidden space-y-3 md:block">
```

- [ ] **Step 2: Make the legend desktop-only**

Change the legend wrapper from:

```
<div class="relative z-10 mx-auto mt-8 max-w-6xl px-6">
```

to:

```
<div class="relative z-10 mx-auto mt-8 hidden max-w-6xl px-6 md:block">
```

- [ ] **Step 3: Add the mobile static grouped block**

Immediately **after** the legend wrapper's closing `</div>` (and before the `</section>`), insert:

```astro
  <!-- Mobile: static grouped skills — instantly scannable, no hover/motion dependency. -->
  <div data-skills-anim class="relative z-10 mx-auto mt-2 max-w-6xl space-y-6 px-6 md:hidden">
    {
      skillGroups.map((group) => (
        <div>
          <p class="font-mono text-label uppercase tracking-[0.2em] text-accent">
            {group.category}
          </p>
          <ul class="mt-2 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li class="border border-concrete-700 px-3 py-1.5 font-mono text-xs text-concrete-50">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))
    }
  </div>
```

- [ ] **Step 4: Run the build gate**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 5: Run the type/check gate**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 6: Manual verification**

Run/refresh `npm run dev`.
Verify (SPEC AC4): at 360px the Skills section shows five labeled groups (Languages, ML & Data, LLM & RAG, Mobile & Backend, Cloud & Tooling) with every item as a bordered chip, wrapping with no horizontal scroll; the moving marquee and the legend are absent. At ≥768px the marquee + legend render and the static groups are absent.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Skills.astro
git commit -m "feat(ui): show static grouped skills on mobile instead of the marquee"
```

---

### Task 4: Make the Contact map desktop-only

**Files:**
- Modify: `src/components/sections/Contact.astro`

**Interfaces:**
- Consumes: nothing new.
- Produces: the easter-egg map layer is hidden below `md`; the `ipwho.is` lookup is skipped on mobile.

- [ ] **Step 1: Hide the map layer below `md`**

In `src/components/sections/Contact.astro`, change the map wrapper from:

```
class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
```

to:

```
class="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center md:flex"
```

- [ ] **Step 2: Skip the IP lookup on mobile**

In the easter-egg `<script>` block, change the guard from:

```js
  const point = document.querySelector('#contact [data-visitor-point]');
  if (point) {
```

to:

```js
  const point = document.querySelector('#contact [data-visitor-point]');
  // The map is desktop-only (hidden < md), so skip the third-party IP lookup on mobile.
  if (point && window.matchMedia('(min-width: 768px)').matches) {
```

- [ ] **Step 3: Run the build gate**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 4: Run the type/check gate**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 5: Manual verification**

Run/refresh `npm run dev`.
Verify (SPEC AC1): at 360px the Contact section has no background map; with the Network tab open and the page loaded on mobile width, there is **no** request to `ipwho.is`. At ≥768px the faint map renders and the visitor point still resolves (request to `ipwho.is` fires).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Contact.astro
git commit -m "feat(ui): make the Contact-background map desktop-only"
```

---

### Task 5: Tighten section vertical rhythm on mobile

**Files:**
- Modify: `src/components/sections/About.astro`, `Services.astro`, `Skills.astro`, `Experience.astro`, `Contact.astro`, `Projects.astro`

**Interfaces:**
- Consumes / Produces: nothing — pure spacing edits. Desktop padding (`md:py-28` / `md:pt-28` / `md:pb-28`) is preserved; only the mobile base shrinks `24 → 16`.

- [ ] **Step 1: About, Services, Contact**

In each of `About.astro`, `Services.astro`, and `Contact.astro`, change the inner container's `py-24 md:py-28` to `py-16 md:py-28`. The exact strings:

- `About.astro`: `class="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-28"` → `py-16 md:py-28`
- `Services.astro`: `class="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-28"` → `py-16 md:py-28`
- `Contact.astro`: `class="relative z-10 mx-auto max-w-5xl px-6 py-24 md:py-28"` → `py-16 md:py-28`

- [ ] **Step 2: Experience**

In `Experience.astro`, change `class="relative z-10 mx-auto max-w-5xl px-6 py-24 md:py-28"` → `py-16 md:py-28`.

- [ ] **Step 3: Skills (section element)**

In `Skills.astro`, the `<section>` class contains `py-24 ... md:py-28`. Change `py-24` → `py-16` (keep `md:py-28`). The class is:

```
class="relative overflow-hidden border-t-2 border-concrete-50 bg-concrete-950 py-24 text-concrete-50 md:py-28"
```

→ replace `py-24` with `py-16`.

- [ ] **Step 4: Projects (split padding)**

In `Projects.astro`:
- Heading container `class="relative z-10 mx-auto max-w-6xl px-6 pt-24 md:pt-28"` → `pt-16 md:pt-28`
- Track container `class="relative z-10 pb-24 md:pb-28" data-projects-viewport` → `pb-16 md:pb-28`

- [ ] **Step 5: Run the build gate**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 6: Run the type/check gate**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 7: Manual verification**

Run/refresh `npm run dev`.
Verify (SPEC AC6, AC8): at 320 / 360 / 390 / 430 px there is no horizontal scroll on any section and the page is visibly shorter (tighter top/bottom padding) than before; at ≥768px section spacing is unchanged.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/About.astro src/components/sections/Services.astro src/components/sections/Skills.astro src/components/sections/Experience.astro src/components/sections/Contact.astro src/components/sections/Projects.astro
git commit -m "style(ui): tighten section vertical rhythm on mobile"
```

---

### Task 6: Record the decision (ADR-0008, ADR-0007 update, README index)

**Files:**
- Create: `docs/adr/0008-adaptive-mobile-experience.md`
- Modify: `docs/adr/0007-client-side-geolocation-and-build-time-world-map.md` (append one consequence)
- Modify: `README.md` (add one Engineering Decisions row)

**Interfaces:**
- Consumes / Produces: documentation only. Mirrors the ADR style used by `0007`.

- [ ] **Step 1: Create ADR-0008**

Create `docs/adr/0008-adaptive-mobile-experience.md`:

```markdown
# Adaptive mobile experience (mobile-only chrome + divergent feature treatments)

Below the `md` breakpoint (768px) the landing page is adapted for a recruiter on a phone — who
arrives in the majority of first visits and decides in seconds — rather than stretching one layout
to every width. Mobile gains dedicated chrome (a fixed thumb-zone action bar: Email · Download CV ·
LinkedIn) and divergent treatments of hover/decorative features: the Skills marquee becomes a static
grouped, scannable list; the Contact-background map and its client-side IP lookup are suppressed; the
hero is compacted so identity and the strongest proof stat land in the first screen; and section
vertical rhythm is tightened. Desktop (`≥ 768px`) is unchanged. Tablets (768–1024px) follow the
desktop layout.

## Status

Accepted.

## Considered Options

- **Adaptive mobile (chosen)**: mobile-only components rendered below `md` (`md:hidden`) and
  desktop-only behavior kept at `md:`/`lg:`. Delivers the recruiter shortcuts (always-available
  contact/CV, scannable skills) with no desktop regression and no second information architecture to
  maintain. Trade-off: a few features render differently per breakpoint, which must be kept in sync.
- **One responsive layout stretched to all widths**: rejected — fixes overflow but never delivers the
  thumb-zone contact shortcut or a touch-usable Skills view; hover-only features stay dead on mobile.
- **A dedicated mobile information architecture (snapshot card + accordions)**: rejected — largest
  build and an ongoing dual-IA maintenance burden, and the unrequested-abstraction risk the standards
  warn against, for no additional reach over the adaptive approach.

## Consequences

- New `src/components/layout/MobileActionBar.astro` is rendered only on the landing page
  (`index.astro`) and is `md:hidden`; a mobile-only clearance spacer keeps it from occluding the
  footer, and it honors `env(safe-area-inset-bottom)`.
- Skills, Contact map, and Hero each carry breakpoint-divergent markup; a change to one must be
  checked at both `< md` and `≥ md`.
- All changes are server-rendered and degrade with no JS and under reduced motion; no new dependency.
- Verification remains presentation-only (ADR-0001): the mobile behavior is confirmed by the manual
  checklist at 320/360/390/430px plus the build, type-check, and Lighthouse budget.
```

- [ ] **Step 2: Append a consequence to ADR-0007**

In `docs/adr/0007-client-side-geolocation-and-build-time-world-map.md`, at the end of the `## Consequences` list, add this bullet:

```markdown
- The map and its client-side IP lookup are **desktop-only**: the layer is hidden below `md` (768px)
  and the `ipwho.is` request is skipped on mobile, so phones make no third-party geo call. See
  [ADR-0008](0008-adaptive-mobile-experience.md).
```

- [ ] **Step 3: Index ADR-0008 in the README**

In `README.md`, in the `## Engineering Decisions` table, add this row as the last row (after the ADR-0007 row):

```markdown
| Adaptive mobile experience: mobile-only sticky action bar + divergent feature treatments below `md` | One responsive layout stretched to all widths; a dedicated mobile information architecture | Recruiters mostly arrive on phones and decide in seconds, so mobile gets thumb-zone contact/CV, scannable static skills, a compacted hero, and a hidden decorative map — while desktop is untouched and there is no dual-IA to maintain. See [ADR-0008](docs/adr/0008-adaptive-mobile-experience.md). |
```

- [ ] **Step 4: Run the gates**

Run: `npm run build` then `npm run check`
Expected: build completes with no errors; check reports `0 errors`. (Docs-only changes; gates confirm nothing broke.)

- [ ] **Step 5: Commit**

```bash
git add docs/adr/0008-adaptive-mobile-experience.md docs/adr/0007-client-side-geolocation-and-build-time-world-map.md README.md
git commit -m "docs: record ADR-0008 for the adaptive mobile experience"
```

---

## Final verification (after all tasks)

- [ ] Run `npm run build` and `npm run check` once more — both clean.
- [ ] Full manual pass at 320 / 360 / 390 / 430 px against SPEC AC1–AC6 and AC9 (reduced-motion + JS-disabled), and a desktop pass at ≥768px for AC8 (pinned projects, marquee, map, hero spacing unchanged).
- [ ] Real iOS Safari device check for the action-bar safe-area inset (AC3).
- [ ] Run the Lighthouse mobile budget (per the project's existing CI budget).
