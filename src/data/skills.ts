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
    items: ['Python', 'SQL', 'Dart'],
  },
  {
    category: 'Data & ML',
    items: [
      'pandas',
      'NumPy',
      'scikit-learn',
      'PyTorch',
      'TensorFlow Lite',
      'LightGBM',
      'ARIMA/SARIMA',
      'Prophet',
    ],
  },
  {
    category: 'AI / LLM',
    items: [
      'RAG',
      'LangGraph',
      'Qdrant',
      'Ollama',
      'HuggingFace Transformers',
      'RoBERTa',
      'Semantic Entropy',
      'Gradio',
      'FastAPI',
    ],
  },
  {
    category: 'Automation & Data Eng',
    items: ['ETL pipelines', 'Google Earth Engine', 'REST APIs', 'Parquet/PyArrow', 'SQLite/Drift'],
  },
  {
    category: 'Tools & Cloud',
    items: ['Docker', 'GitHub Actions (CI)', 'Git', 'Flutter', 'Riverpod', 'Google Cloud Platform'],
  },
];
