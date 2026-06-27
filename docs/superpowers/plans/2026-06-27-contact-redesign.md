# Contact Redesign (Concrete Terminal — Contact Terminal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Contact section — the last legacy-palette content section — to Concrete Terminal: brutalist chrome, a terminal-style form with visible mono labels and hard-bordered inputs, the brutalist green CTA, and the site-wide GSAP entrance — preserving the Web3Forms behavior and copy.

**Architecture:** `Contact.astro` is rewritten to the concrete chrome (`bg-concrete-950`, hard top border, grain), the `07 / CONTACT` label + display heading, a two-column layout (intro + email + social | form/fallback). The form keeps every Web3Forms `name` attribute, the hidden inputs, the honeypot, the `formEnabled` fallback, and the `aria-live` status, but swaps placeholder-as-label for visible mono `<label>`s and the legacy inputs for hard-bordered concrete inputs; the submit `<script>`'s three status `className` strings move to the concrete ramp. A second commit replaces the `[data-reveal]` hooks' motion with the `gsap.matchMedia` + ScrollTrigger entrance. Design language (ADR-0002), GSAP (ADR-0003), ScrollTrigger (ADR-0004) already recorded — no new ADR.

**Tech Stack:** Astro 6 (`output: 'static'`), Tailwind CSS v4 (PostCSS), TypeScript 6, GSAP 3 (core + `gsap/ScrollTrigger`, already installed).

## Global Constraints

Every task's requirements implicitly include this section. Values copied verbatim from `SPEC.md`.

- Static Astro only — no React, no new dependency.
- **Preserve the Web3Forms contract verbatim:** the input `name` attributes `name` / `email` / `message` / `access_key` / `subject` / `botcheck`; the two hidden inputs; the honeypot checkbox; the `fetch` to `https://api.web3forms.com/submit`; the `formEnabled` email-only fallback + its build-time `console.warn`; the `#form-status` `role="status" aria-live="polite"` region. Only styling, the `<label>` elements, and the three status `className` strings change.
- **Visible, bound labels:** every field has a visible mono `<label>` (NOT `sr-only`) whose `for` matches the input `id`. Placeholders are removed.
- Concrete ramp only in `#contact`: headings/primary = `text-concrete-50`; body/intro/meta/labels = `text-concrete-300`; signal = `text-accent`; CTA = `bg-accent` + `text-concrete-950` (dark-on-green) + `shadow-hard`. The error status `text-red-400` is the ONE allowed functional exception. NO legacy tokens (`border-border`, `bg-surface`, `text-ink`, `text-muted`, `placeholder:text-muted`, `.accent-rule`) and NO `[data-reveal]`.
- Do NOT touch `SocialLinks.astro` (Footer phase), `Nav.astro`, `Footer.astro`, `src/data/`, or `src/content/`. No copy change. No `global.css` / new-token change. Section index stays `07`.
- All output English. Conventional Commits per `.standards/docs/standards/github.md`; **no co-author / AI-attribution trailers.**
- **Verification model (ADR-0001):** no unit harness. "Verify" = `npm run check` (0 errors) + `npm run build` (exit 0) + invariant greps + a manual check.
- Lighthouse budget (`lighthouserc.json`): accessibility ≥0.95 (error), CLS ≤0.1 (error) preserved.

---

### Task 1: Rewrite `Contact.astro` to the Concrete Terminal contact terminal

Replace the legacy markup with the concrete chrome + terminal form (visible mono labels, hard-bordered inputs, brutalist CTA), drop `accent-rule`/legacy tokens, swap `[data-reveal]` → `data-contact-anim`, and update the submit script's status classes. Preserve all Web3Forms behavior.

**Files:**
- Modify (full rewrite): `src/components/sections/Contact.astro`

**Interfaces:**
- Consumes: `site` (`site.email`, `site.web3formsKey`) from `src/data/site.ts`; `SocialLinks`, `Icon` components; `--color-concrete-*` / `--color-accent` / `--text-label` tokens; `.bt-grain`; `shadow-hard`.
- Produces: DOM hooks `data-contact-anim` on the heading block, the left column, and the form/fallback (consumed by Task 2).

- [ ] **Step 1: Replace the entire contents of `src/components/sections/Contact.astro`**

