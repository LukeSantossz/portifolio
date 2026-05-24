---
title: "SmartB100: FAPESP-Funded RAG Agent for Agronomy"
tagline: "A FAPESP-funded ReAct agent with hybrid retrieval and built-in hallucination scoring, designed solo."
domain: "MLOps & Agents"
problem: "Field extension workers need quick answers out of dense technical manuals. A generic chatbot will hallucinate one confidently and give you no way to tell, which is exactly the wrong failure mode for a decision made in the field."
approach: "Sole designer and developer of a FAPESP-funded research agent. A ReAct agent runs over a LangGraph state graph and drives a hybrid retrieval pipeline (Reciprocal Rank Fusion + late-interaction re-ranking) against a Qdrant vector store indexing 500+ research documents. A source-traceability layer cites where every answer comes from, and a hallucination-detection module scores reliability using semantic entropy (Farquhar et al., Nature 2024). Multi-provider dispatch (Groq / Ollama / OpenRouter) removes any hard dependency on paid APIs."
result: "MVP complete with active CI. Architecture spans retrieval, generation, verification, memory, profiling, and eval, shipped with Dockerfile and docker-compose."
stack: ["Python 3.12", "LangGraph", "FastAPI", "Qdrant", "Ollama", "HuggingFace", "Docker", "GitHub Actions"]
repoUrl: "https://github.com/LukeSantossz/sb100-agents"
demoUrl: ""
period: "2025–2026"
featured: true
order: 1
---
