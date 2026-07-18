---
title: Forecasting temperature across 211 countries
description: A single global model beat per-country Prophet baselines by roughly 75% on average error. The interesting part was not the architecture. It was refusing to train 211 separate models.
pubDate: 2026-05-12
tags: ['Forecasting', 'Time Series', 'MLOps']
draft: false
---

The brief looked deceptively simple: forecast average temperature for 211
countries. The obvious first move, one Prophet model per country, is also the
one that quietly wastes most of the signal in the data.

## Why one model per country is a trap

Fitting 211 independent models feels safe because each one only has to learn one
place. But temperature is not 211 unrelated problems. Neighboring countries share
seasons; the northern and southern hemispheres are mirror images; coastal and
continental climates rhyme. A per-country model throws all of that shared
structure away and re-learns seasonality from scratch on whatever short, noisy
history each country happens to have.

It is also an operational headache: 211 models to retrain, monitor, and version.

## A single global model

Instead, one model saw every country at once, with the country identity and a
few static geographic features (latitude, hemisphere, a coarse climate zone) as
inputs. That let the model **borrow strength**: a data-rich country's clean
seasonal signal informs a data-poor neighbor's forecast.

The result: average error of **0.19°C**, about **75% lower** than the tuned
per-country Prophet baseline, from *one* artifact instead of 211.

- One training run, one model to monitor.
- New countries get a reasonable forecast on day one, before they have much
  history, because the global patterns already apply.
- Seasonality is learned once and shared, not re-estimated 211 times.

## The takeaway

Before reaching for "a model per entity," ask what the entities share. When they
share a lot, and geography almost always does, a single model that is *told*
which entity it is looking at will usually beat a fleet of specialists, and it is
far less to operate. Details are in the
[case studies](/#projects).
