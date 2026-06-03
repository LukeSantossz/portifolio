---
title: "Tweet Sentiment Pipeline"
tagline: "A Twitter-tuned RoBERTa pipeline with a Rust preprocessing CLI measured at ~42x Python throughput on 100K tweets."
domain: "NLP & LLMs"
problem: "Off-the-shelf sentiment models break on informal text. Slang, mentions, hashtags, and emojis violate the assumptions baked into models trained on formal corpora, and they fail quietly."
approach: "An NLP fine-tuning pipeline around cardiffnlp/twitter-roberta-base-sentiment on the TweetEval benchmark, with a 6-function tweet-cleaning module (URLs, mentions, hashtags, emojis) covered by 21 Python tests. I first established a zero-shot baseline as the target to beat, then built a high-throughput Rust preprocessing CLI (Rayon parallelism, Polars I/O) that mirrors the Python reference and is measured at ~42x its speed at 100K tweets, with output parity validated via grapheme-cluster emoji handling."
result: "A zero-shot baseline of 0.71 macro F1 (70% accuracy) over the 12,284-sample test split sets the bar for the fine-tuning run. The Rust CLI delivers a ~42x measured speedup at 100K tweets for 1M+ workloads, with 7 passing Rust tests alongside the Python suite."
roadmap: "Execute the GPU fine-tuning run and beat the 0.71 baseline, add batch inference for 1M+ tweets, and ship a FastAPI + Gradio demo in Docker."
stack: ["Python", "Rust", "HuggingFace Transformers", "RoBERTa", "Polars", "Rayon", "scikit-learn", "PyTorch"]
repoUrl: "https://github.com/LukeSantossz/tweet-sentiment-analysis"
demoUrl: ""
period: "2025"
featured: true
order: 3
---
