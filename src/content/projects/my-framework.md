---
# Source: LukeSantossz/my-framework README.md @ d8feba6 (2026-09-02). Every claim below is stated there:
# Go badge and "A single Go binary, mf"; "v0.8.0 is the current release"; seven gates, none calls a model;
# CI, pre-push and commit-msg hooks fail closed; 21 packages with tests; five platforms under one SHA256SUMS.
title: "my-framework: Development Standards a Binary Enforces"
tagline: "A single Go binary that checks AI coding agents against written development standards, with seven deterministic gates that call no model."
domain: "AI Guardrails & Evaluation"
kind: "personal"
metric: "7 gates"
metricLabel: "deterministic, no model called · v0.8.0 in Go"
problem: "Written standards are easy. Standards an AI coding agent actually reads, follows, and is checked against are not."
approach: "I built mf, a single Go binary, plus versioned Markdown standards. The binary reads the standards, runs three review roles (internal, cross-provider and pull request), each a chain of backends chosen in configuration and bound to no vendor, and enforces everything enforceable without a model through seven deterministic gates: spec, commit, branch, docs, records, agents and design. The gates run in CI, in a pre-push hook and in a commit-msg hook, and all three fail closed: a gate that cannot find its runner says so and stops instead of exiting zero in silence."
result: "v0.8.0 is the current release, published as stamped binaries for five platforms (Linux, macOS and Windows) under one SHA256SUMS. On a fresh clone, mf check runs the seven gates against the repository itself. The suite covers 21 packages with tests that build real repositories on disk and run real git rather than mocking it, on GitHub Actions across Linux, macOS and Windows."
evaluation: "The gates judge artifacts, not processes, because only the first is reliable without a model. Reviewer provenance is recorded per branch, so the cross-provider claim resolves to verified, declared or unknown rather than being assumed."
retrospective: "The project is still in development. mf init adopts the harness, not the forge: it does not write .github templates or workflows, and those are still copied by hand."
stack: ["Go 1.26", "TOML", "Markdown", "GitHub Actions"]
repoUrl: "https://github.com/LukeSantossz/my-framework"
demoUrl: ""
featured: true
order: 5
---
