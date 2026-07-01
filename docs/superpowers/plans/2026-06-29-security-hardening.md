# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add defensive security hardening (response headers + report-only CSP, an env-gated contact-form captcha, safe dependency fixes, security.txt, SHA-pinned Actions, and a JSON-LD escape) without changing the site's content, look, or runtime behavior.

**Architecture:** Static Astro on Vercel. Headers come from a root `vercel.json` (edge-applied). The captcha is gated by a public env var so an unconfigured deploy is byte-identical to today. Each item is independent and ships as its own commit. Decision recorded in ADR-0010.

**Tech Stack:** Vercel `vercel.json` headers, Astro 6 static, Web3Forms + hCaptcha, GitHub Actions, npm audit.

## Global Constraints

- No change to the site's content, layout, design, or runtime behavior. With `PUBLIC_HCAPTCHA_SITEKEY` unset, the contact form is functionally identical to today. (SPEC: Does NOT include, AC3, AC8)
- CSP is **Report-Only** in this pass; there must be NO enforcing `Content-Security-Policy` header. (SPEC: Design Decision, AC2)
- Dependency fixes are **non-major only** (no `npm audit fix --force`); report what still needs a major bump. (SPEC: Scope, AC4)
- Do NOT invent values you must look up: verify the Web3Forms hCaptcha integration against its live docs (Task 2), and resolve real 40-char commit SHAs for the Actions (Task 5). (SPEC: Risks)
- Presentation-only verification (ADR-0001): NO unit-test harness — do not add one. Gates per task: `npm run build` (exit 0) + `npm run check` (0 errors; informational zod hints are expected) + the listed config/`dist` checks. Header/CSP presence is confirmed on a Vercel **preview deploy** (edge-applied), not the static build. (SPEC: Reproducibility)
- Conventional Commits; no co-author / AI-attribution trailers. One commit per task.
- Operator-only (NOT in scope, documented for the user): Web3Forms domain allowlist + hCaptcha enablement, and merging Dependabot PRs.

---

### Task 1: Security headers + report-only CSP (`vercel.json`)

**Files:**
- Create: `vercel.json`

**Interfaces:**
- Produces: edge response headers for all routes. No code dependency for later tasks.

- [ ] **Step 1: Create `vercel.json`**

