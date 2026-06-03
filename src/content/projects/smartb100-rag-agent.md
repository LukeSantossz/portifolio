---
title: "SmartB100: FAPESP-Funded RAG Agent for Agronomy"
tagline: "A FAPESP-funded RAG system with semantic-entropy hallucination scoring, designed and built solo to a production bar."
domain: "MLOps & Agents"
problem: "Field extension workers need quick answers out of dense technical manuals. A generic chatbot will hallucinate one confidently and give you no way to tell, which is exactly the wrong failure mode for a decision made in the field."
approach: "Sole developer of a FAPESP-funded production RAG system (FastAPI + Qdrant + Ollama). Every answer is grounded in retrieved PDF content and adapts to the reader's expertise (beginner / intermediate / expert). A semantic-entropy module (Farquhar et al., Nature 2024) generates N candidate answers, clusters them by semantic similarity, and computes Shannon entropy to emit a continuous 0–1 confidence score instead of a binary flag. Multi-provider verification (Groq / Ollama / OpenRouter) keeps the whole check runnable offline, and the /chat endpoint is gated with bcrypt + JWT plus per-IP rate limiting."
result: "MVP complete and actively hardened: 205 automated tests at ~83% coverage, CI with ruff + mypy --strict, multi-stage Docker with healthchecks and log rotation, and a 5-step offline evaluation pipeline — with zero dependency on paid inference APIs."
roadmap: "Hybrid dense+sparse retrieval (RRF fusion), a LangGraph ReAct agent with an agricultural intent filter, streaming responses (SSE), and Langfuse tracing."
stack: ["Python 3.12", "FastAPI", "Qdrant", "Ollama", "Gradio", "Docker", "GitHub Actions", "pytest / mypy --strict"]
repoUrl: "https://github.com/LukeSantossz/sb100_agents"
demoUrl: ""
period: "2025–2026"
featured: true
order: 1
---
