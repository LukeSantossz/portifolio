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
      'Global agricultural machinery manufacturer operating across 100+ countries with 3,000+ employees and industrial-scale after-sales operations.',
    highlights: [
      'Automated the migration of Russian KLADR-classified fiscal address records into Salesforce during a dealership onboarding — extraction, Cyrillic-to-Latin transliteration, and geographic normalization across regions — eliminating manual data entry from the process.',
      'Designed a computer-vision discard-auditing architecture (under internal review) combining photo-standardization checks, OCR cross-referencing of the captured slip against the system record, and part recognition, paired with an in-app camera module enforcing filename locks with automatic timestamping and geotagging for evidence integrity.',
      'Partnered with engineering as the business-to-development bridge on an internal parts-return system, surfacing 10+ usability defects and validating business-rule changes across QA cycles that shifted the workflow from manual entry to majority-review operation.',
      'Audited and reconciled the field-parts return flow across 150+ master dealerships operating nationally and internationally, tracking millions of BRL in parts movement and processing write-offs through on-site and remote audits.',
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