Create `vercel.json` at the repo root with exactly this content (headers only, so it does not alter Astro's static build/detection):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), camera=(), microphone=()" },
        { "key": "Content-Security-Policy-Report-Only", "value": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://js.hcaptcha.com https://*.hcaptcha.com https://va.vercel-scripts.com; connect-src 'self' https://api.web3forms.com https://ipwho.is https://*.vercel-insights.com; frame-src https://hcaptcha.com https://*.hcaptcha.com; form-action 'self' https://api.web3forms.com" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Validate JSON + run gates**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('vercel.json OK')"`
Expected: `vercel.json OK`

Run: `npm run build` then `npm run check`
Expected: build completes with no errors; check `0 errors` (the file does not affect the build).

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "chore(security): add response headers and a report-only CSP"
```

> Header presence (AC1/AC2) is edge-applied and confirmed later via `curl -I` on a Vercel preview deploy; it is not visible to the static build.

---

### Task 2: Env-gated hCaptcha on the contact form

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/components/sections/Contact.astro`
- Modify: `.env.example`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `site.hcaptchaSitekey: string` (empty when unconfigured); the form renders an hCaptcha widget only when it is non-empty.

- [ ] **Step 1: Verify the Web3Forms hCaptcha integration (do not invent)**

Read the current Web3Forms hCaptcha docs before writing markup: fetch `https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha` (or the hCaptcha section of `https://docs.web3forms.com`). Confirm the exact widget markup and script URL Web3Forms expects. The steps below use the standard hCaptcha integration (own sitekey + `https://js.hcaptcha.com/1/api.js`); if the docs require a different attribute (e.g. `data-captcha="true"` with Web3Forms' own `script.js`), follow the docs and adjust the markup accordingly, keeping the env-gating and the unconfigured-passthrough behavior identical.

- [ ] **Step 2: Add the sitekey to the central config**

In `src/data/site.ts`, in the `// --- Integrations ---` block (right after the `web3formsKey` field), add:

```ts
  // hCaptcha sitekey for the contact form (optional). When empty the form shows no
  // captcha and behaves exactly as before; set PUBLIC_HCAPTCHA_SITEKEY (and enable
  // hCaptcha in the Web3Forms dashboard) to turn it on. Public by design.
  hcaptchaSitekey: import.meta.env.PUBLIC_HCAPTCHA_SITEKEY ?? '',
```

- [ ] **Step 3: Render the widget only when configured**

In `src/components/sections/Contact.astro`, in the frontmatter (after the `formEnabled` block), add:

```ts
// hCaptcha is optional: render the widget only when a sitekey is configured, so an
// unconfigured deploy renders the exact same form as before.
const captchaEnabled = site.hcaptchaSitekey.trim().length > 0;
```

Inside the `<form id="contact-form" ...>`, immediately BEFORE the submit `<button type="submit" ...>`, add:

```astro
        {captchaEnabled && (
          <div class="h-captcha" data-sitekey={site.hcaptchaSitekey}></div>
        )}
```

And at the very end of the component file (after the existing `<script>` blocks), add the loader, rendered only when enabled:

```astro
{captchaEnabled && <script src="https://js.hcaptcha.com/1/api.js" async defer is:inline></script>}
```

Do not change the existing submit handler: `new FormData(form)` already includes the `h-captcha-response` field the widget injects, and Web3Forms validates it server-side when hCaptcha is enabled on their side.

- [ ] **Step 4: Document the env var**

In `.env.example`, append:

```
# hCaptcha sitekey (optional). When set, the contact form shows an hCaptcha widget;
# also enable hCaptcha in your Web3Forms dashboard. Leave blank to disable.
PUBLIC_HCAPTCHA_SITEKEY=
```

- [ ] **Step 5: Run gates + confirm passthrough**

Run: `npm run build` then `npm run check`
Expected: build completes (no `PUBLIC_HCAPTCHA_SITEKEY` set in the build env, so `captchaEnabled` is false); check `0 errors`.
Then confirm the unconfigured form is unchanged: `dist/index.html` contains the contact form and does NOT contain `h-captcha` or `js.hcaptcha.com` (because the sitekey is empty at build time).

- [ ] **Step 6: Commit**

```bash
git add src/data/site.ts src/components/sections/Contact.astro .env.example
git commit -m "feat(contact): add an optional, env-gated hCaptcha to the form"
```

---

### Task 3: Safe dependency fixes (non-major)

**Files:**
- Modify: `package.json`, `package-lock.json` (only if `npm audit fix` changes them)

**Interfaces:** none.

- [ ] **Step 1: Record the before state**

Run: `npm audit`
Capture the summary line (e.g. "N vulnerabilities (… high, … moderate, …)") and the listed advisories. This is the "before" for the report.

- [ ] **Step 2: Apply safe fixes only**

Run: `npm audit fix`  (NOT `--force` — this never bumps a major version)
This may update `package.json` / `package-lock.json`, or may change nothing if every remaining fix needs a major.

- [ ] **Step 3: Verify the build still works**

Run: `npm run build` then `npm run check`
Expected: both pass with no new errors/warnings. If `npm audit fix` introduced a regression, revert it (`git checkout -- package.json package-lock.json`) and report that the safe set was not applicable.

- [ ] **Step 4: Record the after state**

Run: `npm audit`
Capture the new summary. The report (in the task report file) must list: before counts, after counts, and each remaining advisory with its ID and why it is unfixed (needs a major bump / no patch yet).

- [ ] **Step 5: Commit (only if files changed)**

If `git status` shows `package.json` / `package-lock.json` changed:

```bash
git add package.json package-lock.json
git commit -m "build(deps): apply safe (non-major) npm audit fixes"
```

If nothing changed, make NO commit; the deliverable is the audit report listing what remains for the Dependabot/major-bump pass.

---

### Task 4: security.txt

**Files:**
- Create: `public/.well-known/security.txt`

**Interfaces:** none.

- [ ] **Step 1: Create the file**

Create `public/.well-known/security.txt` (RFC 9116) with exactly:

```
Contact: mailto:lucassg2015@gmail.com
Expires: 2027-06-29T00:00:00.000Z
Preferred-Languages: en, pt-BR
Canonical: https://lukesz-portifolio.vercel.app/.well-known/security.txt
```

- [ ] **Step 2: Run gates + confirm it ships**

Run: `npm run build`
Expected: completes; `public/` is copied to `dist/`.
Confirm `dist/.well-known/security.txt` exists and contains `Contact: mailto:lucassg2015@gmail.com` and an `Expires:` line.

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add public/.well-known/security.txt
git commit -m "chore(security): add a security.txt with a vulnerability contact"
```

---

### Task 5: Pin GitHub Actions to commit SHAs

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/verify-deploy.yml`

**Interfaces:** none.

- [ ] **Step 1: Resolve the real SHAs (do not invent)**

For each action + version currently used, resolve the tag to its 40-char commit SHA via the GitHub API (gh is authenticated in this environment):

```bash
gh api repos/actions/checkout/commits/v4 --jq .sha
gh api repos/actions/setup-node/commits/v4 --jq .sha
gh api repos/treosh/lighthouse-ci-action/commits/v12 --jq .sha
```

Record each returned SHA. (If `gh` is unavailable, use `git ls-remote https://github.com/<owner>/<repo> v4` and take the dereferenced `^{}` SHA.)

- [ ] **Step 2: Pin each `uses:`**

In `.github/workflows/ci.yml`, replace each unpinned `uses:` with `uses: <owner>/<repo>@<sha> # vX`, keeping the version as a trailing comment. There are four uses in `ci.yml`:
- `actions/checkout@v4` (x2) -> `actions/checkout@<checkout-sha> # v4`
- `actions/setup-node@v4` (x2) -> `actions/setup-node@<setup-node-sha> # v4`

In `.github/workflows/verify-deploy.yml`, there are no `uses:` action steps (it is a single `run:` step), so it needs no change unless a `uses:` is present — confirm and leave it otherwise untouched.

(Note: `treosh/lighthouse-ci-action@v12` is in `ci.yml`; pin it too: `treosh/lighthouse-ci-action@<sha> # v12`.)

- [ ] **Step 3: Validate YAML + gates**

Run: `node -e "const y=require('fs').readFileSync('.github/workflows/ci.yml','utf8'); if(!/@[0-9a-f]{40} # v/.test(y)) throw new Error('no pinned SHA found'); console.log('ci.yml pinned OK')"`
Expected: `ci.yml pinned OK` (confirms at least one 40-hex SHA pin with a version comment).

Run: `npm run build` then `npm run check`
Expected: both pass (workflow changes do not affect the app build, but confirm nothing else broke).

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/verify-deploy.yml
git commit -m "ci: pin GitHub Actions to commit SHAs"
```

---

### Task 6: Escape `<` in the inline JSON-LD

**Files:**
- Modify: `src/layouts/Layout.astro`

**Interfaces:** none.

- [ ] **Step 1: Escape the serialized schema**

In `src/layouts/Layout.astro`, change the JSON-LD script line from:

```astro
    <script type="application/ld+json" set:html={JSON.stringify(personSchema)} is:inline />
```

to (escape `<` so a `</script>` in any field can never break out of the script element):

```astro
    <script type="application/ld+json" set:html={JSON.stringify(personSchema).replace(/</g, '\\u003c')} is:inline />
```

- [ ] **Step 2: Run gates + confirm valid JSON-LD**

Run: `npm run build` then `npm run check`
Expected: both pass.
Confirm in `dist/index.html` that the `application/ld+json` script contains `<` is NOT present unless a field had `<` (the schema has none, so the output is unchanged in practice) and that the script body is still valid JSON (e.g. starts with `{"@context"`).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "chore(security): escape < in the inline JSON-LD"
```

---

### Task 7: ADR-0010 + README

**Files:**
- Create: `docs/adr/0010-security-hardening.md`
- Modify: `README.md`

**Interfaces:** none.

- [ ] **Step 1: Create ADR-0010**

Create `docs/adr/0010-security-hardening.md`:

```markdown
# Defensive security hardening (headers, report-only CSP, form captcha, CI)

The static portfolio adds defensive hardening without changing its behavior or look: a
`vercel.json` with `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy`, and `Permissions-Policy`, plus a Content-Security-Policy in Report-Only
mode; an optional, env-gated hCaptcha on the contact form (off by default, so an
unconfigured deploy is identical to before); safe (non-major) npm audit fixes; a
`/.well-known/security.txt`; SHA-pinned GitHub Actions; and an escaped inline JSON-LD.

## Status

Accepted.

## Considered Options

- **Report-Only CSP first (chosen)**: observe violations with zero breakage, then enforce in a
  later pass. The site emits inline scripts (the Hero `is:inline`, the JSON-LD), so an enforcing
  CSP would need hashes; doing that blindly risks breaking the page.
- **Enforce CSP immediately**: rejected for this pass for the reason above.
- **Honeypot + domain allowlist only (no captcha)**: rejected; the author chose defense in
  depth. The hCaptcha is env-gated, so it never affects an unconfigured deploy.
- **`npm audit fix --force` (major bumps)**: rejected for this pass; majors risk build
  regressions and are triaged separately via Dependabot.

## Consequences

- Adds `vercel.json` (edge headers), `public/.well-known/security.txt`, a
  `PUBLIC_HCAPTCHA_SITEKEY`-gated widget in the contact form, and SHA-pinned Actions.
- The CSP is Report-Only: it reports violations but blocks nothing. A future pass tightens it
  (drop `'unsafe-inline'`, add hashes) and switches to an enforcing `Content-Security-Policy`.
- Operator follow-ups remain: enable the Web3Forms domain allowlist + hCaptcha (and set the
  sitekey), and merge the Dependabot PRs for the alerts that need major bumps.
- Verification stays presentation-only (ADR-0001): build + type-check + config/dist checks, with
  header presence confirmed on a preview deploy.
```

- [ ] **Step 2: Add the README Engineering-Decisions row**

In `README.md`, add this as the last row of the `## Engineering Decisions` table:

```markdown
| Defensive hardening: response headers + report-only CSP, env-gated form hCaptcha, SHA-pinned Actions, security.txt | Enforcing CSP immediately; no captcha; major dependency bumps now | Closes real hardening gaps with zero behavior change and zero breakage risk; CSP observes before enforcing, and the captcha is off until configured. See [ADR-0010](docs/adr/0010-security-hardening.md). |
```

- [ ] **Step 3: Add a short Security note**

In `README.md`, immediately BEFORE the `## Contact` section, add:

```markdown
## Security

- **Response headers** (via `vercel.json`): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and a Content-Security-Policy in **Report-Only** mode (observe-before-enforce).
- **Contact form**: a honeypot plus an optional, env-gated hCaptcha (`PUBLIC_HCAPTCHA_SITEKEY`); the public Web3Forms key should also be domain-restricted in the Web3Forms dashboard.
- **Supply chain**: GitHub Actions pinned to commit SHAs; dependencies tracked via Dependabot.
- **Disclosure**: see [`/.well-known/security.txt`](public/.well-known/security.txt).

See [ADR-0010](docs/adr/0010-security-hardening.md) for the rationale.
```

- [ ] **Step 4: Run gates**

Run: `npm run build` then `npm run check`
Expected: build completes; check `0 errors`. (Docs-only.)

- [ ] **Step 5: Commit**

```bash
git add docs/adr/0010-security-hardening.md README.md
git commit -m "docs: record ADR-0010 and document the security hardening"
```

---

## Final verification (after all tasks)

- [ ] `npm run build` and `npm run check` — both clean.
- [ ] `dist/` inspection: `dist/.well-known/security.txt` present; `dist/index.html` form unchanged (no `h-captcha` when the sitekey is unset); JSON-LD still valid JSON.
- [ ] `vercel.json` is valid JSON with the four headers + the `Content-Security-Policy-Report-Only` (and NO enforcing `Content-Security-Policy`).
- [ ] Both workflows have SHA-pinned `uses:` and remain valid YAML.
- [ ] Audit report recorded (before/after + remaining advisories).
- [ ] Deferred to a preview deploy (operator): `curl -I <preview-url>` shows the headers; the Web3Forms allowlist + hCaptcha are enabled; Dependabot PRs triaged.
