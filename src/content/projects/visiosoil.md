---
title: "VisioSoil: On-Device Soil Texture Classifier"
tagline: "Cross-platform mobile app for geolocated soil classification with on-device TFLite inference — no connectivity required"
domain: "Computer Vision"
problem: "Soil texture assessment in large rural properties requires lab analysis or trained specialists — neither viable in low-connectivity environments at the scale precision agriculture needs."
approach: "Flutter + Dart app with on-device TensorFlow Lite inference across 12 USDA soil texture classes. Captures a photo, records GPS coordinates, and stores records locally in Drift/SQLite. Classification runs in a Dart isolate to keep the UI responsive, on a clean repository architecture with Riverpod state management and GoRouter navigation."
result: "Accepted at ConBAP/ICPA 2026 (abstract #14064) and Top 250 at FETEPS 2025. v2.0.0 shipped with full on-device TFLite classification integrated."
stack: ["Flutter", "Dart", "TensorFlow Lite", "Riverpod", "GoRouter", "Drift/SQLite", "geolocator", "Python"]
repoUrl: "https://github.com/LukeSantossz/visiosoil-app"
demoUrl: ""
period: "2025–2026"
featured: true
order: 3
---
