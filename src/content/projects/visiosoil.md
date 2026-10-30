---
title: "VisioSoil: Reading Soil Texture From a Photo, Offline"
tagline: "Reads soil texture from a photo on the phone itself, tagged with its location, with no signal needed. Placed 3rd of more than 1,300 entries at a state science fair."
domain: "Computer Vision"
kind: "research"
metric: "3rd / 1,300+"
metricLabel: "16th FETEPS 2025 · ICPA/ConBAP 2026 poster"
problem: "Soil texture, the mix of sand, silt and clay, drives real decisions about irrigation and planting. Reading it normally means a lab sample or a specialist, and on a large farm with no signal neither happens, so most fields are never assessed. VisioSoil classifies soil texture from a single photo, on the phone."
constraints: "It had to work with no internet whatsoever, because that is exactly where it is needed. It had to run on an ordinary phone rather than a server. And the reading had to be trustworthy, since a soil measurement is only useful if you also know where it was taken and whether the photo was good enough to judge."
approach: "The v2.0.0 classifier uses 26 descriptors computed on the device, with image resampling byte-for-byte identical to Pillow so the Dart and Python implementations process the same input consistently. Classification runs offline on the phone, and readings are stored locally with their GPS location."
alternatives: "A cloud service classifying on a server was simpler, but it fails the moment the signal drops, which is most of the time in the field. A storage abstraction in between means adding optional sync later does not mean rewriting the app. The photo-quality check could have lived only in the app, but the same rule governs which photos enter the dataset, so I wrote it in both languages and locked them to a shared reference file that fails both test suites if they ever disagree."
result: "The project placed 3rd out of more than 1,300 entries at the 16th FETEPS 2025, the Centro Paula Souza technology fair, and the paper was accepted and presented as a poster at the 17th ICPA and 11th ConBAP in Porto Alegre, July 2026. Version v2.0.0 ships the offline capture, classify and store workflow, backed by 992 Dart tests, 810 Python tests, an 8-job CI pipeline and 28 architecture decision records (ADRs)."
evaluation: "Verification covers the current descriptor-based classifier with 992 Dart tests and 810 Python tests, including image resampling that is byte-for-byte identical to Pillow. An 8-job CI pipeline checks the implementation, and 28 ADRs document engineering decisions. These are engineering checks, while the competition placement and conference poster are external recognition; none is a measure of classifier accuracy."
retrospective: "The app expects a different number of categories than the next model will produce, so wiring a trained model in and letting it read its own labels at startup is the main open thread. I also audited the delivered photo archive and found it was not shot on a fixed rig as assumed, with scale varying by a factor of 2.6 across images, which retired an earlier design decision outright."
stack: ["Flutter", "Dart", "scikit-learn", "Riverpod", "Drift/SQLite"]
repoUrl: "https://github.com/LukeSantossz/visiosoil-app"
demoUrl: ""
period: "2025-2026"
featured: true
order: 2
---
