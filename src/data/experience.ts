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
    period: 'Nov 2024 to Present',
    description:
      'Jacto is a Brazilian manufacturer of agricultural machinery that sells in more than 100 countries and employs over 3,000 people, with after-sales operations at industrial scale. I work where the business side meets engineering.',
    highlights: [
      'Automated a previously manual data migration: extracted Russian dealership address records from the government address-classification system (KLADR), transliterated them Cyrillic-to-Latin, cleaned them by region, and loaded them into Salesforce, the platform the company runs its customer records on.',
      'Designed a computer-vision system (now in internal review) that audits discarded parts end to end: it checks each photo meets the standard, reads the printed slip and cross-checks it against the system record, and recognizes the part — paired with an in-app camera that locks file names and stamps time and location so the evidence holds up.',
      'Found 10+ usability problems as the business-to-developer bridge on an internal parts-return tool, validating rule changes across testing rounds — moving the workflow from manual entry to mostly review.',
      'Audited 150+ main dealerships at home and abroad, reconciling the field-parts return flow and tracking millions of reais in parts movement, and processed write-offs through audits done both on site and remotely.',
    ],
  },
  {
    kind: 'education',
    role: 'B.Tech in Big Data for Agribusiness',
    org: 'Fatec Shunji Nishimura, Pompeia, São Paulo',
    period: '2024 to Dec 2026',
    description:
      'A public applied-technology degree. Coursework covers machine learning, artificial intelligence, data structures, databases (SQL and NoSQL), APIs and microservices, cloud architecture, and statistics.',
    highlights: [
      'Co-authored a paper accepted at ICPA 2026 and the 17th ConBAP, an international precision-agriculture conference (abstract #14064).',
      'Placed 3rd out of more than 1,300 entries at FETEPS 2025, a large state science and technology fair.',
      'Languages: Portuguese (native) · English (B2, upper-intermediate).',
    ],
  },
];
