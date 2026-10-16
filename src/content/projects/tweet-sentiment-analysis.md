---
title: "When Fine-Tuning Made It Worse: Diagnosing a Failed Training Run"
tagline: "A fine-tuning run that came out worse than its starting point, the error analysis that explained why, and the pivot that turned it into a 51.9% gain."
domain: "NLP & LLMs"
kind: "personal"
metric: "+51.9% macro F1"
metricLabel: "after diagnosing a failed run · 28.5× faster Rust preprocessing"
problem: "Most ready-made sentiment tools are trained on clean, formal writing and quietly fall apart on tweets, where slang, mentions, hashtags and emojis break the assumptions they were built on. I set out to fine-tune a language model for exactly that noisy text, and the first attempt failed in an interesting way."
constraints: "Any claim of improvement needed a measured starting point that was actually fair, not a number borrowed from someone else's published results. The cleaning had to be correct down to individual emojis, which are easy to corrupt when a program splits text the wrong way. And it had to be fast enough for a million tweets, not a sample."
approach: "I started from RoBERTa in a version already specialized for Twitter and fine-tuned it. It came out 2.72 percent worse than the baseline. Rather than tuning settings until the number moved, I ran a per-class error analysis and found the cause: the starting model had already been trained on this exact task, so training it again on the same data only overfit it. I wrote that up as a decision record weighing five alternatives, then switched to a task-agnostic starting model and a different classification task. Separately, I rebuilt the Python cleaning step, the bottleneck at volume, in Rust and proved output parity."
alternatives: "The tempting move after a bad result is to keep adjusting the learning rate and batch size, but that treats a structural problem as a tuning problem and would have burned days. Comparing against the starting model's own published score was the other shortcut, and a score published by a model's authors is not a baseline you earned; the honest comparison is a classifier trained on the frozen model's features, which is what I used."
result: "After the pivot, the fine-tuned model reaches 0.887 macro F1 against a frozen-features baseline at 0.584 on a 12,284-row test split, a 51.9 percent relative gain concentrated in the rarest categories. The effect of balancing those categories was reported as a controlled with-and-without ablation, not assumed. The Rust cleaning tool runs 28.5 times faster than the Python version on a million rows, 33.1 seconds down to 1.2, with output parity checked at three sizes. The failed run is kept under a release tag rather than deleted."
evaluation: "Macro F1 weights every category equally regardless of frequency, which is why the gain concentrates in the rarest ones. One preprocessing contract is shared by the training tokenizer, the baseline, batch inference and the Rust tool, with byte-identical fixtures in both languages, so none of the four can drift apart unnoticed."
retrospective: "The first attempt is the most useful part of this project, and I left it visible on purpose. I also retired the older speed figures once a change to the cleaning contract made them no longer apply, rather than leaving a flattering number the code no longer earned. The training outputs are not committed, so the reported scores rest on the recorded runs rather than on artifacts a reader can re-open."
stack: ["Python", "Rust", "HuggingFace Transformers", "RoBERTa", "Polars", "Rayon", "scikit-learn", "PyTorch"]
repoUrl: "https://github.com/LukeSantossz/tweet-sentiment-analysis"
demoUrl: ""
period: "2025"
featured: true
order: 3
---
