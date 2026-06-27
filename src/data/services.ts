/**
 * Services / capabilities content.
 * Decoupled from the component so copy edits never touch markup
 * (matches the src/data/*.ts pattern used across the site).
 */
export const services = {
  intro:
    'Four things I do well, each one backed by a real, shipped project in the case studies, not just a line on a slide.',
  items: [
    {
      title: 'Computer vision that runs offline',
      body: 'Image models that run on the phone itself, in the field, with no signal and no trip to a server, for places where connectivity fails and a wrong call is costly.',
    },
    {
      title: 'Forecasting that hedges its bets',
      body: 'Forecasting that does not stake everything on one model: a weighted blend of approaches, anomaly detection, and honest error numbers measured against a public baseline.',
    },
    {
      title: 'LLM agents you can act on',
      body: 'Question-answering and agent systems that report their own uncertainty, so a person knows how far to trust each answer, running on open models with no dependence on a paid service.',
    },
    {
      title: 'The plumbing that keeps it alive',
      body: 'The work that turns a notebook into a service people can rely on: packaging, automated builds, tests, and the unglamorous infrastructure that keeps a model running long after the demo is over.',
    },
  ],
} as const;
