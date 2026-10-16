---
title: "SmartB100: A RAG Agent for Agronomy That Knows When to Doubt Itself"
tagline: "A research assistant for agronomy that scores how much to trust each answer, runs on self-hosted models, and works with no connection."
domain: "LLM Agents & RAG"
kind: "research"
metric: "372 tests"
metricLabel: "89.8% branch coverage · FAPESP-funded research"
problem: "Field technicians and farmers need answers buried in dense technical manuals. A chatbot will sometimes invent one and state it as confidently as a correct one, which is the worst failure when someone is about to act on it in the field. This system answers only from a fixed set of trusted manuals, through retrieval-augmented generation, built inside a FAPESP-funded research project where I worked as a volunteer researcher."
constraints: "No budget for paid AI services, so retrieval and answering had to run on self-hosted models. It had to work without reliable internet, since that is where it is used. And every answer needed a trust signal a non-expert could read at a glance."
approach: "Rather than a right or wrong flag, I built a confidence detector on semantic entropy (Farquhar et al.): ask the model the same question several times, group the answers that mean the same thing, and turn the disagreement into one score from 0 to 1, with a similarity cache cutting that pass from quadratic to one embedding call per sample. Answers adapt to beginner or specialist readers, over FastAPI, Qdrant and Ollama. I then replaced the agent's three guessed safety limits with measured ones: a sweep over 120 labeled questions set the topic filter at 96.7 percent true positives against 3.3 percent false positives, and twelve instrumented runs set the step and token ceilings."
alternatives: "A binary hallucination flag was quicker, but it tells the reader nothing about how unsure the system is, so a shaky answer looks identical to a solid one. A paid hosted model with its own guardrails broke both the self-hosting and the offline requirement, and would have tied a public research project to a recurring bill it cannot guarantee paying."
result: "The confidence layer is implemented and calibrated rather than running in production: it ships disabled by default. With it on, every answer carries a 0 to 1 score, and embedding, retrieval and answering all run on local open-weight models. Around it sit 372 automated tests at 89.8 percent branch coverage of the core packages, strict type checking and linting in the build, and fifteen written architecture decisions. The calibration evidence is committed as a fixture, so three tests fail the build if a safety default drifts."
evaluation: "The headline measures the test suite, not the answers. The 89.8 percent is branch coverage of the core packages; the CI gate itself sits at 23 percent, with the evaluation, UI and database packages outside the measured scope. No answer-quality score appears anywhere in this record, because the evaluation harness has never been run. What is measured against data is the calibration: 120 labeled questions, twelve instrumented runs."
retrospective: "The confidence check generates several answers per question, so accuracy and speed pull against each other. It sits behind a clean boundary so it can be split off and scaled later, but heavy traffic would need a rethink. The scoring step still defaults to a hosted verifier, so a fully local run means switching that provider explicitly. The evaluation harness, five stages and 60 tests, has never been run end to end."
stack: ["Python 3.12", "FastAPI", "Qdrant", "Ollama", "LangGraph", "Docker", "GitHub Actions", "pytest / mypy --strict"]
repoUrl: "https://github.com/LukeSantossz/sb100_agents"
demoUrl: ""
period: "2025-2026"
featured: true
order: 1
---
