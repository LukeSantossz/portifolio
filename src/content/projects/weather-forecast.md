---
title: "Weather Forecasting, and the Leak I Found in My Own Results"
tagline: "A forecasting pipeline whose headline numbers I withdrew after finding the evaluation had been scoring itself, plus a scikit-learn model ported to the browser and proven equivalent to within 1e-6."
domain: "Data Engineering & MLOps"
kind: "personal"
metric: "1e-6"
metricLabel: "browser-vs-Python parity · 3 metrics self-retracted"
problem: "Frost warnings, irrigation timing and energy demand all hang on short-term temperature forecasts. I built a pipeline over roughly 151,000 daily readings from around 200 capital-city weather stations, aggregated into one global daily-mean series, and reported that it forecast temperature to within 0.19°C. That number was wrong, and how I found out is the useful part of this record."
constraints: "The dashboard had to be a static site with no server behind it, yet a visitor still had to run the project's real anomaly model on their own inputs. Any accuracy claim had to survive someone checking it. And the data is a two-year window of one aggregated signal, which caps what can honestly be claimed from it."
approach: "I exported the fitted Isolation Forest from Python as a versioned artifact of flat arrays, then reimplemented its scoring in TypeScript over a serialized 200-tree, 23,528-node forest. The proof that the two agree is generated from the exact same fitted model the browser downloads, not a fresh retraining, so the test cannot pass by comparing two coincidentally similar models. On the forecasting side, I audited the evaluation and found two leaks: the held-out test set was serving as the early-stopping signal, so the model chose its own size against the data it would be graded on, and the ensemble weights came from that same window."
alternatives: "ONNX was the obvious route for in-browser inference, and I rejected it because Isolation Forest conversion is not reliably supported and it ships a multi-megabyte runtime for a model I can serialize and walk directly. Calling the existing Python API fails the static-site constraint outright. On the evaluation, the tempting move after a leak is to quietly fix it and republish a slightly worse number as if nothing happened. I withdrew the affected figures explicitly instead."
result: "The three leak-inflated metrics were struck from the README and replaced with the word withdrawn, and the retraction is enforced in code: the dashboard export emits a pending status with empty numeric fields, and a CI gate fails the build if retracted copy reaches the rendered HTML. The leak-free rerun puts the best model at 0.2734 RMSE, which I do not present as a win: a one-line persistence baseline scores 0.2804 and beats it on two of three error measures, so the gap is the task, not the model. The browser anomaly checker ships entirely client-side, matched within 1e-6 on standardization and scoring."
evaluation: "Two measurements sit in this record and should not be read as one. The 1e-6 is parity between two implementations of the same fitted model, an anomaly score rather than a temperature, and says nothing about forecast accuracy. The forecast numbers rest on a two-year window of roughly 151,000 daily readings from around 200 stations, scored against a one-line persistence baseline, and the withdrawn figures came from a split that was also its own early-stopping signal."
retrospective: "A two-year aggregate of two hundred stations barely moves day to day, so sub-degree error is the floor rather than an achievement. The Prophet comparison I originally published was never valid either: that baseline ran a different horizon with different inputs and was never re-run alongside the others. The open work is a multi-step recursive evaluation where every model forecasts the same way. The dashboard is deployed and runs the anomaly check client-side, so the parity claim is one a reader can exercise."
stack: ["Python", "TypeScript", "LightGBM", "scikit-learn", "statsmodels", "SHAP", "Next.js", "FastAPI", "Docker"]
repoUrl: "https://github.com/LukeSantossz/weather-forecast"
demoUrl: "https://weather-forecast-neon-iota.vercel.app"
period: "2025"
featured: true
order: 4
---
