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
    role: 'Data & AI Assistant',
    org: 'Unipac (Grupo Jacto)',
    period: 'Sep 2026 to Present',
    location: 'Pompeia, Brazil',
    description:
      'Packaging and polymers manufacturer of Grupo Jacto. Built and hardened an internal multi-agent AI platform that generates software, currently in pre-production validation.',
    highlights: [
      'Built a deterministic security gate (Semgrep with 20 rules, plus Trivy) in a network-less sandbox with SHA-256 snapshots, covered by 154 tests; it blocked 21/21 severe findings across a 22-project pilot.',
      'Re-architected the multi-agent platform into a deterministic 4-wave scheduler orchestrating up to 12 agent phases (LangGraph, LangChain, deepagents, FastAPI, GCP Cloud Run); 12 of 14 E2E runs were approved.',
      'Engineered auto-remediation that resolved 14 of 21 gate failures across 13 runs with no human input.',
      'Mitigated runaway agent behavior with a 9-layer guardrail stack, after a single response issued 2,179 identical tool calls.',
      'Instrumented per-run cost metering across 13 E2E runs (US$1.01 to 6.96, median US$2.63, median 17 min), cutting idea-validation cost from ~R$200K/~6 months to ~R$3K/<2 weeks (~66x).',
      'Contributed to data quality and standardization on a ~3.8 TB / ~25B-row BigQuery medallion lakehouse (288 bronze tables, 31 gold tables with ~30M rows), documenting metadata for 15+ previously undocumented tables so downstream AI agents get richer context.',
    ],
  },
  {
    kind: 'work',
    role: 'AI Engineer',
    org: 'PM Accelerator',
    period: 'Jun 2026 to Aug 2026',
    location: 'Miami, United States (remote)',
    description:
      'U.S. AI product accelerator. Selected for Cohort 9 of its AI Engineer Internship Program, building an AI college-admissions advisor in an 8-contributor international team.',
    highlights: [
      'Led the launch of the advisor as the backend AI engineer, owning the advisor\'s answer pipeline end to end: retrieval, prompt assembly, token-budgeted memory, two-tier model routing, a 90s turn ceiling and persistence (Python, FastAPI, PostgreSQL).',
      'Designed hybrid retrieval that ranks exact name/alias matches ahead of pgvector HNSW similarity over ~1,800 U.S. institutions, returning an explicit "not enough data" signal instead of a nearest-neighbor guess.',
      'Enforced factual grounding in code with a refuse-before-call gate (no model call or quota spent on unanswerable questions) and a post-generation verifier that flags unsupported rates, costs and GPAs.',
      'Secured per-student data isolation with explicit owner predicates on every query and a CLI harness that exits non-zero on any cross-student leak.',
      'Cut CI install footprint from ~800MB to ~90MB by moving embeddings from torch to fastembed/ONNX.',
      'Expanded the backend test suite to 561 passing tests (from 539) in the final contract week, closing grounding and ordering edge cases.',
    ],
  },
  {
    kind: 'work',
    role: 'After-Sales – Data & Automation',
    org: 'Jacto',
    period: 'Nov 2024 to Jun 2026',
    location: 'Pompeia, Brazil',
    description:
      'Global agricultural machinery manufacturer with 5,000+ employees and presence in 100+ countries.',
    highlights: [
      'Co-led the fix of wrong-part returns: ~20% (2025) → <5% (2026) → 0% in 06/2026, against a 6% Six Sigma target, with the manual approved across 150+ dealers; avoided ~R$100 to 135K in freight in 1H/2026.',
      'Automated data collection across 99 regional pages (Python, Selenium, pandas, RU→EN translation, Salesforce-ready output), saving up to 5 h/day (~25 to 100 h per collection).',
      'Audited a 13,000+ part flow (~R$6.5M/semester); the resulting manual corrected >50% of discrepancies.',
      'Reduced pending returns to ~R$120 to 250K/month (2025) and ~R$540K (1H/2026), down from millions before.',
      'Synchronized 4 systems (physical count, SAP, Salesforce, platform), cutting load time from 5 to 10 min to <1 min across 20+ validated improvements.',
      'Interpreted English-Portuguese at up to 3 international live events.',
    ],
  },
  {
    kind: 'work',
    role: 'Software Engineer – Synapse Program',
    org: 'CIAg (Grupo Jacto)',
    period: 'Feb 2024 to Oct 2024',
    location: 'Pompeia, Brazil',
    description:
      'Agro-innovation center of Grupo Jacto; Synapse is its applied-AI program for faculty and students.',
    highlights: [
      'Led a 2 to 3 developer team building an LLM assistant with contextual RAG for faculty and students (Python, FastAPI, OpenAI API).',
      'Built the REST layer between the app and the model.',
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
      'Co-authored a paper accepted and presented as a poster at the 17th International Conference on Precision Agriculture and the 11th ConBAP, Porto Alegre, July 2026 (abstract #14064).',
      'Volunteer researcher on a FAPESP-funded research project (grant 2024/00985-1), the state research foundation of São Paulo.',
      'Placed 3rd out of more than 1,300 entries at the 16th FETEPS 2025, a large state science and technology fair.',
      'Languages: Portuguese (native) · English (professional working proficiency).',
    ],
  },
];
