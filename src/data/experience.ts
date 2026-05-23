/**
 * Career and education timeline. Most recent first.
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
    role: 'After-Sales Intern',
    org: 'Jacto',
    period: '2025 — Present',
    description:
      'Supporting after-sales operations at a global agricultural machinery manufacturer, bridging technical teams and field clients.',
    // TODO: add metric-based highlights (ticket volume, SLA, response time, etc.)
  },
  {
    kind: 'education',
    role: 'B.Tech in Big Data for Agribusiness',
    org: 'Fatec Shunji Nishimura — Pompeia, SP',
    period: '2024 — Dec 2026',
    description:
      'Applied technology program covering machine learning, statistical modeling, and data engineering for agricultural contexts.',
    highlights: [
      'Co-authored paper accepted at ConBAP/ICPA 2026 (abstract #14064)',
      'Top 250 at FETEPS 2025',
    ],
  },
];
