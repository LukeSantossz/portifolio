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
      'Automated a data migration that used to be manual: Russian dealership address records, stored in the Russian government address-classification system (KLADR), were extracted, converted from the Cyrillic to the Latin alphabet, cleaned up by region, and loaded into Salesforce, the customer-records platform the company runs on.',
      'Designed a computer-vision system (now in internal review) to audit discarded parts: it checks that photos meet a standard, reads the printed slip and cross-checks it against the system record, and recognizes the part, paired with an in-app camera that locks file names and stamps each photo with time and location so the evidence holds up.',
      'Acted as the bridge between the business and the developers on an internal parts-return tool, finding more than 10 usability problems and validating rule changes across testing rounds, which moved the workflow from manual entry to mostly review.',
      'Audited and reconciled the field-parts return flow across more than 150 main dealerships at home and abroad, tracking millions of reais in parts movement and processing write-offs through audits done both on site and remotely.',
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
