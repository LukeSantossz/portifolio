---
title: The baseline that made my forecasting result look worse
description: One global model beat per-country Prophet baselines by 69% on average error. Then I added persistence, and the honest number turned out to be 23%.
pubDate: 2026-05-12
tags: ['Forecasting', 'Time Series', 'MLOps']
draft: false
---

The brief looked deceptively simple: forecast average daily temperature for 211
countries. The obvious first move, one Prophet model per country, is also the
expensive one. It means 211 things to retrain, 211 things to monitor, and 211
opportunities for one of them to quietly rot.

## A single global model

Instead, one model saw every country at once, with the country identity and a
few static geographic features (latitude, hemisphere, a coarse climate zone) as
inputs. That let the model **borrow strength**: a data-rich country's clean
seasonal signal informs a data-poor neighbor's forecast.

- One training run, one model to monitor.
- New countries get a reasonable forecast on day one, before they have much
  history, because the global patterns already apply.
- Seasonality is learned once and shared, not re-estimated 211 times.

It came in at **0.24°C** average error against the tuned per-country Prophet
baseline at 0.77°C. A 69% improvement, from one artifact instead of 211. I was
pleased with that for about a day.

## Then I added a baseline that cost nothing

Prophet decomposes a series into trend and seasonality. What it does not have is
an autoregressive term: it never looks at yesterday's value. Country-level daily
means are smooth and heavily autocorrelated, which makes yesterday's value a
genuinely strong forecast for today.

So I added persistence. Tomorrow equals today. Four lines of code, no training.

It scored **0.31°C**.

That single number reframed the entire project. My 69% was mostly measuring the
fact that lags matter on an autocorrelated series, which is not a finding, it is
a property of the data. Against the baseline that actually deserves beating, the
model improves by **23%**, not 69%.

## Why I report the smaller number

The 69% is true. It is also the more impressive-looking number, it involves a
real and respected library, and nobody reading it would have questioned it.

It is still the wrong headline, because it flatters the model instead of
describing it. A reader who sees "69% better than Prophet" learns something
about Prophet's lack of lags. A reader who sees "23% better than persistence"
learns what the model is actually worth.

The general rule I took from this: your baseline choice decides what your result
means, and the weakest defensible baseline will always make you look best. Pick
the one that is hardest to beat, then report against it. The split, the
horizon and the per-country error distribution are in the
[case studies](/#work).
