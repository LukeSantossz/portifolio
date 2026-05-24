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
    items: ['Python', 'Rust', 'SQL', 'Dart', 'JavaScript'],
  },
  {
    category: 'ML & Data Science',
    items: [
      'pandas',
      'scikit-learn',
      'TensorFlow',
      'Keras',
      'PyTorch',
      'OpenCV',
      'TensorFlow Lite',
      'LightGBM',
    ],
  },
  {
    category: 'AI / LLM',
    items: [
      'RAG',
      'LangChain',
      'LangGraph',
      'Qdrant',
      'HuggingFace Transformers',
      'RoBERTa',
      'FastAPI',
    ],
  },
  {
    category: 'Databases & Data Eng',
    items: ['PostgreSQL', 'MongoDB', 'Firestore', 'SQLite/Drift', 'ETL pipelines', 'Google Earth Engine'],
  },
  {
    category: 'Cloud & DevOps',
    items: ['GCP', 'Vertex AI', 'AWS', 'Docker', 'GitHub Actions (CI)', 'Git'],
  },
];
