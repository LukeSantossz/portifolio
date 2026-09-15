---
title: "AutoMQ: A Six-Line Fix With 157 Lines of Tests Behind It"
tagline: "An accepted contribution to a Kafka-compatible streaming platform, where a count mismatch between requests and responses now fails cleanly instead of crashing the handler."
domain: "Distributed Systems & Open Source"
metric: "PR #3261"
metricLabel: "merged into AutoMQ · 157 lines of tests for a 6-line fix"
problem: "AutoMQ is a cloud-native streaming platform that speaks the Apache Kafka protocol. Its router sends a batch of client requests to a broker and matches each response back to the request waiting on it by position, which assumes the two lists are the same length. If the broker ever returned fewer responses than there were requests, the handler indexed past the end of the list and raised an IndexOutOfBoundsException inside the response path. That is the worst place to throw: the requests still waiting are never completed, and the caller is told nothing about why."
constraints: "This is someone else's codebase, with its own conventions and its own review bar, and a first contribution has no credit to spend. The change had to be small enough to review in one sitting, it had to leave the normal path untouched, and it had to prove the failure it claims to fix rather than assert it."
approach: "Validate the size of the response list before pairing anything, and when the counts do not match, complete every pending request with a server error instead of letting the index throw. The fix is six lines in the router's response handler. The tests are 157, because a guard is worth exactly what the evidence for it is worth: the interesting part of a change like this is not the six lines, it is demonstrating that the handler used to crash on the mismatch and now returns an error the caller already knows how to handle."
alternatives: "Completing only the requests that did have responses and ignoring the rest was the smaller change, and it is the worse one: it turns a loud failure into silent partial success, and leaves the caller unable to tell a completed request from a dropped one. Raising a clearer exception was the other option, but it leaves the pending requests hanging either way, which is the actual damage."
result: "Merged as PR #3261, in the router's response handler. Two files and 163 lines changed, of which 157 are tests. A request and response count mismatch now surfaces as a server error on each affected request rather than as an IndexOutOfBoundsException in the response path."
retrospective: "It is a small fix and it is worth reading as one. What it shows is not depth in distributed systems: it is landing a change in an unfamiliar Java codebase of real size, reading a failure mode out of the code rather than out of a stack trace I had been handed, and writing the evidence a maintainer would ask for before being asked. I have not measured how often the mismatch occurs in practice and I do not claim it is common."
stack: ["Java", "Apache Kafka protocol"]
repoUrl: "https://github.com/AutoMQ/automq/pull/3261"
demoUrl: ""
featured: false
order: 5
---
