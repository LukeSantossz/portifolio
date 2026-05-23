---
title: "SmartB100: Agricultural RAG Agent with Hallucination Scoring"
tagline: "RAG-powered Q&A for agronomy with semantic entropy to flag unreliable answers in real time"
domain: "MLOps & Agents"
problem: "Agricultural extension workers need fast, reliable answers from dense technical documents. Generic LLM chatbots hallucinate with no signal of confidence, making outputs unsafe for field decisions."
approach: "RAG pipeline built with FastAPI, Qdrant vector search and Ollama (llama3.2:3b + nomic-embed-text). Implements semantic entropy (Farquhar et al., Nature 2024): generates N candidate responses, clusters them by semantic similarity, and computes Shannon entropy for a continuous hallucination score (0.0–1.0). Response complexity adapts to three expertise levels, and a multi-provider verification dispatch (Groq / Ollama / OpenRouter) removes any hard dependency on paid APIs."
result: "MVP complete with active CI and 2 forks. Architecture spans 12 modules (retrieval, generation, verification, memory, profiling, eval) across 217 commits, shipped with Dockerfile and docker-compose."
stack: ["Python 3.12", "FastAPI", "Qdrant", "Ollama", "LangGraph", "HuggingFace", "Gradio", "Docker", "SQLite", "GitHub Actions"]
repoUrl: "https://github.com/LukeSantossz/sb100_agents"
demoUrl: ""
period: "2025–2026"
featured: true
order: 2
---
