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
- The hCaptcha uses Web3Forms' managed integration (`data-captcha="true"` + the Web3Forms
  client script); `PUBLIC_HCAPTCHA_SITEKEY` is a presence toggle, and the report-only CSP
  allows the Web3Forms client-script origin.
- The CSP is Report-Only: it reports violations but blocks nothing. A future pass tightens it
  (drop `'unsafe-inline'`, add hashes) and switches to an enforcing `Content-Security-Policy`.
- Operator follow-ups remain: enable the Web3Forms domain allowlist + hCaptcha (and set the
  sitekey), and merge the Dependabot PRs for the alerts that need major bumps.
- Verification stays presentation-only (ADR-0001): build + type-check + config/dist checks, with
  header presence confirmed on a preview deploy.
