---
title: "Global Temperature Forecasting That Never Bets on One Model"
tagline: "Forecasts daily temperature across 211 countries to within about 0.19°C, using a blend of models so it never bets everything on one."
domain: "Data Engineering & MLOps"
problem: "Frost warnings, irrigation timing and energy demand all hang on short-term temperature forecasts. The trouble is that most forecasting pipelines stake everything on a single model and have nothing to fall back on when that model has a bad day. This pipeline forecasts daily temperature across 211 countries and is built so one weak model cannot sink the whole forecast."
constraints: "The data was large and messy: more than 133,000 daily readings, full of outliers and gaps. The result had to be explainable rather than a black box, so a person could see why a forecast came out the way it did. And any claim about accuracy had to be measured against a credible public baseline, not simply asserted."
approach: "Rather than pick one model and hope, I tested five different forecasting approaches against the same baseline and then combined the strongest ones into a weighted blend, giving more influence to the more accurate models. The baseline to beat was Prophet, an open-source forecasting tool from Meta. Accuracy is reported as RMSE, a standard error measure in degrees Celsius where a lower number is better."
alternatives: "Shipping the single best model on its own would have shown the lowest error on paper, but it leaves no cushion for the day that model misbehaves, so I traded a sliver of accuracy for a blend that does not depend on any one model. The classic statistical models, ARIMA and SARIMA, were tested too, but they trailed the modern models on this data and were left out of the final blend rather than carried along for show."
result: "The best single model reached 0.19°C average error (RMSE), about 75 percent lower than the Prophet baseline at 0.77°C. The blended version sits at 0.24°C, giving up a little accuracy in exchange for not depending on any single model. Unusual readings are caught two independent ways, and each forecast is explained with a method called SHAP that shows which inputs drove it. The test suite passes and the build is green; the full pipeline is public."
retrospective: "It was validated on a two-year window, so the honest next step is testing it on data outside that range before trusting it further. It also needs a serving layer so forecasts can be produced on a schedule or on demand rather than run by hand."
stack: ["Python", "LightGBM", "ARIMA/SARIMA", "Prophet", "scikit-learn", "SHAP", "PyArrow/Parquet", "pandas"]
repoUrl: "https://github.com/LukeSantossz/weather-forecast"
demoUrl: ""
period: "2025"
featured: true
order: 4
---
