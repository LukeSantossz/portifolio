/**
 * Central site configuration.
 * Edit here to change identity, contact and SEO across the whole site.
 */
export const site = {
  // --- Identity -------------------------------------------------------------
  name: 'Lucas Gonçalves',
  initials: 'LG',
  role: 'AI / ML Engineer',

  // Hero sub-headline: a short positioning line shown under the role.
  headline: 'Applied machine learning, anchored in real-world agriculture.',

  // Canonical availability line — the recruiter "smell test" (timezone + remote).
  // Single source of truth; rendered as a chip at the top of the hero.
  availability: 'Marília, Brazil (GMT-3) · Remote · Open to international',

  // Hero proof strip: three measurable, self-explanatory anchors, each one
  // traceable to a case study below.
  heroStats: [
    { value: '3rd of 1,300+', label: 'A soil-reading app I built placed 3rd at FETEPS 2025, a state science fair; its paper was accepted at the ICPA 2026 precision-agriculture conference.' },
    { value: '0.19°C', label: 'Average error of a temperature-forecasting pipeline across 211 countries, about 75% lower than the standard Prophet baseline.' },
    { value: '205 tests', label: 'Coverage around 83% on a FAPESP-funded question-answering agent that scores its own confidence in every answer.' },
  ],

  // Core-stack chips shown as a static inline strip in the hero — the headline
  // of the stack, drawn from skills.ts. Kept short: a title + a few tools.
  heroBadges: [
    { title: 'RAG · LLM', sub: 'Qdrant · Ollama · FastAPI' },
    { title: 'PyTorch', sub: 'TensorFlow · scikit-learn' },
    { title: 'Python · Rust', sub: 'Polars · Docker · pytest' },
  ],

  // --- Contact & social -----------------------------------------------------
  email: 'lucassg2015@gmail.com',
  github: 'https://github.com/LukeSantossz',
  linkedin: 'https://www.linkedin.com/in/lucas-gonçalvessz/',

  // --- Assets ---------------------------------------------------------------
  cvPath: '/my_resume.pdf', // résumé served from public/my_resume.pdf
  ogImage: '/og-image.png', // social share image at public/og-image.png

  // Browser tab label (the <title>). Kept short and branded; the descriptive,
  // specialty-bearing title still goes to og:title / twitter:title for sharing.
  tabTitle: 'LukeSz Portfolio',

  // --- Integrations ---------------------------------------------------------
  // Free access key from https://web3forms.com (used by the contact form). This
  // key is public by design — it ships in the form HTML and is submitted from
  // the browser — so it is safe to commit. Override it per environment by
  // setting PUBLIC_WEB3FORMS_KEY; if that is ever set to an empty string the
  // form degrades to an email-only CTA instead of posting an invalid key
  // (see Contact.astro).
  web3formsKey:
    import.meta.env.PUBLIC_WEB3FORMS_KEY ?? 'efb07a21-8678-4d14-aa17-27262fd76ad3',

  // --- SEO ------------------------------------------------------------------
  seoTitle: 'Lucas Gonçalves · AI/ML Engineer',
  seoDescription:
    'AI/ML Engineer focused on applied intelligence for agriculture and production-grade AI systems: RAG, computer vision, and open source. Big Data student at Fatec, building toward remote/international ML roles.',
} as const;
