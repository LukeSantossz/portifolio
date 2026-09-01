/**
 * Career and education timeline, most recent first.
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
    role: 'After-Sales: Data & Automation',
    org: 'Jacto',
    period: 'Nov 2024 to Sep 2026',
    description:
      'Jacto is a Brazilian manufacturer of agricultural machinery that sells in more than 100 countries and employs over 3,000 people, with after-sales operations at industrial scale. I work where the business side meets engineering.',
    highlights: [
      'Cut the rate of incorrectly returned field parts from around 20% in 2025 to under 5% in 2026, closing July 2026 at 0% against a 6% Six Sigma target, which removed recurring freight costs from returns that should never have shipped.',
      'Automated a previously manual data migration: extracted Russian dealership address records from the government address-classification system (KLADR), transliterated them Cyrillic-to-Latin, cleaned them by region, and produced load-ready files for Salesforce, the platform the company runs its customer records on.',
      'Designed a computer-vision system (now in internal review) that audits discarded parts end to end: it checks each photo meets the standard, reads the printed slip and cross-checks it against the system record, and recognizes the part, paired with an in-app camera that locks file names and stamps time and location so the evidence holds up.',
      'Found 10+ usability problems as the business-to-developer bridge on an internal parts-return tool, validating rule changes across testing rounds, moving the workflow from manual entry to mostly review.',
      'Audited 150+ main dealerships at home and abroad, reconciling the field-parts return flow and tracking millions of reais in parts movement, and processed write-offs through audits done both on site and remotely.',
    ],
  },
  {
    kind: 'work',
    role: 'AI Engineer Intern',
    org: 'Unipac',
    period: 'Feb 2026 to Present (part-time)',
    description:
      'Internal AI platform that turns an approved product specification into a working full-stack application, built around a pipeline of specialist agents. I was the principal author of the agent service.',
    highlights: [
      'Built the seven-phase agent pipeline and its coordinator, which delegates rather than writes code, principal author of a 103,000-line Python service held to 3,397 automated tests.',
      'Took approval authority away from the language model: the security verdict is derived from deterministic scanner receipts run in a short-lived isolated virtual machine and tied to a checksum of the delivered code, so a model cannot sign off on its own output.',
      'Ran every piece of generated code inside a per-job micro virtual machine with its own kernel rather than a normal container, on the reasoning that code written by a model is untrusted input.',
      'Designed a seven-layer containment stack for runaway agent behaviour, each layer added in response to a real incident, including one tool called 72 times in a loop and a job stalled for 30 minutes because each re-delegation reset its own budget.',
      'Closed a path that was shipping prompts, specifications and error traces containing authorization headers to a third-party service in clear text.',
    ],
  },
  {
    kind: 'work',
    role: 'AI Engineer Intern',
    org: 'PM Accelerator',
    period: 'May 2026 to Jul 2026 (part-time)',
    description:
      'A US-based ed-tech startup building an AI-powered college-advising platform. I owned the retrieval and grounding core, and was the largest single contributor to the shared backend.',
    highlights: [
      'Authored roughly 42% of the backend merged into the shared repository and delivered 19 of 29 tracked workstream items, including two picked up from another engineer.',
      'Built the hybrid retrieval engine from scratch with no RAG framework, ranking exact institution-name matches above vector similarity on purpose, because someone who types a school name wants that school and blending the two scores buries it.',
      'Attacked hallucination structurally rather than through prompt wording: the system refuses before spending an API call when nothing was retrieved, and a verifier re-reads each answer for figures no source record supports, including one institution\'s statistic quoted under another institution\'s name.',
      'Enforced per-student data isolation with an explicit predicate on every query after finding that database-level row security was bypassed by the service connection, and guaranteed coverage with a test that reads the source code itself and fails the build if any student-scoped query lacks an isolation case.',
      'Grew the backend suite to 854 automated tests and cut the continuous-integration install from roughly 800MB to 90MB by serving the same embedding model through a lighter runtime.',
      'Delivered on a weekly cadence inside a globally distributed team spanning multiple time zones, coordinating asynchronously through written specifications and weekly alignment checkpoints.',
    ],
  },
  {
    kind: 'education',
    role: 'B.Tech in Big Data for Agribusiness',
    org: 'Fatec Shunji Nishimura, Pompeia, São Paulo',
    period: '2024 to Nov 2026',
    description:
      'A public applied-technology degree. Coursework covers machine learning, artificial intelligence, data structures, databases (SQL and NoSQL), APIs and microservices, cloud architecture, and statistics.',
    highlights: [
      'Co-authored a paper published and presented as a poster at the 17th International Conference on Precision Agriculture and the 11th ConBAP, Porto Alegre, July 2026 (abstract #14064).',
      'Volunteer researcher on a FAPESP-funded research project (grant 2024/00985-1), the state research foundation of São Paulo.',
      'Placed 3rd out of more than 1,300 entries at the 16th FETEPS 2025, a large state science and technology fair.',
      'Languages: Portuguese (native) · English (B2, upper-intermediate).',
    ],
  },
];
