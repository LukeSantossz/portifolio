/**
 * Central site configuration.
 * Edit here to change identity, contact and SEO across the whole site.
 */
export const site = {
  // --- Identity -------------------------------------------------------------
  name: 'Lucas Gonçalves',
  initials: 'LG',
  role: 'AI Engineer',

  // Positioning headline.
  headline:
    'AI Engineer building production-ready NLP pipelines, computer vision systems, and LLM agents for agribusiness.',
  subheadline:
    'From peer-reviewed soil classification research (ConBAP/ICPA 2026) to RAG agents with hallucination scoring and ensemble forecasting at 0.19°C RMSE across 211 countries — focused on applied AI that ships.',

  // --- Contact & social -----------------------------------------------------
  email: 'lucassg2015@gmail.com',
  location: 'Brazil / Remote',
  github: 'https://github.com/LukeSantossz',
  linkedin: 'https://www.linkedin.com/in/lucas-gonçalvessz/',

  // --- Assets ---------------------------------------------------------------
  cvPath: '/cv.pdf', // place your résumé at public/cv.pdf
  ogImage: '/og-image.png', // social share image at public/og-image.png

  // --- Integrations ---------------------------------------------------------
  // Free access key from https://web3forms.com (used by the contact form).
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY',

  // --- SEO ------------------------------------------------------------------
  seoTitle: 'Lucas Gonçalves — AI Engineer',
  seoDescription:
    'AI Engineer building computer vision, NLP pipelines, and LLM agents for agribusiness — from research to production.',
} as const;
