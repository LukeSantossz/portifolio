/**
 * Skill groups rendered in the Skills section.
 */
export interface SkillGroup {
  category: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['Python', 'Rust', 'TypeScript', 'Dart', 'SQL'],
  },
  {
    category: 'ML & Data',
    items: [
      'PyTorch',
      'TensorFlow',
      'TensorFlow Lite',
      'LightGBM',
      'scikit-learn',
      'statsmodels',
      'HuggingFace',
      'SHAP',
      'pandas',
      'Polars',
      'NumPy',
    ],
  },
  {
    category: 'LLM & RAG',
    items: [
      'LangGraph',
      'Qdrant',
      'pgvector',
      'Ollama',
      'RAG pipelines',
      'Semantic-entropy verification',
      'FastAPI',
    ],
  },
  {
    category: 'Mobile & Backend',
    items: ['Flutter', 'Riverpod', 'Drift', 'GoRouter', 'Next.js', 'Uvicorn', 'Gradio'],
  },
  {
    category: 'Cloud & Tooling',
    items: ['GCP', 'AWS', 'Docker', 'GitHub Actions', 'Git', 'pytest', 'mypy', 'ruff', 'uv'],
  },
];
