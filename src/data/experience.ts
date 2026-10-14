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
  /** City and country of the role. The method puts location on line 1,
      next to the period, because an international reader calibrates on it. */
  location?: string;
  description: string;
  highlights?: string[];
}

export const timeline: TimelineItem[] = [
  {
    kind: 'work',
    role: 'Software Engineer, AI and Data',
    org: 'Unipac',
    period: 'Sep 2026 to Present',
    location: 'Pompeia, Brazil',
    description:
      'Unipac is a packaging and polymer processing manufacturer within the Jacto Group. The work is UNIPAC AI Studio, an internal AI platform that turns an approved specification into a full-stack application.',
    highlights: [
      'Re-architected a multi-agent code-generation platform by replacing its language-model orchestrator with a deterministic scheduler: up to 12 specialist agent phases in 4 waves, with parallel waves, phases declared by the architect agent and contracts and DevOps files generated from templates. Deployed to Cloud Run in a development environment.',
      'Piloted the platform on 22 projects submitted to InovaSkill 2026: it blocked 21 of 21 severe findings before delivery, and 12 of 14 end-to-end runs passed.',
      'Replaced the model\'s self-reported security verdict with a deterministic gate: Semgrep (20 custom rules) and Trivy run in a read-only sandbox without network access, and a pure policy function that blocks critical and high findings judges the resulting receipt, covered by 154 tests.',
      'Built a 9-layer guardrail stack for runaway agents (session, tool-batch and delegation caps, idempotent loop breaker, crash guard, retry, fallback, empty-reply guard, circuit breaker) after one model response emitted 2,179 identical tool calls.',
      'Designed evidence-driven auto-remediation that routes each blocking finding to the specialist agent that owns the file and re-invokes it with the failing tool output, capped at 3 rounds per gate and 6 per run. It cleared 14 of 21 gate failures across 13 runs without human intervention.',
      'Built a verification layer that records 33 verdicts per generated app, 13 of them blocking completion, and prevented personal data and credentials from reaching a third-party tracing service by masking them before export.',
    ],
  },
  {
    kind: 'work',
    role: 'AI Engineer',
    org: 'PM Accelerator',
    period: 'Jun 2026 to Aug 2026',
    location: 'Miami, United States (remote)',
    description:
      'PM Accelerator hosts Collegiary, an ed-tech startup. The work is an AI college-advising platform, and I drove its retrieval and grounding core.',
    highlights: [
      'Built from scratch, with no RAG framework, a hybrid retrieval engine over roughly 1,800 US institutions: exact name and alias matches rank above vector similarity on purpose, because someone who types a school name wants that school and blending the two scores buries it.',
      'Eliminated a class of hallucination structurally rather than through prompt wording: the system refuses before spending an API call when nothing was retrieved, and a verifier flags figures no source record supports, including one institution\'s statistic quoted under another institution\'s name. The gate and verifier are covered by 191 automated tests.',
      'Rewrote the two-tier model router, which had sent 0 of 6 live questions to the cheap tier, around deterministic rules with a token-capped cheap-model tiebreak, covered by 27 routing tests.',
      'Established per-student data isolation with an explicit predicate on every query after finding that row-level security was bypassed by the service connection, and guaranteed coverage with a test that reads the source code and fails the build if any student-scoped read lacks an isolation case (55 reads, 174 cases).',
      'Scaled the backend suite to 1,149 automated tests at a test-to-code ratio of 1.75 to 1, and cut the CI install from roughly 800MB to 90MB by serving the same embedding model through ONNX.',
      'Delivered 19 of 29 tracked board items on a weekly cadence against written specifications, and was recommended in writing by the company\'s founder.',
    ],
  },
  {
    kind: 'work',
    role: 'After-Sales, Data and Automation',
    org: 'Jacto',
    period: 'Nov 2024 to Jun 2026',
    location: 'Pompeia, Brazil',
    description:
      'Jacto is a global manufacturer of agricultural machinery with more than 5,000 employees, operating in more than 100 countries. I worked in after-sales data and automation, where the business side meets engineering.',
    highlights: [
      'Co-led a two-person effort that cut the incorrect field-parts return rate from about 20% in 2025 to under 5% in 2026, closing June 2026 at 0% against a 6% Six Sigma target. The process was standardized into an approved manual adopted across a network of more than 150 dealerships, avoiding an estimated R$100 to 135K in freight in the first half of 2026.',
      'Automated fiscal-address collection from a foreign government registry in Python (Selenium, pandas): one run walks all 99 regional pages, translates the hierarchy from Russian to English and exports a load-ready workbook for Salesforce, removing up to 5 hours a day of manual work.',
      'Audited the field-parts return flow across more than 150 master dealerships through on-site and remote audits, in a flow of more than 13,000 parts and about R$6.5M per semester, and codified the findings in a rules manual that corrected more than half of the process divergences.',
      'Tracked and validated more than 20 improvements with the development team on the internal parts-return system, starting from 10+ mapped usability defects, including a four-system data sync and a redesign that cut record loading from 5 to 10 minutes to under 1 minute.',
      'Proposed a computer-vision disposal audit, specified end to end and submitted for internal approval: OCR cross-checks a photographed receipt against the system record, the part is identified automatically, and an in-app camera locks file name, timestamp and location so the evidence can be verified.',
    ],
  },
  {
    kind: 'work',
    role: 'Software Engineer, Synapse Program',
    org: 'CIAg',
    period: 'Feb 2024 to Oct 2024',
    location: 'Pompeia, Brazil',
    description:
      'CIAg is an agribusiness innovation center within the Jacto Group. The Synapse program built an LLM assistant for students and faculty, and it is the earliest language-model work in this timeline.',
    highlights: [
      'Led a team of 2 to 3 developers building an LLM assistant for students and faculty (Python, FastAPI, OpenAI API) that answers from a base of agronomic technical documents through contextual RAG. The assistant has since been discontinued.',
      'Designed the REST API layer between the application and the language model, covering request handling and the integration with the retrieval step.',
    ],
  },
  {
    kind: 'education',
    role: 'Technology degree (CST) in Big Data for Agribusiness',
    org: 'Fatec Shunji Nishimura, Pompeia, São Paulo',
    period: '2024 to Nov 2026',
    location: 'Pompeia, Brazil',
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
