/**
 * About section content.
 * Decoupled from the component so copy edits never touch markup
 * (matches the src/data/*.ts pattern used across the site).
 */
import { site } from './site.ts';

export const about = {
  paragraphs: [
    "I'm an AI Engineer bridging two worlds that rarely meet: the commercial reality of global agriculture and the engineering of modern machine learning systems.",
    "I study Big Data for Agribusiness at Fatec Shunji Nishimura (graduating November 2026) and work at Jacto, one of the world's largest manufacturers of agricultural machinery, an experience that taught me to read a problem from the field before reaching for a model.",
    "That perspective shapes what I build. VisioSoil runs computer vision on-device (Flutter + TensorFlow Lite) for soil analysis; it placed 3rd at the 16th FETEPS 2025 among 1,300+ submissions, and the paper was published and presented as a poster at ICPA/ConBAP 2026.",
    "Beyond agriculture, I work across the modern AI stack: retrieval-augmented generation with LangGraph, Qdrant and pgvector, hallucination detection via semantic entropy, and multi-agent orchestration with deterministic safety gates. Most of what I find interesting is the part after the model works — the containment, the verification, and the tests that stop a good result from quietly rotting.",
    "I also contribute to open source, including an accepted fix in AutoMQ, a Kafka-compatible streaming platform, where a six-line guard against a crash shipped with 157 lines of tests behind it.",
    "I'm now focused on remote and international AI Engineer roles, where real domain understanding meets production-grade engineering.",
    "Off the keyboard: technical deep-dives (O'Reilly, Manning), Formula 1, and learning out loud in developer communities.",
  ],
  facts: [
    { label: 'Based in', value: 'Marília, São Paulo, Brazil (GMT-3) · remote-ready, open to relocation' },
    { label: 'Education', value: 'B.Tech in Big Data for Agribusiness, Fatec (2026)' },
    { label: 'Focus', value: 'RAG · LLM agents · agent safety & evaluation · applied ML' },
    { label: 'Email', value: site.email },
  ],
} as const;
