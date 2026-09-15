/**
 * About section content.
 * Decoupled from the component so copy edits never touch markup
 * (matches the src/data/*.ts pattern used across the site).
 *
 * Copy here is synced with CONTENT-SOURCE.md. The first two paragraphs carry
 * the positioning and the proof; the rest widen it.
 */
import { site } from './site.ts';

export const about = {
  paragraphs: [
    'I am an AI Engineer bridging two worlds that rarely meet: the commercial reality of global agriculture and the engineering of modern machine learning systems. I build retrieval-augmented and agentic LLM systems in Python, and applied computer vision that runs on the device rather than in a data centre.',
    'I work at Unipac on an internal platform that turns an approved product specification into a working application through seven specialist agents and thirteen deterministic verifiers, and I study Big Data for Agribusiness at Fatec Shunji Nishimura, graduating in November 2026. Before that, two years at Jacto, one of the world\'s largest manufacturers of agricultural machinery, taught me to read a problem from the field before reaching for a model.',
    'That perspective shapes what I build. VisioSoil runs computer vision on the device itself (Flutter and TensorFlow Lite) to read soil texture from a photograph with no signal in the critical path. It placed 3rd at the 16th FETEPS 2025 among more than 1,300 submissions, and the paper was published and presented as a poster at ICPA/ConBAP 2026.',
    'Beyond agriculture I work across the modern AI stack: retrieval-augmented generation with LangGraph, Qdrant and pgvector, hallucination scoring through semantic entropy, and multi-agent orchestration behind deterministic safety gates. Most of what I find interesting is the part after the model works: the containment, the verification, and the tests that stop a good result from quietly rotting.',
    'I also contribute to open source, including an accepted fix in AutoMQ, a Kafka-compatible streaming platform, where a six-line guard against a crash shipped with 157 lines of tests behind it.',
    'I am now focused on remote and international AI Engineer roles, where real domain understanding meets production-grade engineering.',
    'Off the keyboard: technical deep-dives (O\'Reilly, Manning), Formula 1, and learning out loud in developer communities.',
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
