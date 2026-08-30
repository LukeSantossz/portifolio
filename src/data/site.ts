/**
 * Central site configuration: identity, contact, SEO.
 *
 * PLACEHOLDER IDENTITY. Every value in the Identity, Contact and Assets blocks
 * below is fictional, used while the design is being built so no personal data
 * lives in the working tree. Swapping in the real identity means editing this
 * one file plus `src/data/about.ts`, `src/data/experience.ts`, the four
 * `src/content/projects/*.md`, `public/robots.txt`, `public/.well-known/`
 * and the `site` URL in `astro.config.mjs`.
 */
export const site = {
  // --- Identity (placeholder) -----------------------------------------------
  name: 'Alex Morgan',
  initials: 'AM',
  role: 'AI Engineer',

  /** Hero positioning line. One sentence, states the work, claims nothing. */
  headline:
    'I build retrieval systems and the evaluation that says when they are wrong. Five years in software, the last two in ML.',

  /**
   * The recruiter smell test, in one line: where, which timezone, how
   * reachable, and the work-authorization answer they would otherwise have to
   * email to get.
   */
  availability: 'São Paulo, Brazil (GMT-3) · Remote · Eligible to work in the EU',

  /**
   * Hero proof strip. Three numbers, each defended by a record in the index or
   * by a line in the timeline. Measured outcomes only: no test counts, no
   * coverage, nothing that is an activity rather than a result.
   */
  heroStats: [
    {
      value: '~50%',
      label:
        'Less answer review time after shipping a confidence score with every retrieval answer, so reviewers read the uncertain ones first.',
    },
    {
      value: '0.81',
      label:
        'AUROC of that confidence score separating correct answers from incorrect ones, across 220 hand-checked questions.',
    },
    {
      value: '4h to 20min',
      label: 'A nightly pipeline, after replacing row-wise work with columnar processing.',
    },
  ],

  // --- Contact & social (placeholder) ---------------------------------------
  email: 'alex.morgan@example.com',
  github: 'https://github.com/example',
  linkedin: 'https://linkedin.com/in/example',

  // --- Assets (placeholder) -------------------------------------------------
  resumePath: '/alex-morgan-resume.pdf',
  ogImage: '/og-image.png',

  /** Browser tab label. Short; the descriptive title goes to og:title. */
  tabTitle: 'Alex Morgan',

  // --- Integrations ---------------------------------------------------------
  /**
   * Web3Forms access key for the contact form. Public by design (it ships in
   * the form HTML and is submitted from the browser). Set
   * PUBLIC_WEB3FORMS_KEY per environment; an empty value degrades the form to
   * an email-only CTA rather than posting an invalid key (see Contact.astro).
   */
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',

  /**
   * hCaptcha sitekey (optional). When set, the form renders the widget and
   * loads the hCaptcha script; add the matching secret in the Web3Forms
   * dashboard so the token is validated. Empty means no captcha.
   */
  hcaptchaSitekey: import.meta.env.PUBLIC_HCAPTCHA_SITEKEY ?? '',

  // --- SEO ------------------------------------------------------------------
  seoTitle: 'Alex Morgan · AI Engineer',
  seoDescription:
    'AI Engineer working on retrieval systems, uncertainty estimation, and the evaluation that decides whether either is working. Case studies with measured results, stated methodology, and known limits.',
} as const;
