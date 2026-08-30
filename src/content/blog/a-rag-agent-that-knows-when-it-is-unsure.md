---
title: A RAG agent that knows when it is unsure
description: Retrieval-augmented generation is easy to demo and hard to trust. Here is how I made a question-answering agent score its own confidence, and stay quiet when it should.
pubDate: 2026-06-24
tags: ['RAG', 'LLM', 'Evaluation']
draft: false
---

Most retrieval-augmented generation (RAG) demos answer every question with the
same unbroken confidence, whether the retrieved context actually contains the
answer or not. That is fine for a demo and dangerous for anything real: a system
that cannot say *"I don't know"* will happily invent a citation.

Ravel is a question-answering agent for field technicians, reading from a fixed
set of equipment manuals. I had the requirement inverted from the start: a wrong
answer costs more than a missing one. So the agent has to estimate, for every
response, how much to trust it, and abstain below a threshold.

## Not the model's own confidence

The obvious signal is to ask the model how sure it is. That does not work, and it
is worth being precise about why: a model's self-reported confidence is a token
prediction like any other, shaped by how confident the training text sounded
rather than by whether this particular answer is supported. Measured on my
evaluation set, self-reported confidence separates right answers from wrong ones
at 0.58 AUROC, which is barely better than a coin flip.

## Asking the same question ten times

The method I settled on is semantic entropy, from
[Farquhar et al. (Nature, 2024)](https://www.nature.com/articles/s41586-024-07421-0).
The intuition is that a model which knows an answer will give you the same
answer in different words, and a model which is guessing will give you different
answers.

So Ravel samples ten responses to the same question, then clusters them by
meaning rather than by wording. Two responses land in the same cluster when a
natural language inference model says each one entails the other, which is what
separates "torque to 90 Nm" and "the spec is 90 Nm" (same cluster) from "90 Nm"
and "consult the service bulletin" (different clusters).

The entropy over those clusters is the score. One dominant cluster means low
entropy and high confidence. Ten answers spread across five clusters means the
model is generating rather than recalling.

```python
def confidence(question, k=10):
    samples = [generate(question) for _ in range(k)]
    clusters = cluster_by_entailment(samples)   # bidirectional NLI
    weights = [len(c) / k for c in clusters]
    return 1 - entropy(weights) / log(len(clusters) or 1)
```

Below the operating threshold, the agent returns a short message: *"I couldn't
find enough to answer that confidently."*

## Why abstention is a feature

The instinct is to treat abstention as failure, a question the system "couldn't
answer." In practice it is the opposite: every abstention is a caught error that
would otherwise have shipped as a confident hallucination.

The abstention rate, tracked alongside accuracy, turned out to be the single most
useful number for tuning the retriever. Accuracy alone kept rewarding changes
that made the model bolder. Watching both at once showed which changes actually
improved retrieval and which ones just removed the system's doubt.

## What it costs

Ten samples per question is ten times the generation cost, and that is the real
objection to this method. It is defensible when a wrong answer is expensive, as
it is here, and indefensible under high traffic without rethinking the design.
The clustering step is also the weak link: very short answers tend to entail each
other trivially, which collapses clusters that should have stayed apart.

The lesson generalizes beyond RAG. Any system that produces answers should also
produce a defensible estimate of how much to trust them, and be allowed to
withhold them. The evaluation set, the AUROC and the threshold I chose are in the
[case studies](/#work).
