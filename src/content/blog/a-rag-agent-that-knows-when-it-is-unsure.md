---
title: A RAG agent that knows when it is unsure
description: Retrieval-augmented generation is easy to demo and hard to trust. Here is how I made a question-answering agent score its own confidence — and stay quiet when the context does not support an answer.
pubDate: 2026-06-24
tags: ['RAG', 'LLM', 'Evaluation']
draft: false
---

Most retrieval-augmented generation (RAG) demos answer every question with the
same unbroken confidence, whether the retrieved context actually contains the
answer or not. That is fine for a demo and dangerous for anything real: a system
that cannot say *"I don't know"* will happily invent a citation.

While building a FAPESP-funded question-answering agent, the requirement was
inverted from the start — a wrong answer costs more than a missing one. So the
agent had to estimate, for every response, how well the retrieved context
supported it, and abstain below a threshold.

## The confidence signal

The confidence score is not the model's self-reported certainty (models are
famously miscalibrated about that). It is assembled from signals the pipeline
can actually observe:

- **Retrieval agreement** — how tightly the top-k chunks cluster in embedding
  space. Scattered chunks mean the question straddles topics the corpus does not
  cover well.
- **Answer groundedness** — whether each claim in the draft answer can be traced
  back to a retrieved span, checked with a second, cheaper pass.
- **Margin** — the gap between the best chunk's relevance and the next few. A
  flat distribution is a warning sign.

```python
def confidence(retrieval, answer, spans):
    agreement = 1 - normalized_spread(retrieval.embeddings)
    grounded = fraction_supported(answer.claims, spans)
    margin = retrieval.scores[0] - mean(retrieval.scores[1:4])
    return 0.5 * grounded + 0.3 * agreement + 0.2 * clamp(margin)
```

Below the threshold, the agent returns a short *"I couldn't find enough to
answer that confidently"* instead of a fabricated paragraph.

## Why abstention is a feature

The instinct is to treat abstention as failure — a question the system "couldn't
answer." In practice it is the opposite: every abstention is a caught error that
would otherwise have shipped as a confident hallucination. Tracking the
abstention rate alongside accuracy turned out to be the single most useful
number for tuning the retriever.

The lesson generalizes past RAG. Any system that produces answers should also
produce a defensible estimate of how much to trust them — and be allowed to
withhold. Read more about the wider project in the
[case studies](/#projects) section.
