/**
 * About section content.
 * Decoupled from the component so copy edits never touch markup
 * (matches the src/data/*.ts pattern used across the site).
 *
 * Copy here is synced with CONTENT-SOURCE.md. The order is field, then where
 * the field was learned, then how the work is actually done. It deliberately
 * recaps no project: the Work index sits directly above this section and the
 * stack renders directly beside it, so repeating either here read as padding.
 */
import { site } from './site.ts';

export const about = {
  paragraphs: [
    'I am an AI Engineer. I build retrieval-augmented and agentic language-model systems in Python, and applied computer vision that runs on the device rather than in a data center. The common thread is not the model. It is everything placed around the model so that someone can act on what it says.',
    'My field is agriculture, and that is where I learned the engineering. A year and a half at Jacto, one of the world\'s largest manufacturers of agricultural machinery, put me next to after-sales operations at industrial scale and taught me to read a problem from the field before reaching for a model. I finish a technology degree in Big Data for Agribusiness at Fatec Shunji Nishimura in November 2026.',
    'I work at Unipac on an internal platform that turns an approved product specification into a working application through seven specialist agents and thirteen deterministic verifiers. Most of my time there goes to the part after the model works: containment, verification, and the boundaries that decide what generated code is allowed to reach.',
    'The same holds in the research and the personal work. A confidence score is only useful if a non-expert can read it at a glance. A safety threshold is worth what the sweep behind it is worth, not what it feels like it should be. A number is worth what its dataset, its split and its baseline make it worth, which is why every record on this page states all three.',
    'That includes retracting my own results. When an evaluation of mine turned out to be scoring itself, the figures came down and the explanation stayed up. The records here carry the withdrawals next to the results, because a reader who checks should find the same answer I did.',
    'I am looking for remote and international AI Engineer roles where domain understanding and production engineering are both part of the job.',
    'Away from the keyboard: technical deep-dives (O\'Reilly, Manning), Formula 1, and learning out loud in developer communities.',
  ],

  facts: [
    {
      label: 'Based in',
      value: 'Marília, São Paulo, Brazil (GMT-3) · remote-ready, open to relocation',
    },
    {
      label: 'Education',
      value: 'Technology degree (CST) in Big Data for Agribusiness, Fatec Shunji Nishimura (2026)',
    },
    {
      label: 'Focus',
      value: 'RAG · LLM agents · agent safety & evaluation · applied ML · computer vision',
    },
    { label: 'Email', value: site.email },
  ],

  /**
   * Heading for the compact stack line. The technologies themselves come from
   * `skills.ts`; each one also appears inside the record of the project that
   * used it, which is where it carries context.
   */
  stackLabel: 'Stack',
} as const;
