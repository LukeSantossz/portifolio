/**
 * Central site configuration.
 * Edit here to change identity, contact and SEO across the whole site.
 */
export const site = {
  // --- Identity -------------------------------------------------------------
  name: 'Lucas Gonçalves',
  initials: 'LG',
  role: 'AI Engineer',

  // Positioning headline (role + 3 specialties — recruiter keywords, mirrored from CV).
  headline:
    'AI Engineer building NLP systems, LLM agents, and production-grade ML pipelines.',

  // Availability line above the name (timezone + remote = the recruiter "smell test").
  availability: 'Marília, Brazil (GMT-3) · Remote-ready · Open to international roles',

  // Hero proof strip — the 3 strongest measurable achievements, mirrored from the CV.
  heroStats: [
    { value: '~50% faster', label: 'Enterprise process automation at Jacto (Salesforce + SAP)' },
    { value: '3rd of 1,300+', label: 'Soil classifier at FETEPS 2025, accepted at ICPA 2026' },
    { value: 'FAPESP-funded', label: 'Sole designer of a production RAG agent' },
  ],

  // --- Contact & social -----------------------------------------------------
  email: 'lucassg2015@gmail.com',
  location: 'Brazil / Remote',
  github: 'https://github.com/LukeSantossz',
  linkedin: 'https://www.linkedin.com/in/lucas-gonçalvessz/',

  // --- Assets ---------------------------------------------------------------
  cvPath: '/my_resume.pdf', // résumé served from public/my_resume.pdf
  ogImage: '/og-image.png', // social share image at public/og-image.png

  // --- Integrations ---------------------------------------------------------
  // Free access key from https://web3forms.com (used by the contact form).
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY',

  // --- SEO ------------------------------------------------------------------
  seoTitle: 'Lucas Gonçalves — AI Engineer',
  seoDescription:
    'AI Engineer building machine learning for agriculture: offline soil classification, temperature forecasting, and RAG agents with hallucination scoring.',
} as const;
