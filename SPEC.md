# SPEC: feat(ui): redesign Contact as a Concrete Terminal contact terminal

## Problem

Contact (`src/components/sections/Contact.astro`) is the last content section still on the
legacy "dark tech" palette. It uses `border-border`, `bg-surface`, `text-ink`, `text-muted`,
`placeholder:text-muted`, the `.accent-rule` underline, and the legacy `[data-reveal]`
IntersectionObserver entrance — while every other content section (Hero…Experience) is in the
Concrete Terminal language with the GSAP `matchMedia` + ScrollTrigger entrance. The contact
form (a functional Web3Forms form with an email-only fallback) also relies on
placeholder-as-label (`sr-only` labels + placeholders), an accessibility anti-pattern: the
placeholder disappears on input, leaving the field unlabeled.

## Design Decision

Rebuild Contact as a **Concrete Terminal "contact terminal"**, preserving all behavior
(Web3Forms submit, the `formEnabled` email-only fallback, the honeypot, the status
`aria-live` region) and the copy.

- **Section chrome** matches the other sections: `relative overflow-hidden border-t-2
  border-concrete-50 bg-concrete-950 text-concrete-50`, a decorative `.bt-grain` overlay
  (`aria-hidden`), the `07 / CONTACT` green mono uppercase label, the brutalist display
  heading ("Let's talk", font-black uppercase, `concrete-50`), and intro copy in
  `concrete-300`. The `.accent-rule` underline is dropped.
- **Two-column layout kept** (left: intro + email link + social; right: the form / fallback),
  restyled onto the concrete ramp.
- **Form = terminal form.** The placeholder-as-label pattern is replaced with **visible mono
  field labels** (`// NAME`, `// EMAIL`, `// MESSAGE`) tied to each input via `for`/`id` (an
  accessibility win and the on-brand declassified-form look). Inputs are hard-bordered
  (visible concrete border, no rounded corners), `bg-concrete-900`, `text-concrete-50`, with
  `focus:border-accent` (green). The submit button keeps its dark-on-green treatment
  (`bg-accent text-canvas`) restyled to match the site's brutalist CTA (hard edges; no
  `rounded-lg`). The status line (`#form-status`, `aria-live="polite"`) is kept; its JS-set
  classes move to the concrete ramp: sending → `text-concrete-300`, success → `text-accent`,
  error → a functional red (`text-red-400`, the one semantic exception to the monochrome+green
  rule).
- **Motion** migrates from `[data-reveal]` to a `gsap.matchMedia('(prefers-reduced-motion:
  no-preference)')` + ScrollTrigger entrance on `data-contact-anim` targets, modeled on the
  shipped Services/Experience module (`immediateRender:false` fail-safe; reduced-motion / no-JS
  show the final content; cleanup reverts).
- The submit `<script>` (Web3Forms `fetch`) is preserved; only the three status `className`
  strings change to the concrete ramp. Static Astro, no React. Section index stays `07`.

`SocialLinks.astro` is **rendered but not migrated** in this phase (it is shared with the
Footer and migrates with the Footer phase) — a small, accepted temporary mismatch.

## Alternatives Considered

- **Keep placeholders + `sr-only` labels (just restyle)** — rejected: the visible mono labels
  are both more accessible (persistent label) and more on-brand (terminal form); the user
  chose them.
- **Drop the form, email-only CTA** — rejected: the working contact form is valuable on a
  job-seeking portfolio; the user chose to keep it.
- **Migrate `SocialLinks` now** — rejected for this phase: it is shared with the Footer and
  belongs to the Footer phase; migrating it here would touch a component this phase does not
  own.
- **Keep the `[data-reveal]` IntersectionObserver reveal** — rejected for consistency with the
  site-wide GSAP entrance.
- **Introduce a red error token / restyle the error state monochrome** — rejected: a
  conventional functional red for the error status is the clearest, accessible exception; no
  new token is warranted.

## Scope

- Includes:
  - Rewrite `src/components/sections/Contact.astro`:
    - Section chrome (concrete-950 bg, `border-t-2 border-concrete-50`, `.bt-grain`
      `aria-hidden`), `07 / CONTACT` green mono label, display heading, `concrete-300` intro,
      drop `.accent-rule`.
    - Left column: intro (`concrete-300`), the `mailto` email link (restyled to the concrete
      ramp, green hover), and `<SocialLinks>` (unchanged component).
    - Right column: the form (when `formEnabled`) or the email-only fallback (restyled,
      hard-bordered concrete card). Replace `inputClass` with brutalist input styling (hard
      concrete border, `bg-concrete-900`, `text-concrete-50`, `focus:border-accent`, no
      rounded). Add a **visible mono `<label>`** per field (`// NAME` / `// EMAIL` /
      `// MESSAGE`) bound by `for`/`id`; remove the `sr-only` on those labels. Keep the hidden
      `access_key`/`subject` inputs and the honeypot.
    - Restyle the submit button to the brutalist CTA (keep `bg-accent text-canvas`, drop
      `rounded-lg`, hard edges) and preserve `disabled` handling.
    - Replace the three `[data-reveal]` hooks with `data-contact-anim`; append the GSAP
      `matchMedia` + ScrollTrigger entrance `<script>` (mirrors Services/Experience).
    - Update the submit `<script>`'s three status `className` strings to the concrete ramp
      (`text-concrete-300` / `text-accent` / `text-red-400`); the fetch/Web3Forms logic is
      otherwise unchanged.
