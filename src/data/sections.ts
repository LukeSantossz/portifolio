/**
 * Section copy: labels, headings, ledes and the few UI strings that are
 * really sentences. Kept here so no prose lives inside a `.astro` file
 * (the repo rule in CLAUDE.md), and so the voice can be edited in one pass.
 */
export const sections = {
  work: {
    label: 'Work',
    title: 'Four systems, and what each one cost to get right',
    intro:
      'The first record is open below. Each one carries the problem, what constrained it, the decision I made, what I rejected, the measured result with its methodology, and where it still falls short.',
  },

  experience: {
    label: 'Experience',
    title: 'Where the work happened',
  },

  about: {
    label: 'About',
    title: 'Background',
  },

  contact: {
    label: 'Contact',
    title: 'Get in touch',
    intro:
      'I read everything that arrives here. If you are hiring for an AI or ML engineering role, tell me what the team is working on and what would make the first ninety days a success.',
    /** Framing for the secondary path, so the form stays the single primary. */
    emailFallback: 'Prefer email?',
    formNote: 'Your message goes straight to my inbox. No newsletter, no tracking.',
    /** Closing line: restates the real availability, no manufactured urgency. */
    closing: 'Open to remote and international roles, and to a short call about either.',
  },

  footer: {
    /** Rendered next to the year. Plain fact about the site itself. */
    colophon: 'Built with Astro. Archivo and IBM Plex Mono. No tracking beyond page counts.',
  },
} as const;
