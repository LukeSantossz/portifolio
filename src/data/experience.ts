/**
 * Career and education timeline, most recent first.
 *
 * Each highlight leads with its outcome or number: recruiters scan the first
 * few words of a line and stop there.
 *
 * Copy here is the audited set. Role titles, dates and figures are synced with
 * CONTENT-SOURCE.md, which records what every number rests on and what was
 * deliberately left out. No role carries an employment type or seniority
 * marker. Authorship labels ("principal author", "largest contributor") and
 * participation percentages are out of the public material by decision: they
 * measure a slice of a system rather than the system.
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
    role: 'Software Engineer, AI and Data',
    org: 'Unipac',
    period: 'Sep 2026 to Present',
    description:
      'Unipac is a packaging and polymer processing manufacturer. The work is an internal AI platform that turns an approved product specification into a working full-stack application, built around a pipeline of specialist agents.',
    highlights: [
      'Built an internal multi-agent platform that turns an approved product specification into a working full-stack application, orchestrating seven specialist agents through a coordinator that delegates rather than writes code. It has generated 20+ applications end to end, each submitted to thirteen deterministic verifiers before release.',
      'Took approval authority away from the language model: the security verdict is derived from deterministic scanner receipts run in a short-lived isolated virtual machine and tied to a checksum of the delivered code, applied by a pure function the pipeline cannot bypass and locked by 32 contract tests, so a model cannot sign off on its own output.',
      'Ran every piece of generated code inside a per-job micro virtual machine with its own kernel rather than a normal container, on the reasoning that code written by a model is untrusted input. The stronger isolation also measured faster than starting a container per command.',
      'Designed a seven-layer containment stack for runaway agent behavior, each layer added in response to a real incident, including one tool called 72 times in a loop and a job stalled for 30 minutes because each re-delegation reset its own budget.',
      'Closed a path that was shipping prompts, specifications and error traces containing authorization headers to a third-party service in clear text.',
    ],
  },
  {
    kind: 'work',
    role: 'AI Engineer',
    org: 'PM Accelerator',
    period: 'Jun 2026 to Aug 2026',
    description:
      'A US-based ed-tech startup building an AI-powered college-advising platform. I worked on the retrieval and grounding core, owning the retrieval, prompt, conversation and routing services.',
    highlights: [
      'Built the hybrid retrieval engine from scratch with no RAG framework over a corpus of roughly 1,800 US institutions, ranking exact institution-name matches above vector similarity on purpose, because someone who types a school name wants that school and blending the two scores buries it.',
      'Attacked hallucination structurally rather than through prompt wording: the system refuses before spending an API call when nothing was retrieved, and a verifier re-reads each answer for figures no source record supports, including one institution\'s statistic quoted under another institution\'s name.',
      'Enforced per-student data isolation with an explicit predicate on every query after finding that database-level row security was bypassed by the service connection, and guaranteed coverage with a test that reads the source code itself and fails the build if any student-scoped query lacks an isolation case.',
      'Grew the backend suite to 1,149 automated tests at a test-to-code ratio above 1.75 to 1, and cut the continuous-integration install from roughly 800MB to 90MB by serving the same embedding model through a lighter runtime.',
      'Delivered 19 of 29 tracked workstream items on a weekly cadence inside a globally distributed team spanning multiple time zones, coordinating asynchronously through written specifications and alignment checkpoints.',
    ],
  },
  {
    kind: 'work',
    role: 'After-Sales, Data and Automation',
    org: 'Jacto',
    period: 'Nov 2024 to Jun 2026',
    description:
      'Jacto is a Brazilian manufacturer of agricultural machinery that sells in more than 100 countries and employs over 3,000 people, with after-sales operations at industrial scale. I worked where the business side meets engineering.',
    highlights: [
      'Cut the rate of incorrectly returned field parts from around 20% in 2025 to under 5% in 2026, closing June 2026 at 0% against a 6% Six Sigma target, which removed recurring freight costs from returns that should never have shipped.',
      'Automated a previously manual data migration: extracted hundreds of dealership address records from a foreign government address-classification system, transliterated and cleaned them by region, and produced load-ready files for Salesforce, removing up to five hours a day of manual collection and spreadsheet formatting.',
      'Designed a computer-vision system (now in internal review) that audits discarded parts end to end: it checks each photo meets the standard, reads the printed slip and cross-checks it against the system record, and recognizes the part, paired with an in-app camera that locks file names and stamps time and location so the evidence holds up.',
      'Found 10+ usability problems as the business-to-developer bridge on an internal parts-return tool, validating rule changes across testing rounds, moving the workflow from manual entry to mostly review.',
      'Audited 150+ main dealerships at home and abroad, reconciling the field-parts return flow and tracking millions of reais in parts movement, and processed write-offs through audits done both on site and remotely.',
    ],
  },
  {
    kind: 'work',
    role: 'Software Engineer, Synapse Program',
    org: 'CIAg',
    period: 'Feb 2024 to Oct 2024',
    description:
      'A regional innovation program. The work was an internal natural-language assistant over a domain-specific knowledge base, and it is the earliest language-model work in this timeline.',
    highlights: [
      'Led development of a natural-language assistant built on a language model (Python, FastAPI, OpenAI API) with contextual retrieval, keeping answers grounded in a region-specific knowledge base.',
      'Designed the REST API layer connecting the application to the language model, covering request handling and integration with the retrieval step.',
    ],
  },
  {
    kind: 'education',
    role: 'Technology degree (CST) in Big Data for Agribusiness',
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