- Does NOT include:
  - Migrating `SocialLinks.astro` (Footer phase), `Nav.astro`, or `Footer.astro`.
  - Any change to `src/data/site.ts` or any copy (the intro, heading "Let's talk", field
    names, and form behavior are preserved).
  - The Web3Forms integration logic, the `formEnabled` fallback behavior, or the honeypot.
  - Changing the section-index label (Contact is already `07`).
  - Any new global token or `global.css` change (the form uses existing concrete/accent
    tokens and Tailwind `focus:` utilities).
  - A new ADR — this reuses ADR-0002 (language), ADR-0003 (GSAP), ADR-0004 (ScrollTrigger).

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit
harness, per `docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `contact_no_legacy`: the rendered `#contact` references none of the legacy-palette utilities
  (`border-border`, `bg-surface`, `text-ink`, `text-muted`, `placeholder:text-muted`,
  `accent-rule`) and no `[data-reveal]`; its text uses the concrete ramp + `text-accent`
  (the error status's `text-red-400` is the single allowed functional exception).
- `labels_visible_and_bound`: each form field has a **visible** `<label>` (mono, not
  `sr-only`) whose `for` matches the input `id` (`name`/`email`/`message`); placeholders are
  no longer the only label.
- `form_behavior_preserved`: the hidden `access_key`/`subject` inputs, the honeypot checkbox,
  the submit `fetch` to `https://api.web3forms.com/submit`, the `formEnabled` email-only
  fallback, and the `#form-status` `aria-live="polite"` region are all intact; submitting
  still sets sending/success/error states (now in concrete-ramp colors).
- `motion_failsafe_and_gated`: the entrance runs only under `(prefers-reduced-motion:
  no-preference)` via `gsap.matchMedia`; under reduced-motion or no-JS the full section is
  visible; cleanup reverts. No `[data-reveal]` remains in `#contact`.
- `cta_contrast`: the submit and fallback CTAs keep dark-on-green text (`text-concrete-950` on
  `bg-accent`, matching the Hero CTA); the email link and form controls are keyboard-focusable
  with a visible focus state.
- `content_unchanged`: `git diff` shows no change to `src/data/` or `src/content/`; the
  Contact copy and field names are unchanged.
- `sociallinks_untouched`: `SocialLinks.astro` is unchanged (rendered as-is).
- `texture_decorative`: the `.bt-grain` overlay is `aria-hidden`, not focusable, no text.
- `lighthouse_budget_met`: the Lighthouse CI budget (`lighthouserc.json`) still passes
  (accessibility ≥0.95, CLS ≤0.1).

## Reproducibility

- Install: `npm install` (`gsap` + ScrollTrigger already present). Build: `npm run build`;
  type-check: `npm run check`.
- Form path: with `PUBLIC_WEB3FORMS_KEY` set, the form renders; unset → the email-only
  fallback renders (build-time warning). Both restyled.
- Motion: emulate `prefers-reduced-motion: reduce` / disable JS → the full section shows, no
  entrance; with motion → the staggered entrance.
- A11y spot-check: each input has a visible bound label; tab order reaches labels-as-text,
  inputs, the submit button, the email link, and social links.
- Versions: Astro `^6.3.7`, Tailwind v4, TypeScript `^6.0.3`, GSAP `^3.x`, Node 22 in CI.

## Risks and Assumptions

- Assumption: static Astro, no React; Web3Forms key via `site.web3formsKey` as today; the
  `--color-base`→`--color-canvas` fix is in place so `text-canvas` CTAs render dark-on-green.
- Risk: rewriting the form markup could break the Web3Forms field contract. Mitigation: keep
  the exact `name` attributes (`name`/`email`/`message`/`access_key`/`subject`/`botcheck`) and
  the hidden inputs/honeypot verbatim; only styling and the label elements change.
- Risk: a GSAP entrance can leave content hidden if ScrollTrigger never fires. Mitigation:
  `immediateRender:false` + `matchMedia` gating — the proven pattern shipped in
  Services/Experience.
- Risk: hard-bordered inputs could read faint on the dark bg (the recurring visibility theme).
  Mitigation: use a clearly visible concrete border on `bg-concrete-900` with a green focus
  state; verify at desktop width.
- Invalidation: introducing React, changing the Web3Forms contract, or migrating
  `SocialLinks`/`Nav`/`Footer` here invalidates this spec.
