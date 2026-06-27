/**
 * About section content.
 * Decoupled from the component so copy edits never touch markup
 * (matches the src/data/*.ts pattern used across the site).
 */
import { site } from './site.ts';

export const about = {
  paragraphs: [
    "I'm an AI/ML Engineer bridging two worlds that rarely meet: the commercial reality of global agriculture and the engineering of modern machine learning systems.",
    "I study Big Data for Agribusiness at Fatec Shunji Nishimura (graduating December 2026) and work at Jacto, one of the world's largest manufacturers of agricultural machinery, an experience that taught me to read a problem from the field before reaching for a model.",
    "That perspective shapes what I build. My flagship project, VisioSoil, runs computer vision on-device (Flutter + TensorFlow Lite) for soil analysis; it placed 3rd at FETEPS 2025 among 1,300+ submissions and was accepted for poster presentation at ICPA/ConBAP 2026.",
    "Beyond agriculture, I work across the modern AI stack: retrieval-augmented generation with LangGraph and Qdrant, hallucination detection via semantic entropy, and sentiment pipelines on RoBERTa. I also contribute to open source, including an accepted fix in AutoMQ.",
    "I'm now focused on remote and international ML / AI Engineer roles, where real domain understanding meets production-grade engineering.",
    "Off the keyboard: technical deep-dives (O'Reilly, Manning), Formula 1, and learning out loud in developer communities.",
  ],
  facts: [
    { label: 'Based in', value: 'Marília, São Paulo, Brazil' },
    { label: 'Education', value: 'B.Tech in Big Data for Agribusiness, Fatec (2026)' },
    { label: 'Focus', value: 'LLM agents · RAG · computer vision · NLP · MLOps' },
    { label: 'Email', value: site.email },
  ],
} as const;
