---
title: "Isobar"
tagline: "Daily temperature forecasts for 211 countries, and a lesson about weak baselines."
domain: "Forecasting"
kind: "personal"
metric: "0.24°C"
metricLabel: "RMSE at 24h, against 0.31°C for persistence"
problem: "Frost warnings and irrigation timing hang on short-term temperature. I wanted a pipeline that forecasts daily mean temperature per country and, more than that, one where I could say honestly how much better it was than doing nothing clever."
constraints: "Country-level daily means, so the series is smooth and heavily autocorrelated. Roughly 133,000 rows, which is small: this was never a scale problem, it was a measurement problem. And the output had to be inspectable, because a forecast nobody can interrogate does not get used."
approach: "I started with Prophet as the baseline and beat it by a wide margin, which felt good for about a day. Then I added persistence (tomorrow equals today) and seasonal climatology, and persistence alone came in at 0.31°C. That reframed the whole project: Prophet has no autoregressive lags, so beating it by 75% mostly proved that lags matter on an autocorrelated series. The real work became beating persistence, which LightGBM on lag and calendar features does, narrowly."
alternatives: "Reporting the Prophet comparison as the headline was tempting and would have been the better-looking number. I dropped it because it flatters the model rather than describing it. I also tested ARIMA and SARIMA; they landed between the two baselines and did not earn a place in the blend."
result: "0.24°C RMSE at a 24-hour horizon on the held-out year, against 0.31°C for persistence and 0.77°C for Prophet. That is a 23% improvement over the baseline that actually matters, not the 75% over the one that does not. Error varies a lot by country: under 0.15°C in the tropics, over 0.6°C in continental interiors, and I report the distribution rather than the mean alone."
evaluation: "Strictly temporal split: train through the end of year one, test on year two, no shuffling. Ensemble weights were fitted on a validation slice carved from the training window, never on the test year. Baselines (persistence, seasonal climatology, Prophet) run through the same split and the same metric. SHAP attributions come from the training fit."
retrospective: "Two years is a short record, and one held-out year is one draw: I have no confidence interval on that 0.24°C. Country-level means also hide the thing a farmer cares about, which is the local minimum overnight, not the national average. And there is no serving layer, so a forecast happens when I run the pipeline."
roadmap: "Rolling-origin evaluation for an honest interval, then station-level data for at least one country."
stack: ["Python", "LightGBM", "Prophet", "ARIMA/SARIMA", "scikit-learn", "SHAP", "Parquet", "pandas"]
repoUrl: "https://github.com/example/isobar"
demoUrl: ""
period: "2025"
featured: true
order: 2
---
