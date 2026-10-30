---
title: "Weather Forecasting, and the Leak I Found in My Own Results"
tagline: "A forecasting pipeline whose headline numbers I withdrew after finding the evaluation had been scoring itself, plus a scikit-learn model ported to the browser and proven equivalent to within 1e-6."
domain: "Data Engineering & MLOps"
kind: "personal"
metric: "1e-6"
metricLabel: "browser-vs-Python parity · 3 metrics self-retracted"
problem: "Frost warnings, irrigation timing and energy demand all hang on short-term temperature forecasts. I built a pipeline over more than 151,000 raw readings from 211 countries, aggregated into one global daily-mean series, and first reported an accuracy figure that turned out to be wrong. How I found out is the useful part of this record."
constraints: "The dashboard had to be a static site with no server behind it, yet a visitor still had to run the project's real anomaly model on their own inputs. Any accuracy claim had to survive someone checking it. And the data is one aggregated global daily-mean signal, which caps what can honestly be claimed from it."
approach: "I exported the fitted Isolation Forest from Python as a versioned artifact of flat arrays, then reimplemented its scoring in TypeScript over a serialized 200-tree, 23,528-node forest. The proof that the two agree is generated from the exact same fitted model the browser downloads, not a fresh retraining, so the test cannot pass by comparing two coincidentally similar models. On the forecasting side, I audited the evaluation and found two leaks: the held-out test set was serving as the early-stopping signal, so the model chose its own size against the data it would be graded on, and the ensemble weights came from that same window."
alternatives: "ONNX was the obvious route for in-browser inference, and I rejected it because Isolation Forest conversion is not reliably supported and it ships a multi-megabyte runtime for a model I can serialize and walk directly. Calling the existing Python API fails the static-site constraint outright. On the evaluation, the tempting move after a leak is to quietly fix it and republish a slightly worse number as if nothing happened. I withdrew the affected figures explicitly instead."
result: "The three leak-inflated metrics were struck from the README and replaced with the word withdrawn, and the retraction is enforced in code: the dashboard export emits a pending status with empty numeric fields, and a CI gate fails the build if retracted copy reaches the rendered HTML. The leak-free rerun reaches 0.27°C RMSE against 0.73 for ARIMA on a 30-day holdout over 151K+ rows from 211 countries. The browser anomaly checker ships entirely client-side, matched within 1e-6 on standardization and scoring."
evaluation: "Two measurements sit in this record and should not be read as one. The 1e-6 is parity between two implementations of the same fitted model, an anomaly score rather than a temperature, and says nothing about forecast accuracy. The forecast numbers come from one leakage-free evaluation over more than 151,000 raw readings from 211 countries: the final 30 days are held out and scored once, and GradientBoosting reaches 0.27°C RMSE against 0.73 for ARIMA. The withdrawn figures came from a split that was also its own early-stopping signal."
retrospective: "The series is one global daily mean, not a per-country forecast, so sub-degree error says less than it seems, and the 0.27°C figure comes from a single 30-day holdout whose variance nobody has quantified. The Prophet comparison was a separate run with different inputs, so it does not rank against the others. The open work is a multi-step recursive evaluation where every model forecasts the same way. The dashboard is deployed and runs the anomaly check client-side, so the parity claim is one a reader can exercise."
stack: ["Python", "TypeScript", "LightGBM", "scikit-learn", "statsmodels", "SHAP", "Next.js", "FastAPI", "Docker"]
repoUrl: "https://github.com/LukeSantossz/weather-forecast"
demoUrl: "https://weather-forecast-neon-iota.vercel.app"
period: "2025"
featured: true
order: 4
---
