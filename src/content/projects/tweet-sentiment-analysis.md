---
title: "Tweet Sentiment Pipeline"
tagline: "An NLP pipeline over 1.6M tweets, with a Rust CLI for preprocessing and a 0.71 macro-F1 RoBERTa baseline."
domain: "NLP & LLMs"
problem: "Off-the-shelf sentiment models break on informal text. Slang, sarcasm, and platform-specific syntax throw them off, and they fail quietly."
approach: "EDA-first pipeline over 1.6M tweets. I built a high-performance Rust CLI for preprocessing (6 cleaning functions, 11 tests, tokenization benchmarked at the 99th percentile) that cuts latency versus pure Python at batch scale, then ran a zero-shot RoBERTa baseline for classification."
result: "0.71 macro F1 on the zero-shot RoBERTa baseline, with the Rust preprocessing module delivering measurable latency reduction over Python batch workloads at scale."
stack: ["Python", "Rust", "HuggingFace Transformers", "RoBERTa", "pandas", "scikit-learn", "Jupyter"]
repoUrl: "https://github.com/LukeSantossz/tweet-sentiment-analysis"
demoUrl: ""
period: "2025"
featured: true
order: 3
---