```astro
---
import { site } from '../../data/site.ts';
import SocialLinks from '../ui/SocialLinks.astro';
import Icon from '../ui/Icon.astro';

// Brutalist Concrete Terminal field: hard concrete border, dark surface, green focus.
const inputClass =
  'w-full border-2 border-concrete-50 bg-concrete-900 px-4 py-3 font-sans text-sm text-concrete-50 focus:border-accent focus:outline-none';

// The form posts to Web3Forms with site.web3formsKey. When PUBLIC_WEB3FORMS_KEY
// is unset that key is empty, so rather than render a form that would fail on
// submit, fall back to an email-only CTA. Warn at build time so an unconfigured
// deploy is noticed.
const formEnabled = site.web3formsKey.trim().length > 0;
if (!formEnabled) {
  console.warn(
    '[contact] PUBLIC_WEB3FORMS_KEY is not set — rendering the email-only fallback instead of the contact form.',
  );
}
---

<section
  id="contact"
  class="relative overflow-hidden border-t-2 border-concrete-50 bg-concrete-950 text-concrete-50"
>
  <!-- Decorative analog grain (no semantics, not focusable). -->
  <div class="bt-grain" aria-hidden="true"></div>

  <div class="relative z-10 mx-auto max-w-5xl px-6 py-24 md:py-28">
    <div data-contact-anim class="mb-12 max-w-2xl">
      <p class="font-mono text-label uppercase tracking-[0.25em] text-concrete-300">
        <span class="text-accent">07 / CONTACT</span>
      </p>
      <h2
        class="mt-3 font-sans text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-concrete-50 md:text-6xl"
      >
        Let&apos;s talk
      </h2>
    </div>

    <div class="grid gap-12 md:grid-cols-2">
      <div data-contact-anim>
        <p class="max-w-md font-sans text-base leading-relaxed text-concrete-300 md:text-lg">
          I&apos;m looking for a full-time AI/ML Engineer role on a distributed,
          remote team building production systems at scale. If that&apos;s what
          you&apos;re hiring for, let&apos;s talk. Email is the fastest way to reach
          me, or use the form below, and I usually reply within a day.
        </p>
        <a
          href={`mailto:${site.email}`}
          class="mt-6 inline-flex items-center gap-2 font-mono text-sm text-concrete-50 transition-colors hover:text-accent"
        >
          <Icon name="mail" size={18} />
          {site.email}
        </a>
        <SocialLinks class="mt-6" />
      </div>

      {formEnabled ? (
      <form id="contact-form" data-contact-anim class="space-y-5">
        <input type="hidden" name="access_key" value={site.web3formsKey} />
        <input
          type="hidden"
          name="subject"
          value="New message from your portfolio"
        />
        <!-- Honeypot spam trap (must stay empty) -->
        <input
          type="checkbox"
          name="botcheck"
          class="hidden"
          style="display:none"
          tabindex="-1"
          autocomplete="off"
        />

        <div>
          <label
            for="name"
            class="mb-1.5 block font-mono text-xs uppercase tracking-[0.2em] text-concrete-300"
          >
            // Name
          </label>
          <input id="name" type="text" name="name" required class={inputClass} />
        </div>
        <div>
          <label
            for="email"
            class="mb-1.5 block font-mono text-xs uppercase tracking-[0.2em] text-concrete-300"
          >
            // Email
          </label>
          <input id="email" type="email" name="email" required class={inputClass} />
        </div>
        <div>
          <label
            for="message"
            class="mb-1.5 block font-mono text-xs uppercase tracking-[0.2em] text-concrete-300"
          >
            // Message
          </label>
          <textarea id="message" name="message" required rows="5" class={inputClass}></textarea>
        </div>

        <button
          type="submit"
          class="inline-flex w-full items-center justify-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-concrete-950 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Send message
          <Icon name="arrow-right" size={18} />
        </button>

        <p id="form-status" class="font-mono text-sm" role="status" aria-live="polite"></p>
      </form>
      ) : (
      <div data-contact-anim class="border-2 border-concrete-50 bg-concrete-900 p-6">
        <p class="font-sans text-base leading-relaxed text-concrete-300">
          The contact form is being set up. In the meantime the quickest way to
          reach me is by email, and I usually reply within a day.
        </p>
        <a
          href={`mailto:${site.email}`}
          class="mt-6 inline-flex items-center justify-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-concrete-950 shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          <Icon name="mail" size={18} />
          Email me
        </a>
      </div>
      )}
    </div>
  </div>
</section>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      const data = new FormData(form);

      status.textContent = 'Sending…';
      status.className = 'font-mono text-sm text-concrete-300';
      if (button) button.disabled = true;

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });
        const result = await response.json();

        if (result.success) {
          status.textContent = 'Thanks! Your message has been sent.';
          status.className = 'font-mono text-sm text-accent';
          form.reset();
        } else {
          status.textContent =
            result.message || 'Something went wrong. Please email me directly.';
          status.className = 'font-mono text-sm text-red-400';
        }
      } catch {
        status.textContent =
          'Network error. Please email me directly instead.';
        status.className = 'font-mono text-sm text-red-400';
      } finally {
        if (button) button.disabled = false;
      }
    });
  }
</script>
```

