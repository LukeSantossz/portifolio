/**
 * Career and education timeline, most recent first. PLACEHOLDER, see `site.ts`.
 *
 * Each highlight leads with its outcome or number: recruiters scan the first
 * few words of a line and stop there.
 */
export interface TimelineItem {
  kind: 'work' | 'education';
  role: string;
  org: string;
  period: string;
  description: string;
  highlights?: string[];
}

export const timeline: TimelineItem[] = [
  {
    kind: 'work',
    role: 'AI Engineer',
    org: 'Sundial Systems',
    period: '2024 to present',
    description:
      'A forty-person company selling forecasting and document tooling to agricultural cooperatives. I own the retrieval and evaluation side.',
    highlights: [
      'Cut answer review time roughly in half by shipping a confidence score with every retrieval answer, so a reviewer reads the uncertain ones first instead of all of them.',
      'Built the evaluation harness the team now gates releases on: a fixed question set, per-release scoring, and a regression check that blocks a merge when accuracy drops.',
      'Moved inference off a paid API onto self-hosted open models, holding answer quality within the eval margin and removing a recurring per-request cost.',
      'Wrote the incident notes for two retrieval failures in production, both traced to chunking rather than the model, and reworked the ingestion path accordingly.',
    ],
  },
  {
    kind: 'work',
    role: 'Data Engineer',
    org: 'Meridian Agro',
    period: '2021 to 2024',
    description:
      'Field-data platform for a grower network. Batch pipelines, a lot of messy sensor data, and the first models I put in front of users.',
    highlights: [
      'Reduced a nightly pipeline from four hours to under twenty minutes by replacing row-wise pandas work with columnar processing.',
      'Shipped the first on-device model in the product, which meant learning where a phone stops being a server.',
      'Ran the migration of six years of readings into a schema that survived, which mostly meant deciding what to throw away.',
    ],
  },
  {
    kind: 'education',
    role: 'B.Tech in Data Science',
    org: 'Instituto Politécnico, São Paulo',
    period: '2018 to 2021',
    description:
      'Applied degree. Machine learning, statistics, databases, distributed systems.',
    highlights: [
      'My final project on ensemble forecasting became the basis for the Isobar record above.',
      'Languages: Portuguese (native), English (professional working proficiency).',
    ],
  },
];
