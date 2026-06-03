---
title: "VisioSoil: Reading Soil Texture From a Photo, Offline"
tagline: "Reads soil texture from a photo on the phone itself, tagged with its location, with no signal needed. Placed 3rd of more than 1,300 entries at a state science fair."
domain: "Computer Vision"
problem: "A soil's texture is its mix of sand, silt and clay, and it drives real decisions about irrigation and planting. Reading it normally means sending a sample to a lab or calling in a specialist, and on a large farm with no phone signal neither of those happens, so most fields are never assessed at all. VisioSoil classifies soil texture from a single photo, right on the phone."
constraints: "It had to work with no internet whatsoever, because that is exactly where it is needed. It had to fit and run on an ordinary phone rather than a server. And the reading had to be trustworthy, since a soil measurement is only useful if you also know exactly where it was taken."
approach: "I run the image model fully on the device using TensorFlow Lite, which is Google's tool for running models on phones, on a compact network called MobileNetV2 that is designed to be light enough for mobile hardware. It was trained in two stages for accuracy. The classification runs in a background thread so the screen never freezes, and every reading is saved on the phone together with its GPS location, behind a storage layer that does not care whether the data later syncs to a server."
alternatives: "The simpler path was a cloud service that does the classification on a server, but that fails the moment the signal drops, which is most of the time in the field. The other shortcut was to save readings straight into a fixed database. I put a storage abstraction in between instead, so adding optional cloud sync later does not mean rewriting the app."
result: "The classifier placed 3rd out of more than 1,300 entries at FETEPS 2025, a large science and technology fair run by the São Paulo State technical school system, and the full research paper was accepted at ICPA 2026 and the 17th ConBAP, an international precision-agriculture conference. The app ships the complete offline loop of capture, classify and store, with an automated build that runs analysis, tests and a full app package."
retrospective: "The model that won the competition is not yet the one shipped inside the app. Wiring the production model in, and letting it read its own labels from a config file at startup, is the main open thread. The storage abstraction already leaves room for the remote sync a multi-device rollout would need."
stack: ["Flutter", "Dart", "TensorFlow Lite", "MobileNetV2", "Riverpod", "GoRouter", "Drift/SQLite", "geolocator"]
repoUrl: "https://github.com/LukeSantossz/visiosoil-app"
demoUrl: ""
period: "2025-2026"
featured: true
order: 2
---
