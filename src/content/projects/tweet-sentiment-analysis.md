---
title: "Tweet Sentiment, Tuned for the Mess of Real Tweets"
tagline: "A sentiment pipeline built for messy real tweets, with the slow preprocessing rebuilt in Rust to run about 42 times faster."
domain: "NLP & LLMs"
problem: "Sentiment analysis means automatically judging whether a piece of text is positive, negative or neutral. The catch is that most ready-made sentiment tools are trained on clean, formal writing and quietly fall apart on tweets, where slang, mentions, hashtags and emojis break the assumptions they were built on. This project builds a sentiment pipeline tuned for exactly that informal, noisy text."
constraints: "The cleaning of tweets had to be correct down to individual emojis, which are easy to corrupt when a program splits text the wrong way. The preprocessing had to be fast enough to handle a million or more tweets, not just a small sample. And any claim of improvement needed a measured starting point to beat, rather than a vague before and after."
approach: "I started from RoBERTa, a language model for understanding text, in a version already specialized for Twitter, and first measured its accuracy out of the box to set an honest baseline. Then, because the Python cleaning step is the bottleneck at large volumes, I rebuilt that step a second time in Rust, a language known for speed and safety, and proved it produces byte-for-byte the same output as the original Python."
alternatives: "Keeping all the preprocessing in Python was simpler and would have been fine for a demo, but it would not hold up at a million tweets, which is the entire point. A generic, non-Twitter sentiment model was the other obvious starting point, but I rejected it because it ignores precisely the slang and emoji patterns that carry the sentiment in tweets."
result: "Out of the box, the model scores 0.71 macro F1 on a test set of 12,284 tweets. Macro F1 is an accuracy measure where 1.0 is perfect and each sentiment class counts equally, and this score is the bar the fine-tuned version has to clear. The Rust cleaning tool runs about 42 times faster than the Python version on 100,000 tweets, with its output verified to match the original exactly. Both the Python and Rust test suites pass, and the code is public."
retrospective: "The fine-tuning run that should beat the 0.71 baseline is still ahead, along with batch processing for very large volumes and a small hosted demo. So the honest headline today is the measured baseline and the speed work, not a final accuracy number, and the project is labelled that way."
stack: ["Python", "Rust", "HuggingFace Transformers", "RoBERTa", "Polars", "Rayon", "scikit-learn", "PyTorch"]
repoUrl: "https://github.com/LukeSantossz/tweet-sentiment-analysis"
demoUrl: ""
period: "2025"
featured: true
order: 3
---
