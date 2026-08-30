---
title: "Coarse"
tagline: "Sentiment on noisy social text, with the preprocessing rewritten in Rust."
domain: "NLP · Systems"
kind: "personal"
metric: "6.4× faster"
metricLabel: "Rust vs. Polars, single-threaded, byte-identical output"
problem: "Off-the-shelf sentiment models are trained on clean prose and come apart on social text, where slang, mentions, and emoji carry most of the signal. I wanted a pipeline tuned for that, and a preprocessing step that would not fall over on a million documents."
constraints: "Cleaning has to be correct at the grapheme level. Emoji are trivial to corrupt if you split on the wrong boundary, and a corrupted emoji silently changes the label. Beyond that, any speed claim had to compare like with like, which turned out to be the hard part."
approach: "The model is Cardiff NLP's twitter-roberta-base-sentiment-latest, used as-is to set a baseline before touching anything. The preprocessing I wrote three times: naive pandas apply, then Polars, then Rust. Each version has to produce byte-identical output to the last, checked over the full corpus, which is what makes the comparison mean anything."
alternatives: "A generic non-social sentiment model was the obvious starting point, and I rejected it early, since the slang and emoji patterns it ignores are exactly where the signal lives. Stopping at Polars was the more reasonable engineering call, and honestly would have been enough; I went to Rust to find out how much of the remaining gap was language and how much was my Python."
result: "Rust runs 6.4× faster than Polars single-threaded on 100,000 documents, and 41× faster than the pandas `.apply()` version. That second number is the one that would have looked better on a slide, and it mostly measures how bad the naive version was. With Rayon across 8 threads it reaches 34× over Polars, but that is cores, not language, so I keep the single-threaded number as the headline."
evaluation: "Baseline accuracy is 0.71 macro F1 on the TweetEval sentiment test split, 12,284 examples. Worth stating plainly: this model was trained on TweetEval, so 0.71 is a sanity check on my inference path, not an independent measurement. The honest out-of-domain number does not exist yet, which is why no accuracy claim appears above. Speed was measured on 100,000 documents, AMD Ryzen 7 5800X, mean of 5 runs, output diffed byte-for-byte against the Polars version."
retrospective: "The fine-tune that should beat 0.71 has not happened, so this project currently has a speed result and no model result, and it is labeled that way. The contamination problem above is the more interesting gap: I need an out-of-domain labeled set before any accuracy number here means anything."
roadmap: "A hand-labeled out-of-domain set of about 2,000 documents, then the fine-tune measured against it."
stack: ["Python", "Rust", "Hugging Face Transformers", "RoBERTa", "Polars", "Rayon", "scikit-learn", "PyTorch"]
repoUrl: "https://github.com/example/coarse"
demoUrl: ""
period: "2025"
featured: true
order: 4
---
