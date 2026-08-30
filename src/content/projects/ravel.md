---
title: "Ravel"
tagline: "A retrieval service that scores how much to trust its own answers."
domain: "Retrieval · Uncertainty"
kind: "personal"
metric: "0.81 AUROC"
metricLabel: "confidence score separating right answers from wrong ones"
problem: "Field technicians need answers that are buried in dense equipment manuals. A normal chatbot will occasionally invent one and state it with exactly the confidence it uses when it is right, which is the worst way to fail when someone is about to act on it. Ravel answers only from a fixed set of manuals, and every answer carries a number saying how much to trust it."
constraints: "No budget for paid inference, so everything runs on self-hosted open models. It has to work without reliable internet, because that is the environment it is used in. And the trust signal has to mean something to a technician, not to a developer."
approach: "I built the confidence score on semantic entropy, following Farquhar et al. (Nature, 2024). It samples ten answers to the same question, clusters them by bidirectional entailment using a DeBERTa NLI model, and takes the entropy over those clusters, normalized by log(k) so the score falls between 0 and 1. The retrieval side is unremarkable on purpose: Qdrant, FastAPI, Ollama serving Llama 3.1 8B."
alternatives: "A binary hallucination flag was the fast option. I dropped it because it collapses the thing the user actually needs, which is how unsure the system is: a shaky answer and a solid one look identical under a flag. Hosted frontier models with their own guardrails were the other route, and they broke both hard constraints at once."
result: "The score separates correct from incorrect answers at 0.81 AUROC. At the operating threshold I chose (0.35), it catches 78% of wrong answers and sends 12% of correct ones for review, which is the trade-off I wanted: over-flagging is cheap here, and a confident wrong answer is not. The whole thing runs offline with no paid API."
evaluation: "220 questions written against the manuals, with answers checked by hand, held out from anything used to tune retrieval. AUROC is computed over that set. I also report the trivial baseline (the model's own stated confidence, 0.58 AUROC) because self-reported confidence is what this replaces. No calibration curve yet; the score is a ranking signal, not a probability, and I say so in the UI."
retrospective: "Sampling ten times per question means ten times the generation cost, so this is not something you put in front of high traffic without rethinking it. Clustering degrades badly on very short answers, where two different answers often entail each other trivially. And 220 hand-checked questions is a small evaluation set: the AUROC has a wide confidence interval, and I have not bootstrapped it."
roadmap: "Bootstrap the AUROC interval, then run a calibration pass so the number can be read as a probability."
stack: ["Python 3.12", "FastAPI", "Qdrant", "Ollama", "Llama 3.1 8B", "DeBERTa NLI", "Docker", "pytest"]
repoUrl: "https://github.com/example/ravel"
demoUrl: ""
period: "2024 to 2026"
featured: true
order: 1
---