- [ ] **Step 2: Verify no legacy palette / no data-reveal; ramp + labels + form contract present**

Run: `grep -Ec "border-border|bg-surface|text-ink|text-muted|placeholder:text-muted|accent-rule|data-reveal" src/components/sections/Contact.astro` → Expected: `0`.
Run: `grep -c "data-contact-anim" src/components/sections/Contact.astro` → Expected: `3` (heading block + left column + form; the fallback `<div>` also carries it but only one branch renders).
Run (visible bound labels, not sr-only): `grep -Ec 'for="name"|for="email"|for="message"' src/components/sections/Contact.astro` → Expected: `3`. Run: `grep -c "sr-only" src/components/sections/Contact.astro` → Expected: `0`.
Run (Web3Forms contract intact): `grep -Ec 'name="name"|name="email"|name="message"|name="access_key"|name="subject"|name="botcheck"' src/components/sections/Contact.astro` → Expected: `6`. Run: `grep -c "api.web3forms.com/submit" src/components/sections/Contact.astro` → Expected: `1`.
Run (CTA dark-on-green): `grep -c "bg-accent" src/components/sections/Contact.astro` → Expected: `>= 1`; `grep -c "text-concrete-950" src/components/sections/Contact.astro` → Expected: `>= 1`.

- [ ] **Step 3: Verify the gates**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0.

- [ ] **Step 4: Manual visual check**

`npm run preview`; scroll to Contact. Confirm: concrete-black section, hard top rule, green `07 / CONTACT`, display heading "Let's talk", intro in warm `concrete-300`; the form shows visible mono `// NAME` / `// EMAIL` / `// MESSAGE` labels above hard-bordered inputs that turn green on focus; the "Send message" button is the brutalist dark-on-green CTA with the hard shadow. (If `PUBLIC_WEB3FORMS_KEY` is unset, the email-only fallback card shows instead — also concrete-styled.)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Contact.astro
git commit -m "feat(ui): rebuild Contact as a Concrete Terminal contact terminal"
```

---

### Task 2: Add the fail-safe GSAP ScrollTrigger entrance to Contact

Animate the `data-contact-anim` elements in on scroll, gated by `gsap.matchMedia()`, hiding via `gsap.from(..., {immediateRender:false})` so a never-firing trigger / reduced-motion / no-JS leave content visible. Mirrors the shipped Services/Experience module.

**Files:**
- Modify: `src/components/sections/Contact.astro` (append a second bundled module `<script>` at the end of the file, after the existing submit `<script>`)

**Interfaces:**
- Consumes: the `data-contact-anim` hooks from Task 1 and the `gsap` package (with `gsap/ScrollTrigger`).
- Produces: runtime behavior only.

- [ ] **Step 1: Append the ScrollTrigger module at the end of `Contact.astro`**

Add to the very bottom of `src/components/sections/Contact.astro` (after the closing `</script>` of the submit handler):

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Motion allowed: each entrance target animates in as it scrolls into view.
  // immediateRender:false means the hidden (opacity:0) state is applied ONLY when
  // the trigger fires — so if ScrollTrigger never fires (or errors), the content
  // stays at its natural, visible state. Reduced motion / no-JS never touch it.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = gsap.utils.toArray<Element>('#contact [data-contact-anim]');

    const tweens = targets.map((el) =>
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }),
    );

    return () => {
      tweens.forEach((tween) => {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
      });
      gsap.set(targets, { clearProps: 'all' });
    };
  });
</script>
```

- [ ] **Step 2: Verify the gates (ScrollTrigger resolves and both scripts bundle)**

Run: `npm run check` → Expected: `0 errors`.
Run: `npm run build` → Expected: exit 0, no "failed to resolve import 'gsap/ScrollTrigger'".
Run: `grep -c "Contact.astro_astro_type_script" dist/index.html` → Expected: `2` (the submit handler + the entrance module both bundled).

- [ ] **Step 3: Manual behavior check**

