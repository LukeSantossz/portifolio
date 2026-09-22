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

## Who it answers, and what they do next

The agent answers agronomy questions from a fixed set of trusted technical
manuals, for field technicians and farmers. Its readers are not going to open
the source PDF and check a paragraph. They are going to act on the answer, in
the field, often with no one to ask. A confident wrong answer there is not a bad
user experience, it is a bad decision someone else pays for.

Three constraints shaped everything that followed:

- **No budget for paid AI services.** Embedding, retrieval and answering had to
  run on free, self-hosted open-weight models, served through Ollama and searched
  through Qdrant behind a FastAPI service.
- **No reliable internet.** The places where the answers are needed are the
  places where the connection drops, so the pipeline had to work offline.
- **A trust signal a non-expert can read.** A developer can interpret a log line
  or a boolean flag. A farmer needs something closer to a fuel gauge.

That last constraint ruled out the quick option, a binary hallucination flag. A
flag tells the reader nothing about *how* unsure the system is, so a shaky answer
and a solid one look exactly the same until the moment the shaky one is wrong.

## The confidence signal

The confidence score is not the model's self-reported certainty (models are
famously miscalibrated about that). It is built on semantic entropy, following
Farquhar et al.: ask the model the same question several times, group the
answers that mean the same thing, and measure how much those groups disagree.
Agreement on one meaning is a context that pins the answer down. Disagreement
spread across several meanings is the warning sign, and that spread collapses
into a single score from 0 to 1 that a non-expert can read at a glance.

The grouping step is what makes this different from simply sampling and
comparing strings. Two answers can share almost no words and still say the same
thing, and two answers can differ by a single word and mean opposite things.
Counting distinct *meanings* rather than distinct *sentences* is what lets the
score track the real uncertainty instead of the model's phrasing.

The thresholds around it are measured rather than guessed. A sweep over 120
labeled questions set the topic filter at 96.7 percent true positives against
3.3 percent false positives, and twelve instrumented runs set the step and
token ceilings. That calibration is committed as a fixture, so three tests fail
the build if a default ever drifts away from what was measured.

Below the threshold, the agent returns a short *"I could not find enough to
answer that confidently"* instead of a fabricated paragraph. Above it, the answer
is adapted to the reader: a beginner and a specialist asking the same question
get the same facts, framed at different depths.

## What confidence costs

The signal is not free. Semantic entropy needs several generations per question,
so every answer costs a multiple of the compute a single pass would, and on local
hardware that shows up directly as latency. Accuracy and speed pull against each
other, and there is no setting that makes the tension go away.

The response was architectural rather than clever: the confidence check sits
behind a clean boundary, so it can be split off and scaled on its own when the
traffic justifies it, or swapped for a cheaper estimator without touching
retrieval or answering. For the current load that is enough. For heavy traffic
it would need a real rethink, and I would rather say so than pretend otherwise.

## Why abstention is a feature

The instinct is to treat abstention as failure, a question the system "could not
answer." In practice it is the opposite: every abstention is a caught error that
would otherwise have shipped as a confident hallucination. That makes the rate
at which a system abstains a number worth watching in its own right, and it
belongs beside whatever answer-quality score the system eventually publishes,
not behind it.

## What is not measured yet

Honesty about uncertainty has to apply to the write-up too. The system is held to
a production bar: 372 automated tests at 89.8 percent branch coverage of the core
packages. But that number measures the test suite, not the answers. The
evaluation harness for answer quality is built and has not been run end to end,
so there is no published accuracy figure, and I have not claimed one. The scoring
step also defaults to a hosted verifier today, which means a fully local run
requires switching that provider explicitly.

Those are the next things to close, in that order: run the evaluation, publish
the answer-quality number next to the abstention rate, and make the local
verifier the default.

## The takeaway

The lesson generalizes past RAG. Any system that produces answers should also
produce a defensible estimate of how much to trust them, and be allowed to
withhold. The model is only half of that; the other half is measuring the
thresholds, pinning them in tests, and being plain about what has not been
measured. Read more about the wider project in the
[case studies](/#work) section.
