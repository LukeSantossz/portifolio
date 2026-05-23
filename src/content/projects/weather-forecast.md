---
title: "Global Temperature Forecasting Pipeline"
tagline: "0.19°C RMSE across 211 countries — a statistical + ML ensemble for agricultural climate planning"
domain: "Data Engineering & MLOps"
problem: "Accurate short-term temperature forecasts are critical for agriculture (frost/heat alerts, irrigation scheduling) and energy demand planning, but most production pipelines rely on single-model approaches with no robustness mechanism."
approach: "End-to-end pipeline over 133K+ daily observations across 211 countries. Compared five approaches (Prophet baseline, ARIMA, SARIMA, LightGBM, GradientBoosting), then combined the best performers in an inverse-RMSE weighted ensemble. Added dual anomaly detection via Z-score and Isolation Forest, with 219 agreed anomalies identified across both methods."
result: "0.19°C RMSE (LightGBM) — a 75% improvement over the Prophet baseline. The weighted ensemble (LightGBM 0.455, GradientBoosting 0.415) adds risk diversification at marginal accuracy cost. 37 tests passing with an active CI pipeline."
stack: ["Python", "LightGBM", "ARIMA/SARIMA", "Prophet", "scikit-learn", "PyArrow/Parquet", "pandas", "Jupyter"]
repoUrl: "https://github.com/LukeSantossz/weather-forecast"
demoUrl: ""
period: "2025"
featured: true
order: 1
---
