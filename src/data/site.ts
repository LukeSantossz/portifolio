/**
 * Central site configuration: identity, contact, SEO.
 * Edit here to change identity, contact and SEO across the whole site.
 */
export const site = {
  // --- Identity -------------------------------------------------------------
  name: 'Lucas Gonçalves',
  initials: 'LG',
  role: 'AI Engineer',

  /** Hero positioning line. One sentence, states the work, claims nothing. */
  headline: 'Applied machine learning, anchored in real-world agriculture.',

  /**
   * The recruiter smell test, in one line: where, which timezone, and how
   * reachable, so nobody has to email to find out.
   */
  availability: 'Marília, Brazil (GMT-3) · Remote · Open to international roles',

  /**
   * Hero proof strip. Three numbers, each defended by a record in the index or
   * by a line in the timeline.
   */
  heroStats: [
    {
      value: '3rd of 1,300+',
      label:
        'A soil-reading app I built placed 3rd at the 16th FETEPS 2025, a state science fair; its paper was published and presented at the ICPA/ConBAP 2026 precision-agriculture conference.',
    },
    {
      value: '+51.9%',
      label:
        'Macro-F1 gain after a fine-tuning run that came out worse than its baseline, once error analysis traced the failure to the wrong starting model rather than the wrong settings.',
    },
    {
      value: '372 tests',
      label:
        'Coverage of 89.8% on a FAPESP-funded question-answering agent that scores its own confidence in every answer.',
    },
  ],

  // --- Contact & social -----------------------------------------------------
  email: 'lucassg2015@gmail.com',
  github: 'https://github.com/LukeSantossz',
  linkedin: 'https://www.linkedin.com/in/lucas-gonçalvessz/',

  // --- Assets ---------------------------------------------------------------
  resumePath: '/my_resume.pdf', // resume served from public/my_resume.pdf
  ogImage: '/og-image.png', // social share image at public/og-image.png

  /** Browser tab label. Short; the descriptive title goes to og:title. */
  tabTitle: 'LukeSz Portfolio',

  // --- Integrations ---------------------------------------------------------
  /**
   * Web3Forms access key for the contact form. Public by design (it ships in
   * the form HTML and is submitted from the browser). Set
   * PUBLIC_WEB3FORMS_KEY per environment; an empty value degrades the form to
   * an email-only CTA rather than posting an invalid key (see Contact.astro).
   */
  web3formsKey:
    import.meta.env.PUBLIC_WEB3FORMS_KEY ?? 'efb07a21-8678-4d14-aa17-27262fd76ad3',

  /**
   * hCaptcha sitekey (optional). When set, the form renders the widget and
   * loads the hCaptcha script; add the matching secret in the Web3Forms
   * dashboard so the token is validated. Empty means no captcha.
   */
  hcaptchaSitekey: import.meta.env.PUBLIC_HCAPTCHA_SITEKEY ?? '',

  // --- SEO ------------------------------------------------------------------
  seoTitle: 'Lucas Gonçalves · AI Engineer',
  seoDescription:
    'AI Engineer working on retrieval-augmented and agentic LLM systems, applied machine learning and on-device computer vision. Published precision-agriculture research, an accepted open-source contribution to a Kafka-compatible streaming platform, and case studies that publish their own retractions. Open to remote and international roles.',
} as const;
