---
title: A RAG agent that knows when it is unsure
description: Retrieval-augmented generation is easy to demo and hard to trust. Here is how I made a question-answering agent score its own confidence, and stay quiet when the context does not support an answer.
pubDate: 2026-06-24
tags: ['RAG', 'LLM', 'Evaluation']
draft: false
---

Most retrieval-augmented generation (RAG) demos answer every question with the
same unbroken confidence, whether the retrieved context actually contains the
answer or not. That is fine for a demo and dangerous for anything real: a system
that cannot say *"I do not know"* will happily invent a citation.

While building a FAPESP-funded question-answering agent, the requirement was
inverted from the start: a wrong answer costs more than a missing one. So the
agent had to estimate, for every response, how well the retrieved context
supported it, and abstain below a threshold.

## The confidence signal

The confidence score is not the model's self-reported certainty (models are
famously miscalibrated about that). It is built on semantic entropy, following
Farquhar et al.: ask the model the same question several times, group the
answers that mean the same thing, and measure how much those groups disagree.
Agreement on one meaning is a context that pins the answer down. Disagreement
spread across several meanings is the warning sign, and that spread collapses
into a single score from 0 to 1 that a non-expert can read at a glance.

The thresholds around it are measured rather than guessed. A sweep over 120
labeled questions set the topic filter at 96.7 percent true positives against
3.3 percent false positives, and twelve instrumented runs set the step and
token ceilings. That calibration is committed as a fixture, so three tests fail
the build if a default ever drifts away from what was measured.

Below the threshold, the agent returns a short *"I could not find enough to
answer that confidently"* instead of a fabricated paragraph.

## Why abstention is a feature

The instinct is to treat abstention as failure, a question the system "could not
answer." In practice it is the opposite: every abstention is a caught error that
would otherwise have shipped as a confident hallucination. That makes the rate
at which a system abstains a number worth watching in its own right, and it
belongs beside whatever answer-quality score the system eventually publishes,
not behind it.

The lesson generalizes past RAG. Any system that produces answers should also
produce a defensible estimate of how much to trust them, and be allowed to
withhold. Read more about the wider project in the
[case studies](/#work) section.
