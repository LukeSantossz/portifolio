---
title: "Fieldnote"
tagline: "Soil texture from a phone photo, offline. Useful as triage, not as a measurement."
domain: "Computer vision · On-device"
kind: "professional"
metric: "71% top-1"
metricLabel: "5 texture classes, held out by field"
problem: "Soil texture drives irrigation and planting decisions. Getting it normally means a lab sample or a specialist visit, and on a large property with no signal neither happens, so most fields never get assessed. Fieldnote gives a rough classification from one photo, on the phone, with the GPS fix attached."
constraints: "No network at all, because that is where it is used. A mid-range Android phone, not a server. And the honest constraint I hit late: a photograph carries organic matter, moisture and iron oxides far more strongly than it carries the sand-silt-clay ratio that texture actually means."
approach: "MobileNetV2 through TensorFlow Lite, int8-quantised, running off the UI thread. Trained in two stages, head first then partial unfreeze. Readings write locally with their coordinates behind a storage interface, so adding sync later does not mean rewriting the app."
alternatives: "Server-side classification was simpler and I rejected it on the offline constraint alone. Writing readings straight into a fixed local schema was the other shortcut; the interface in between cost an afternoon and has already paid for itself twice."
result: "71% top-1 across five texture classes, which is useful as a triage signal and not as a measurement. It runs in 340ms on a Moto G32, model file 3.1 MB. The app ships the whole offline loop: capture, classify, store with location."
evaluation: "1,840 photos from 23 fields, split by field rather than at random, because photos from one field are near-duplicates and a random split would have scored far higher and meant nothing. Labels come from lab texture analysis on a sample from each field, not from visual judgement. Confusion is concentrated between adjacent classes (loam and sandy loam), which is where a human is also unreliable."
retrospective: "The premise has a ceiling. Texture is a granulometric property and a photo is mostly measuring colour, so 71% may be near the limit of what RGB can do rather than a training problem. Moisture is the largest confounder: wet and dry samples of the same soil frequently land in different classes, which I have measured but not fixed. Twenty-three fields is also too few to say the model generalises to other regions."
roadmap: "A moisture-invariance test on the same soils photographed wet and dry, before adding any more training data."
stack: ["Flutter", "Dart", "TensorFlow Lite", "MobileNetV2", "Riverpod", "Drift/SQLite", "geolocator"]
repoUrl: "https://github.com/example/fieldnote"
demoUrl: ""
period: "2025 to 2026"
featured: true
order: 3
---
