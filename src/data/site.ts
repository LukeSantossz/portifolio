/**
 * Central site configuration.
 * Edit here to change identity, contact and SEO across the whole site.
 */
export const site = {
  // --- Identity -------------------------------------------------------------
  name: 'Lucas Gonçalves',
  initials: 'LG',
  role: 'AI/ML Engineer',

  // Positioning headline (role + 3 specialties — recruiter keywords, mirrored from CV).
  headline:
    'AI/ML Engineer building LLM agents & RAG, computer vision, and production-grade ML pipelines.',

  // Availability line above the name (timezone + remote = the recruiter "smell test").
  availability: 'Marília, SP, Brazil (GMT-3) · Remote-ready · Open to international roles',

  // Hero proof strip — the 3 strongest measurable achievements, mirrored from the CV.
  heroStats: [
    { value: 'FAPESP-funded', label: 'Sole dev of a production RAG with semantic-entropy hallucination scoring (205 tests, ~83% coverage)' },
    { value: '3rd of 1,300+', label: 'Soil classifier at FETEPS 2025, paper accepted at ICPA 2026' },
    { value: '0.19°C RMSE', label: 'Temperature forecasting ensemble, ~75% better than the Prophet baseline' },
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
  seoTitle: 'Lucas Gonçalves — AI/ML Engineer',
  seoDescription:
    'AI/ML Engineer building LLM agents, RAG systems, and applied machine learning: offline soil classification, temperature forecasting, and a production RAG with semantic-entropy hallucination scoring.',
} as const;
