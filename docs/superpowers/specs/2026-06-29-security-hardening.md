# SPEC: chore(security): defensive hardening (headers, CSP, deps, form, CI)

## Problem

The static portfolio ships no security response headers (no CSP, no anti-clickjacking, no permissions policy), the contact form's public key can be abused to exhaust its free quota, the repo has 6 open Dependabot alerts, and there is no machine-readable security contact, leaving avoidable hardening gaps even though the static/CDN architecture is itself resilient.

## Design Decision

Harden defensively without changing the site's behavior or look. Add a `vercel.json` with anti-clickjacking, referrer, and permissions headers plus a Content-Security-Policy in Report-Only mode (observe before enforcing, because Astro emits inline scripts). Protect the contact form with a Web3Forms domain allowlist (operator step) plus the existing honeypot plus an env-gated hCaptcha widget that degrades to the current form when unconfigured. Apply safe (non-major) `npm audit` fixes and report the rest. Add `/.well-known/security.txt`, pin GitHub Actions to commit SHAs, and escape `<` in the inline JSON-LD as defense in depth. Recorded in ADR-0010.

## Alternatives Considered

- **Enforce CSP immediately (hashes for inline scripts)**: rejected for this pass. Risk of breaking the page if a hash is missed; Report-Only observes real violations with zero breakage, then a later pass enforces.
- **No captcha (honeypot + allowlist only)**: rejected. The author chose defense in depth; the hCaptcha is env-gated so it never breaks the form when unconfigured.
- **`npm audit fix --force` (major bumps now)**: rejected for this pass. Major bumps risk build/runtime regressions; safe fixes now, majors triaged separately.
- **Rely on Vercel defaults, skip headers**: rejected. Vercel does not set CSP, `X-Frame-Options`, or `Permissions-Policy` by default; these are cheap, real gains.

## Scope

- **Includes:**
  - `vercel.json` (new): response headers for all routes:
    `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin`,
    `Permissions-Policy: geolocation=(), camera=(), microphone=()`, and a
    `Content-Security-Policy-Report-Only` whose `connect-src` includes
    `https://api.web3forms.com` and `https://ipwho.is`, and whose script/style/frame
    sources include the hCaptcha origins (`https://hcaptcha.com`, `https://*.hcaptcha.com`)
    and the Vercel analytics origins (`https://va.vercel-scripts.com`,
    `https://*.vercel-insights.com`). No enforcing `Content-Security-Policy` header.
  - Contact form (`src/components/sections/Contact.astro`): an env-gated hCaptcha widget
    following Web3Forms' current documented integration, keyed by a new
    `PUBLIC_HCAPTCHA_SITEKEY`. When that env var is unset, the form renders exactly as
    today (no widget, still submits, honeypot retained). `.env.example` documents the var.
  - Dependencies: apply the `npm audit fix` changes that do NOT bump a major version;
    commit the updated `package.json` / `package-lock.json`; report the remaining alerts
    with their advisory IDs.
  - `public/.well-known/security.txt` (new): `Contact`, `Expires`, `Preferred-Languages`,
    `Canonical`.
  - GitHub Actions: pin every `uses:` in `.github/workflows/ci.yml` and
    `.github/workflows/verify-deploy.yml` to a 40-char commit SHA, each with a trailing
    `# vX.Y.Z` comment.
  - `src/layouts/Layout.astro`: escape `<` in the inline JSON-LD `set:html` (so a `</script>`
    in data can never break out), as defense in depth.
  - `docs/adr/0010-security-hardening.md` + a README Engineering-Decisions row + a short
    README "Security" note (headers, report-only CSP, form protections, security.txt).
- **Does NOT include:**
  - Enforcing (blocking) CSP. Report-Only only in this pass.
  - Major dependency upgrades or framework bumps.
  - Any change to the site's content, layout, design, or runtime behavior. With no
    `PUBLIC_HCAPTCHA_SITEKEY`, the form is functionally identical to today.
  - Server-side validation or moving off `output: 'static'`.
  - The operator actions: the Web3Forms dashboard allowlist + hCaptcha enablement, and
    merging the Dependabot PRs. These are documented for the user, not done here.
  - The blog and mobile branches (separate work).

## Acceptance Criteria

1. `headers_present`: `vercel.json` configures `X-Frame-Options: DENY`,
   `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy` for the
   site's routes (verified by config + a preview `curl -I`).
2. `csp_report_only`: a `Content-Security-Policy-Report-Only` header is configured (and NO
   enforcing `Content-Security-Policy`); its `connect-src` includes `https://api.web3forms.com`
   and `https://ipwho.is`, and its script/frame sources include the hCaptcha and
   Vercel-analytics origins.
3. `form_unchanged_without_sitekey`: with `PUBLIC_HCAPTCHA_SITEKEY` unset, the rendered
   Contact form is functionally identical to the pre-change form (same Web3Forms submit,
   honeypot present, no captcha gate); with it set, the hCaptcha widget renders inside the form.
4. `deps_safe_fixed`: after the safe `npm audit fix`, `npm audit` reports fewer
   vulnerabilities than before for everything fixable without a major bump; `npm run build`
   and `npm run check` still pass; remaining alerts are listed with advisory IDs.
5. `security_txt_served`: `public/.well-known/security.txt` exists with `Contact:` and
   `Expires:` and appears in the build output at `dist/.well-known/security.txt`.
6. `actions_pinned`: every `uses:` in `ci.yml` and `verify-deploy.yml` references a 40-char
   commit SHA with a trailing version comment; both workflows remain valid YAML.
7. `jsonld_escaped`: the inline JSON-LD in `Layout.astro` escapes `<` (no raw `</` from data),
   and the emitted `<script type="application/ld+json">` still contains valid JSON.
8. `gates_pass`: `npm run build` and `npm run check` complete with no new errors/warnings
   beyond baseline; the built HTML renders the same visible content as before.
9. `decision_recorded`: `docs/adr/0010-security-hardening.md` exists; the README links it and
   documents the headers, the report-only CSP, the form protections, and security.txt.

## Reproducibility

- Versions: Astro `^6.3.7`, Node 22 (CI), npm per the lockfile.
- `npm install`; `npm audit` (capture before/after counts); `npm run build`; `npm run check`.
- Headers/CSP: `vercel.json` is the source of truth; presence is confirmed on a Vercel preview
  deploy via `curl -I <preview-url>` (edge-applied, so not visible to the static build alone,
  per ADR-0001's deferred-runtime pattern).
- security.txt: confirm `dist/.well-known/security.txt` after `npm run build`.

## Risks and Assumptions

- Assumption: CSP Report-Only blocks nothing by definition; enforcing is a later, separate
  pass after observing reports. Invalidated if the user wants enforcing now.
- Assumption: Web3Forms' hCaptcha integration markup matches their current docs; the
  implementer verifies against the live docs (does not invent) and gates it on
  `PUBLIC_HCAPTCHA_SITEKEY`, so an unconfigured deploy is unaffected.
- Risk: pinning Actions to SHAs can drift from upstream patches; mitigation: keep the `# vX.Y.Z`
  comment so Dependabot can bump the pinned SHA.
- Risk: `npm audit fix` may move transitive versions; mitigation: run `npm run build` +
  `npm run check` after and accept only non-major changes.
- Risk: headers are edge-applied and not in the static build; AC1/AC2 presence is confirmed on
  a preview deploy, consistent with ADR-0001's deferred-runtime verification.
- Assumption: presentation-only verification (ADR-0001) holds; no unit harness is added.
