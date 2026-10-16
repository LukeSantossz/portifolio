---
title: "VisioSoil: Reading Soil Texture From a Photo, Offline"
tagline: "Reads soil texture from a photo on the phone itself, tagged with its location, with no signal needed. Placed 3rd of more than 1,300 entries at a state science fair."
domain: "Computer Vision"
kind: "research"
metric: "3rd / 1,300+"
metricLabel: "16th FETEPS 2025 · ICPA/ConBAP 2026 poster"
problem: "Soil texture, the mix of sand, silt and clay, drives real decisions about irrigation and planting. Reading it normally means a lab sample or a specialist, and on a large farm with no signal neither happens, so most fields are never assessed. VisioSoil classifies soil texture from a single photo, on the phone."
constraints: "It had to work with no internet whatsoever, because that is exactly where it is needed. It had to run on an ordinary phone rather than a server. And the reading had to be trustworthy, since a soil measurement is only useful if you also know where it was taken and whether the photo was good enough to judge."
approach: "The model runs fully on the device through TensorFlow Lite on MobileNetV2. Classification runs in a background worker that a timeout can actually terminate, rather than one left holding the hardware after the app stopped waiting, and tensor validation rejects NaN, infinite or out-of-domain probabilities instead of surfacing a fabricated label. Every reading is saved locally with its GPS location, behind a storage layer indifferent to whether the data later syncs. Photos of one physical sample stay together so they cannot land on both sides of a train and test split, and each split carries a checksum of its dataset."
alternatives: "A cloud service classifying on a server was simpler, but it fails the moment the signal drops, which is most of the time in the field. A storage abstraction in between means adding optional sync later does not mean rewriting the app. The photo-quality check could have lived only in the app, but the same rule governs which photos enter the dataset, so I wrote it in both languages and locked them to a shared reference file that fails both test suites if they ever disagree."
result: "The project placed 3rd out of more than 1,300 entries at the 16th FETEPS 2025, the Centro Paula Souza technology fair, and the paper was accepted and presented as a poster at the 17th ICPA and 11th ConBAP in Porto Alegre, July 2026. The app ships the complete offline loop of capture, classify and store. Along the way I fixed four security defects, each closed with a decision record and a regression test, among them GPS surviving in photo metadata because a library flag is silently ignored on Android camera captures, and access tokens reaching device logs through error formatting. Six CI jobs guard it, including one that unpacks the release build to prove the optimizer kept the authentication classes."
evaluation: "Neither headline is a model measurement. The placement is a competition judgment, the poster is peer acceptance, and no accuracy figure is claimed for the classifier anywhere here, because the training pipeline has never been executed. The dataset discipline exists so a future result would hold: photos of one sample never straddle the split, each split carries a checksum of its source, and operator determinism is pinned alongside seeding so two runs can be proven comparable."
retrospective: "The app expects a different number of categories than the next model will produce, so wiring a trained model in and letting it read its own labels at startup is the main open thread. I also audited the delivered photo archive and found it was not shot on a fixed rig as assumed, with scale varying by a factor of 2.6 across images, which retired an earlier design decision outright."
stack: ["Flutter", "Dart", "TensorFlow Lite", "MobileNetV2", "Riverpod", "GoRouter", "Drift/SQLite", "geolocator"]
repoUrl: "https://github.com/LukeSantossz/visiosoil-app"
demoUrl: ""
period: "2025-2026"
featured: true
order: 2
---
