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
    period: 'Nov 2024 — Present',
    description:
      'Global agricultural machinery manufacturer operating across 100+ countries with 3,000+ employees.',
    highlights: [
      'Redesigned a mission-critical after-sales workflow with a Python automation layer over the Salesforce and SAP APIs, eliminating manual cross-system data entry and reducing process resolution time by ~50%.',
      'Identified 10+ usability improvements across QA cycles and shipped logic changes that streamlined 3 manual workflow stages, cutting cross-system data-entry errors and improving execution speed by ~30%.',
      'Engineered a scheduled Python data-collection pipeline (Requests + BeautifulSoup) that replaced a recurring manual process and eliminated ~5 hours/week of error-prone database updates.',
    ],
  },
  {
    kind: 'education',
    role: 'B.Tech in Big Data for Agribusiness',
    org: 'Fatec Shunji Nishimura — Pompeia, SP',
    period: '2024 — Dec 2026',
    description:
      'Applied technology program covering machine learning, statistical modeling, and data engineering for agricultural contexts.',
    highlights: [
      'Co-authored paper accepted at ICPA 2026 / 17th ConBAP (abstract #14064)',
      '3rd place among 1,300+ submissions at FETEPS 2025',
    ],
  },
];
