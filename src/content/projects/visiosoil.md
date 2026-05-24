---
title: "VisioSoil: On-Device Soil Texture Classifier"
tagline: "A mobile app that classifies soil texture on-device, GPS-tagged, with no signal required."
domain: "Computer Vision"
problem: "Reading soil texture normally means a lab or a trained specialist. On a large property with no signal, neither is realistic, so most fields never get assessed at all."
approach: "Flutter + Dart app running on-device TensorFlow Lite inference across 12 USDA soil texture classes, trained with transfer learning on GCP. It captures a photo, records GPS coordinates, surfaces location-aware agronomic recommendations, and stores everything locally in Drift/SQLite. Classification runs in a Dart isolate so the UI never freezes, on a clean repository architecture with Riverpod and GoRouter."
result: "Took 3rd place among 1,300+ submissions at FETEPS 2025 and was accepted for poster presentation at ICPA 2026 / 17th ConBAP (abstract #14064). v2.0.0 shipped with full on-device classification."
stack: ["Flutter", "Dart", "TensorFlow Lite", "Riverpod", "GoRouter", "Drift/SQLite", "geolocator", "Python"]
repoUrl: "https://github.com/LukeSantossz/visiosoil-app"
demoUrl: ""
period: "2025–2026"
featured: true
order: 2
---
