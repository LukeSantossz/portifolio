---
title: "Global Temperature Forecasting Pipeline"
tagline: "A statistical + ML ensemble that forecasts daily temperature to 0.19°C RMSE across 211 countries."
domain: "Data Engineering & MLOps"
problem: "Frost alerts, irrigation timing, energy demand — all of it hangs on short-term temperature forecasts. Yet most pipelines bet everything on a single model and have no fallback when that model is wrong."
approach: "End-to-end pipeline over 133K+ daily observations across 211 countries. I compared five approaches (Prophet baseline, ARIMA, SARIMA, LightGBM, GradientBoosting), then combined the best performers in an inverse-RMSE weighted ensemble. Anomalies are caught two ways, with Z-score and Isolation Forest; 219 were flagged by both methods."
result: "0.19°C RMSE from LightGBM, a 75% improvement over the Prophet baseline. The weighted ensemble (LightGBM 0.455, GradientBoosting 0.415) trades a sliver of accuracy for not depending on any single model. 37 tests passing, CI green."
stack: ["Python", "LightGBM", "ARIMA/SARIMA", "Prophet", "scikit-learn", "PyArrow/Parquet", "pandas", "Jupyter"]
repoUrl: "https://github.com/LukeSantossz/weather-forecast"
demoUrl: ""
period: "2025"
featured: true
order: 4
---
