---
title: "SmartB100: A RAG Agent for Agronomy That Knows When to Doubt Itself"
tagline: "A research assistant for agronomy that scores how much to trust each answer, runs with no paid API, and works with no connection."
domain: "LLM Agents & RAG"
metric: "205 tests"
metricLabel: "~83% coverage · FAPESP-funded RAG agent"
problem: "Field technicians and farmers need answers that are buried in dense technical manuals. A normal chatbot will sometimes invent an answer and state it with the same confidence it shows when it is right, which is the worst possible failure when someone is about to act on it in the field. The system answers questions from a fixed set of trusted manuals (a technique called retrieval-augmented generation, where the model reads from real documents instead of guessing). It was built as a research project funded by FAPESP, the São Paulo state research foundation and one of the main public funders of science in Brazil."
constraints: "There was no budget for paid AI services, so the whole thing had to run on free, self-hosted models. It had to keep working without reliable internet, since that is where it is used. And every answer needed a trust signal that a non-expert could read at a glance, not a yes or no flag meant for a developer."
approach: "Instead of a simple right or wrong flag, I built a confidence detector based on a 2024 paper in the journal Nature (Farquhar et al.). It asks the model the same question several times, groups the answers that mean the same thing, and measures how much they disagree, turning that disagreement into a single confidence score from 0 to 1. Answers also adapt to whether the reader is a beginner or a specialist, and the system is built on FastAPI, Qdrant and Ollama, which are open tools for serving the model and searching the documents."
alternatives: "A plain binary hallucination flag was the quick option, but it tells the user nothing about how unsure the system is, so a shaky answer looks identical to a solid one. The other option was to lean on a paid hosted model with its own guardrails. I rejected that because it broke both the no-paid-service and offline requirements, and it would have tied a public research project to a recurring bill it cannot guarantee paying."
result: "A working system that ships a continuous 0 to 1 confidence score with every answer, runs fully offline with no paid API, and is held to a production bar: 205 automated tests at roughly 83 percent coverage, strict type checking and linting in the build pipeline, and a packaged deployment with health checks and log rotation. The full source, tests and evaluation pipeline are public in the repository."
retrospective: "The confidence check costs more compute because it generates several answers per question, so accuracy and speed pull against each other. I deliberately put it behind a clean boundary so it can be split off and scaled on its own later, but for heavy traffic that trade-off would need a real rethink."
stack: ["Python 3.12", "FastAPI", "Qdrant", "Ollama", "Gradio", "Docker", "GitHub Actions", "pytest / mypy --strict"]
repoUrl: "https://github.com/LukeSantossz/sb100_agents"
demoUrl: ""
period: "2025-2026"
featured: true
order: 1
---
