/**
 * The stack rendered in About, grouped into five thematic blocks.
 *
 * Grouped rather than flat on the argument in the positioning method: a
 * labelled set shows curation, a flat list of everything shows its absence.
 * The blocks and their contents mirror the SKILLS section of the audited CV,
 * so a recruiter reading both finds the same claim twice rather than two
 * different ones. Twenty-five entries, which is the ceiling.
 *
 * This is still an index, not evidence: every entry also appears inside the
 * record of the project that used it, which is where it carries context.
 */
export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Python', 'SQL', 'TypeScript', 'Rust', 'Dart'],
  },
  {
    label: 'LLM, RAG & agents',
    items: [
      'RAG',
      'LangGraph',
      'LangChain',
      'Agent orchestration',
      'LLM-as-judge evaluation',
      'Semantic entropy',
      'Embeddings',
    ],
  },
  {
    label: 'ML',
    items: ['PyTorch', 'HuggingFace Transformers', 'scikit-learn', 'TensorFlow Lite'],
  },
  {
    label: 'Backend & data',
    items: ['FastAPI', 'PostgreSQL', 'pgvector', 'Qdrant', 'Polars'],
  },
  {
    label: 'Cloud & practices',
    items: ['Docker', 'GitHub Actions', 'pytest', 'Test-driven development'],
  },
];
