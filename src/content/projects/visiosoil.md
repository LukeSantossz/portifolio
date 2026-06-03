---
title: "VisioSoil: On-Device Soil Texture Classifier"
tagline: "A mobile app that classifies soil texture on-device, GPS-tagged, with no signal required."
domain: "Computer Vision"
problem: "Reading soil texture normally means a lab or a trained specialist. On a large property with no signal, neither is realistic, so most fields never get assessed at all."
approach: "Cross-platform Flutter + Dart app running on-device TensorFlow Lite inference across 5 soil texture classes, behind a MobileNetV2 transfer-learning classifier trained in a reproducible two-phase pipeline on GCP. It captures a photo, records GPS coordinates with reverse geocoding, and persists everything locally in Drift/SQLite behind a repository-pattern data layer. Classification runs in a background Dart isolate so the UI never freezes, on a clean architecture with Riverpod and GoRouter."
result: "The classifier took 3rd place among 1,300+ submissions at FETEPS 2025 and the full paper was accepted for poster presentation at ICPA 2026 / 17th ConBAP (abstract #14064). v2.0.0 ships the full offline capture-classify-store loop, with CI running analyze, test, and APK build."
roadmap: "Train and ship the production model, read labels/normalization from spec.json at runtime, re-enable gallery capture, and add optional remote sync (the repository interface already leaves room for it)."
stack: ["Flutter", "Dart", "TensorFlow Lite", "MobileNetV2", "Riverpod", "GoRouter", "Drift/SQLite", "geolocator"]
repoUrl: "https://github.com/LukeSantossz/visiosoil-app"
demoUrl: ""
period: "2025–2026"
featured: true
order: 2
---