`npm run preview`.
- Normal: scrolling Contact into view fades/slides the heading, the left column, then the form in; no layout jump; the form still submits (sending → success/error status in concrete colors).
- Reduced motion: emulate `prefers-reduced-motion: reduce`, reload, scroll → no animation; the full section is visible and the form works.
- (If a browser is unavailable, say so and confirm from `dist/index.html` that both modules bundled and the `#contact [data-contact-anim]` hooks are present.)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Contact.astro
git commit -m "feat(ui): add GSAP ScrollTrigger entrance to Contact"
```

---

### Task 3: Acceptance verification sweep

Confirm every SPEC acceptance criterion. No code; produces PR evidence. (If a criterion fails, return to the owning task.)

**Files:** none (verification only).

- [ ] **Step 1: `build_succeeds` + `typecheck_clean`**

Run: `npm run check` → Expected: `0 errors`. Run: `npm run build` → Expected: exit 0.

- [ ] **Step 2: `contact_no_legacy`**

Run: `grep -Ec "border-border|bg-surface|text-ink|text-muted|placeholder:text-muted|accent-rule|data-reveal" src/components/sections/Contact.astro` → Expected: `0`.
Run (green present, red only for error): `grep -c "text-red-400" src/components/sections/Contact.astro` → Expected: `2` (else/catch status only).

- [ ] **Step 3: `labels_visible_and_bound`**

Run: `grep -Ec 'for="name"|for="email"|for="message"' src/components/sections/Contact.astro` → Expected: `3`.
Run: `grep -c "sr-only" src/components/sections/Contact.astro` → Expected: `0`.
Confirm each `<label for="X">` has a matching `<input id="X">` / `<textarea id="X">` (name, email, message).

- [ ] **Step 4: `form_behavior_preserved`**

Run: `grep -Ec 'name="name"|name="email"|name="message"|name="access_key"|name="subject"|name="botcheck"' src/components/sections/Contact.astro` → Expected: `6`.
Run: `grep -c "api.web3forms.com/submit" src/components/sections/Contact.astro` → Expected: `1`.
Run: `grep -c 'aria-live="polite"' src/components/sections/Contact.astro` → Expected: `1`.
Run: `grep -c "formEnabled" src/components/sections/Contact.astro` → Expected: `>= 2` (the const + the conditional).

- [ ] **Step 5: `motion_failsafe_and_gated` + `texture_decorative`**

Run: `grep -c "Contact.astro_astro_type_script" dist/index.html` → Expected: `2`.
Run: `grep -roh "data-contact-anim]{opacity:0}" dist/_astro/*.css | wc -l` → Expected: `0` (no CSS pre-hide; content visible without JS).
Run: `grep -c 'class="bt-grain" aria-hidden="true"' src/components/sections/Contact.astro` → Expected: `1`.

- [ ] **Step 6: `sociallinks_untouched` + `content_unchanged`**

Run: `git diff --name-only $(git merge-base main HEAD) HEAD -- src/components/ui/SocialLinks.astro src/data src/content` → Expected: empty (none changed in THIS phase).

- [ ] **Step 7: `lighthouse_budget_met` (CI)**

Run Lighthouse via CI (or `npx lhci autorun` if available) against `lighthouserc.json`. Record outputs for the PR Evidence; note the R2 (pre-push Codex) status.

---

## Self-Review (against SPEC.md)

**Spec coverage:**
- `build_succeeds`/`typecheck_clean` → Task 1 Step 3, Task 2 Step 2, Task 3 Step 1.
- `contact_no_legacy` → Task 1 (rewrite drops legacy + accent-rule + data-reveal) + Task 1 Step 2 + Task 3 Step 2.
- `labels_visible_and_bound` → Task 1 (visible mono `<label for>` per field, no sr-only) + Task 3 Step 3.
- `form_behavior_preserved` → Task 1 (verbatim names/hidden inputs/honeypot/fetch/fallback/aria-live; only classes + labels change) + Task 3 Step 4.
- `motion_failsafe_and_gated` → Task 2 (matchMedia gate, immediateRender:false, cleanup) + Task 3 Step 5.
- `cta_contrast` → Task 1 (`bg-accent` + `text-concrete-950` brutalist CTA; `focus:border-accent` on inputs) + Task 1 Step 4 manual.
- `content_unchanged` / `sociallinks_untouched` → Global Constraint + Task 3 Step 6.
- `texture_decorative` → Task 1 (`.bt-grain` aria-hidden) + Task 3 Step 5.
- `lighthouse_budget_met` → Task 3 Step 7.
- Scope "Does NOT include" (SocialLinks/Nav/Footer, content/site.ts, Web3Forms logic, global.css/new token, index label) → respected across tasks.

**Placeholder scan:** no TBD/TODO; every code step contains the complete file/module.

**Type/name consistency:** `data-contact-anim`, `#contact`, the field `id`/`name` pairs (`name`/`email`/`message`), `inputClass`, `formEnabled`, and the three status `className` strings (`font-mono text-sm text-{concrete-300|accent|red-400}`) are used identically across Tasks 1–2; the GSAP module mirrors the shipped Services/Experience entrance (selector `#contact`, hook `data-contact-anim`).
