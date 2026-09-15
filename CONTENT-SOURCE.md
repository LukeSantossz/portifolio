# Content source

The canonical copy for this site, written 15 September 2026.

Every number here is traceable to `brand/4-auditoria/evidencias.md` in the career material
repository, which classifies each claim as Confirmed, Partial or To validate. Nothing on this
page is estimated. When the two repositories disagree, the audit wins and this file is wrong.

**Structure.** The seven sections below follow the global positioning method in
`brand/5-referencia/method.md`: header, summary, key achievements, experience, projects,
skills, education. That ordering is deliberate. Recruiters read top down and stop when they
lose interest, so measurable proof comes before detailed history and education goes last.

**Copy rules.** Public copy uses plain punctuation: no em or en dashes, no entities, no
contractions. Section labels are words, not ordinals. See `AGENTS.md`.

**How to use this file.** Each section names the file that consumes it. Apply a section by
editing that file, not by importing this one; this document is the source of record, not a
runtime dependency.

---

## Divergences this file corrected

**Applied on 15 September 2026.** `src/data/experience.ts`, `src/data/about.ts`,
`src/data/site.ts` and `public/my_resume.pdf` were updated, `npm run check` passed with zero
errors and `npm run build` completed. The table is kept as the record of what moved and why,
not as an outstanding task list.

| Where | Was | Now | Why |
|---|---|---|---|
| `experience.ts` Unipac | "AI Engineer Intern", "Feb 2026 to Present (part-time)" | "Software Engineer, AI and Data", "Sep 2026 to Present" | Role and start date were standardised on 10 September 2026. The earlier internship is omitted everywhere by your decision. No employment type is marked on any role |
| `experience.ts` Unipac | "principal author of a 103,000-line Python service held to 3,397 automated tests" | Structural magnitudes: seven specialist agents, thirteen deterministic verifiers | Two separate problems. Authorship labels are out of the public material entirely, and a suite of that size read against a declared tenure of weeks is the first arithmetic a recruiter does. Both numbers remain Confirmed in the audit and return when the declared date supports them |
| `experience.ts` PM Accelerator | "AI Engineer Intern", "May 2026 to Jul 2026" | "AI Engineer", "Jun 2026 to Aug 2026" | Dates corrected by you on 28 August 2026 |
| `experience.ts` PM Accelerator | "Authored roughly 42% of the backend", "largest single contributor" | Removed | Participation percentages measure your slice of a system, not the system. Removed from all public material at your request |
| `experience.ts` PM Accelerator | "854 automated tests" | "1,149 automated tests at a ratio above 1.75 to 1" | Superseded measurement |
| `experience.ts` Jacto | "Nov 2024 to Sep 2026", "closing July 2026 at 0%" | "Nov 2024 to Jun 2026", "closing June 2026 at 0%" | The timeline fixed on 10 September 2026 ends Jacto in June 2026. The site currently overlaps Jacto and Unipac by three months and dates the Six Sigma close one month late |
| `experience.ts` | CIAg absent | Present, fourth entry | One of the four roles is missing from the timeline. It is the earliest LLM work and the site does not show it |
| `about.ts` | "work at Jacto", present tense | Unipac, present tense | Jacto ended June 2026 |
| `about.ts` | "B.Tech in Big Data for Agribusiness" | "Technology degree (CST)" | The Brazilian qualification is a CST, a short cycle applied technology degree. Rendering it as B.Tech overstates it to a reader who checks |

**Second pass, same day.** Five more items, each of which was left open above rather than
missed.

| Where | Was | Now | Why |
|---|---|---|---|
| `experience.ts` Unipac | No volume figure on the pipeline, no test count on the release gate | "generated 20+ applications end to end"; "locked by 32 contract tests" | Both are in the audited CV that this site serves at `/my_resume.pdf`. Carried across on your decision of 15 September 2026, against the recommendation to leave the first one out |
| `about.ts` facts | "Fatec (2026)" | "Fatec Shunji Nishimura (2026)" | Open item 2 is a disagreement between three sources about which institution this is. The site should name it in full so the comparison can be made |
| `skills.ts` | Flat array of 26 | Five labelled blocks, 25 entries | Section six below, resolved as Option B on 15 September 2026 |
| `src/content/projects/` | Four records | Five, AutoMQ added | Section five below, resolved on 15 September 2026 |
| `sections.ts` | "Four systems" | "Five records" | Follows from the row above. "Record" is also the more accurate word: AutoMQ is a fix inside a system someone else owns, not a system |

The project case studies in `src/content/projects/` need no correction. They already carry the
retracted figures honestly: 28.5 times rather than 42, the 0.887 against 0.584 pairing, the
four withdrawn weather metrics, and no soil accuracy claim. The earlier note in the career
repository saying otherwise was stale.

---

## Section one: Header

**Consumed by `src/data/site.ts`.**

| Field | Value |
|---|---|
| `name` | Lucas Gonçalves |
| `role` | AI Engineer |
| `headline` | Applied machine learning, anchored in real-world agriculture. |
| `availability` | Marília, Brazil (GMT-3) · Remote · Open to international |
| `email` | lucassg2015@gmail.com |
| `github` | https://github.com/LukeSantossz |
| `linkedin` | https://www.linkedin.com/in/lucas-gonçalvessz/ |

`headline` stays as published. It states the work and claims nothing, which is what a hero
line should do, and the agriculture anchor is the differentiator no other candidate in the
pile has.

`availability` keeps Marília as residence. The roles below are located in Pompeia, where the
employers are. That is not a contradiction and needs no note on the page.

**SEO, rewritten.** The current `seoDescription` says "Big Data student at Fatec, building
toward remote/international AI roles", which leads with what you are studying rather than what
you have built.

```
seoTitle: 'Lucas Gonçalves · AI Engineer'

seoDescription:
  'AI Engineer working on retrieval-augmented and agentic LLM systems, applied
   machine learning and on-device computer vision. Published precision-agriculture
   research, an open-source contribution to a Kafka-compatible streaming platform,
   and case studies that publish their own retractions. Open to remote and
   international roles.'
```

**Hero proof strip.** The three published numbers are correct and well chosen. Keep them.

| Value | Defended by |
|---|---|
| 3rd of 1,300+ | 16th FETEPS 2025, paper at ICPA/ConBAP 2026 |
| +51.9% | 0.887 macro F1 against a 0.584 frozen-features baseline |
| 372 tests | 89.8% branch coverage on the FAPESP-funded agent |

---

## Section two: Summary

**Consumed by `src/data/about.ts`, first two paragraphs.**

The method asks for technical specialties, at least two impact metrics, and the next career
objective, in dense text with no filler.

> I am an AI Engineer bridging two worlds that rarely meet: the commercial reality of global
> agriculture and the engineering of modern machine learning systems. I build
> retrieval-augmented and agentic LLM systems in Python, and applied computer vision that runs
> on the device rather than in a data centre.
>
> I work at Unipac on an internal platform that turns an approved product specification into a
> working application through seven specialist agents and thirteen deterministic verifiers, and
> I study Big Data for Agribusiness at Fatec Shunji Nishimura, graduating in November 2026.
> Before that, two years at Jacto, one of the world's largest manufacturers of agricultural
> machinery, taught me to read a problem from the field before reaching for a model.

**Remaining paragraphs**, revised from what is published:

> That perspective shapes what I build. VisioSoil runs computer vision on the device itself
> (Flutter and TensorFlow Lite) to read soil texture from a photograph with no signal in the
> critical path. It placed 3rd at the 16th FETEPS 2025 among more than 1,300 submissions, and
> the paper was published and presented as a poster at ICPA/ConBAP 2026.
>
> Beyond agriculture I work across the modern AI stack: retrieval-augmented generation with
> LangGraph, Qdrant and pgvector, hallucination scoring through semantic entropy, and
> multi-agent orchestration behind deterministic safety gates. Most of what I find interesting
> is the part after the model works: the containment, the verification, and the tests that stop
> a good result from quietly rotting.
>
> I also contribute to open source, including an accepted fix in AutoMQ, a Kafka-compatible
> streaming platform, where a six-line guard against a crash shipped with 157 lines of tests
> behind it.
>
> I am now focused on remote and international AI Engineer roles, where real domain
> understanding meets production-grade engineering.
>
> Off the keyboard: technical deep-dives (O'Reilly, Manning), Formula 1, and learning out loud
> in developer communities.

**Facts block:**

| Label | Value |
|---|---|
| Based in | Marília, São Paulo, Brazil (GMT-3) · remote-ready, open to relocation |
| Education | Technology degree (CST) in Big Data for Agribusiness, Fatec Shunji Nishimura (2026) |
| Focus | RAG · LLM agents · agent safety and evaluation · applied ML · computer vision |
| Email | lucassg2015@gmail.com |

---

## Section three: Key achievements

**Not currently rendered as its own section.** The hero proof strip carries three numbers, and
the method treats key achievements as a distinct block of the three largest measurable
results. These are the three, should the section ever be built. All three are already defended
elsewhere on the site, so adding the block duplicates rather than extends.

1. **Calibrated an LLM agent's domain gate and loop bounds from measurement rather than
   intuition.** A sweep over 120 labelled questions set a 0.80 threshold at 96.7 percent true
   positives against 3.3 percent false positives, and twelve instrumented runs derived the step
   and token budgets. The evidence is committed as a fixture, so three tests fail the build if
   any default drifts away from what was measured.

2. **Cut the incorrect field-parts return rate from around 20 percent in 2025 to under 5
   percent in 2026**, closing June 2026 at zero against a 6 percent Six Sigma target, which
   removed recurring freight costs across a network of more than 150 dealerships.

3. **Improved sentiment classification to 0.887 macro F1 against a 0.584 frozen-features
   baseline**, a 51.9 percent relative gain concentrated in the rarest classes, reached by
   per-class error analysis after the first fine-tuning run came out worse than its starting
   point.

---

## Section four: Experience

**Consumed by `src/data/experience.ts`.** Most recent first. Each highlight leads with its
outcome. No role carries an employment type or a seniority marker, by decision of
10 September 2026. Role titles follow the convention `Role, Area`.

### Software Engineer, AI and Data · Unipac · Sep 2026 to Present

Unipac is a packaging and polymer processing manufacturer. The work is an internal AI platform
that turns an approved product specification into a working full-stack application, built
around a pipeline of specialist agents.

- Built an internal multi-agent platform that turns an approved product specification into a
  working full-stack application, orchestrating seven specialist agents through a coordinator
  that delegates rather than writes code. It has generated 20+ applications end to end, each
  submitted to thirteen deterministic verifiers before release.
- Took approval authority away from the language model: the security verdict derives from
  deterministic scanner receipts produced in a short-lived isolated virtual machine and tied to
  a checksum of the delivered code, applied by a pure function the pipeline cannot bypass and
  locked by 32 contract tests, so a model cannot sign off on its own output.
- Ran every piece of generated code inside a per-job micro virtual machine with its own kernel
  rather than a normal container, on the reasoning that code written by a model is untrusted
  input. The stronger isolation also measured faster than starting a container per command.
- Designed a seven-layer containment stack for runaway agent behaviour, each layer added in
  response to a real incident, including one tool called 72 times in a loop and a job stalled
  for 30 minutes because each re-delegation reset its own budget.
- Closed a path that was shipping prompts, specifications and error traces containing
  authorization headers to a third-party service in clear text.

> Note: "principal author of a 103,000-line Python service held to 3,397 automated tests" is
> out, both parts. Authorship labels are out of the public material, and the suite size read
> against a declared tenure that begins in September 2026 invites an arithmetic question with
> an uncomfortable answer. The numbers are Confirmed in the audit and return when the declared
> date supports them.
>
> The 20+ generated applications and the 32 contract tests went in on 15 September 2026 at your
> direction. The recommendation here was to leave the 20+ out, since it meets the same tenure
> arithmetic that removed the other two. The counter-argument, which is yours, is that the CV
> this site serves already publishes it, and a site quieter than its own résumé is the stranger
> artefact. The 32 contract tests measure the gate rather than the elapsed time and carry none
> of that problem.

### AI Engineer · PM Accelerator · Jun 2026 to Aug 2026

An early-stage US ed-tech startup building an AI-powered college-advising platform. Worked on
the retrieval and grounding core, owning the retrieval, prompt, conversation and routing
services.

- Built the hybrid retrieval engine from scratch with no RAG framework over a corpus of roughly
  1,800 US institutions, ranking exact institution-name matches above vector similarity on
  purpose, because someone who types a school name wants that school and blending the two
  scores buries it.
- Attacked hallucination structurally rather than through prompt wording: the system refuses
  before spending an API call when nothing was retrieved, and a verifier re-reads each answer
  for figures no source record supports, including one institution's statistic quoted under
  another institution's name.
- Enforced per-student data isolation with an explicit predicate on every query after finding
  that database-level row security was bypassed by the service connection, and guaranteed
  coverage with a test that reads the source code itself and fails the build if any
  student-scoped query lacks an isolation case.
- Grew the backend suite to 1,149 automated tests at a test-to-code ratio above 1.75 to 1, and
  cut the continuous-integration install from roughly 800MB to 90MB by serving the same
  embedding model through a lighter runtime.
- Delivered 19 of 29 tracked workstream items on a weekly cadence inside a globally distributed
  team spanning multiple time zones, coordinating asynchronously through written specifications
  and alignment checkpoints.

### After-Sales, Data and Automation · Jacto · Nov 2024 to Jun 2026

Jacto is a Brazilian manufacturer of agricultural machinery that sells in more than 100
countries and employs over 3,000 people, with after-sales operations at industrial scale. The
work sat where the business side meets engineering.

- Cut the rate of incorrectly returned field parts from around 20 percent in 2025 to under 5
  percent in 2026, closing June 2026 at zero against a 6 percent Six Sigma target, which
  removed recurring freight costs from returns that should never have shipped.
- Automated a previously manual data migration: extracted hundreds of dealership address
  records from a foreign government address-classification system, transliterated and cleaned
  them by region, and produced load-ready files for Salesforce, removing up to five hours a day
  of manual collection and spreadsheet formatting.
- Designed a computer-vision system (now in internal review) that audits discarded parts end to
  end: it checks each photo meets the standard, reads the printed slip and cross-checks it
  against the system record, and recognizes the part, paired with an in-app camera that locks
  file names and stamps time and location so the evidence holds up.
- Found 10+ usability problems as the business-to-developer bridge on an internal parts-return
  tool, validating rule changes across testing rounds, moving the workflow from manual entry to
  mostly review.
- Audited 150+ main dealerships at home and abroad, reconciling the field-parts return flow and
  tracking millions of reais in parts movement, through audits done both on site and remotely.

### Software Engineer, Synapse Program · CIAg · Feb 2024 to Oct 2024

A regional innovation program. The work was an internal natural-language assistant over a
domain-specific knowledge base.

- Led development of a natural-language assistant built on a language model (Python, FastAPI,
  OpenAI API) with contextual retrieval, keeping answers grounded in a region-specific
  knowledge base.
- Designed the REST API layer connecting the application to the language model, covering
  request handling and integration with the retrieval step.

> Note: this role carries no magnitude. The audit asked for the size of the knowledge base and
> the number of users on 10 September 2026 and the answer was that you do not recall, with no
> accessible repository to measure. Rather than estimate, it ships without a number.

### Education entry

**Technology degree (CST) in Big Data for Agribusiness · Fatec Shunji Nishimura, Pompeia, São
Paulo · 2024 to Nov 2026**

A public applied-technology degree. Coursework covers machine learning, artificial
intelligence, data structures, databases (SQL and NoSQL), APIs and microservices, cloud
architecture, and statistics.

- Co-authored a paper published and presented as a poster at the 17th International Conference
  on Precision Agriculture and the 11th ConBAP, Porto Alegre, July 2026 (abstract #14064).
- Volunteer researcher on a FAPESP-funded research project (grant 2024/00985-1), the state
  research foundation of São Paulo.
- Placed 3rd out of more than 1,300 entries at the 16th FETEPS 2025, a large state science and
  technology fair.
- Languages: Portuguese (native) · English (B2, upper-intermediate).

---

## Section five: Projects

**Consumed by `src/content/projects/`.** The published case studies are accurate and need no
edit. Listed here for completeness, with the headline number each one defends.

| Project | Metric | Domain |
|---|---|---|
| SmartB100 | 372 tests, 89.8% coverage | LLM agents and RAG |
| VisioSoil | 3rd of 1,300+ | Computer vision |
| tweet-sentiment-analysis | +51.9% macro F1, 28.5 times faster preprocessing | NLP and LLMs |
| weather-forecast | 1e-6 browser parity, four metrics self-retracted | Data engineering and MLOps |
| AutoMQ | PR #3261 merged, 157 lines of tests for a 6-line fix | Distributed systems and open source |

**Two candidates, one now published.** AutoMQ shipped as a record on 15 September 2026.
my-framework was held back: a full case study is a writing job rather than a synchronisation
pass, and it can be decided on its own.

**my-framework** (`github.com/LukeSantossz/my-framework`, MIT). An engineering standards
framework that activates written standards inside AI coding agents: spec-gated design, tiered
review, one-command adoption, reused as a Git submodule across five repositories. Its
pre-push cross-provider review gate is a pluggable adapter chain with a three-state exit-code
protocol that distinguishes "reviewed" from "unavailable", covered by 101 shell tests using
failure injection. It stores only the name of the environment variable holding the reviewer
API key, never the value.

**AutoMQ** (`github.com/AutoMQ/automq`, PR #3261, merged). An accepted fix to a cloud-native
Kafka-compatible streaming platform: response-size validation in the router's response handler
so a request and response count mismatch completes pending requests with a server error instead
of raising an index exception. 157 lines of unit tests alongside a six-line fix.

The argument that carried AutoMQ: every other published record is Python or Dart, so the set
read narrower than the work, and nothing on the site showed a change landing in a codebase
someone else owns and reviews. The record states plainly that it is a small fix and what it
does not demonstrate, and it makes no frequency claim about the mismatch, because none was
measured. my-framework would bring Bash on the same argument and is still unpublished.

---

## Section six: Skills

**Consumed by `src/data/skills.ts`.** **Resolved on 15 September 2026 as Option B.**

The file used to ship a flat array of 26 entries and documented itself as "an index, not
evidence". That was accurate and it was still the wrong shape: `method.md` section six asks
for five thematic blocks totalling 20 to 25, on the argument that grouping shows curation and
a flat pile shows its absence.

It now ships five blocks and 25 entries, mirroring the SKILLS section of the audited CV, so a
recruiter reading the site and the résumé finds the same claim twice rather than two different
ones.

```
Languages
  Python, SQL, TypeScript, Rust, Dart

LLM, RAG & agents
  RAG, LangGraph, LangChain, agent orchestration, LLM-as-judge evaluation,
  semantic entropy, embeddings

ML
  PyTorch, HuggingFace Transformers, scikit-learn, TensorFlow Lite

Backend & data
  FastAPI, PostgreSQL, pgvector, Qdrant, Polars

Cloud & practices
  Docker, GitHub Actions, pytest, test-driven development
```

**What went in:** LangChain, PostgreSQL, pgvector, embeddings, agent orchestration,
LLM-as-judge evaluation, semantic entropy and test-driven development. All eight are in the
CV and none of them were on the site.

**What came out:** statsmodels, SHAP, uv, Next.js, LightGBM, pandas, Ollama, Flutter,
mypy and ruff. Each appears in exactly one project record and nowhere else, and the records
still list them, which is where they carry context.

**The one deliberate departure from the CV is Dart**, which the CV's Languages block does not
carry. VisioSoil is the one published record written in it, and an index that omits the
language of a published case study reads narrower than the work. That is also the sixth cut
this file previously called a judgement call worth making deliberately rather than by
arithmetic, and it is made here: Flutter went, Dart stayed, and TensorFlow Lite carries the
on-device side in the ML block.

The About markup reuses the label-and-value rhythm of the facts list directly above it, so the
two read as one spec sheet rather than two unrelated blocks.

## Section seven: Education

Covered in section four, where the timeline renders it. The method places education last and
minimal, which the current implementation already does.

---

## Open items this file does not close

1. ~~**The résumé served at `/my_resume.pdf`.**~~ **Closed on 15 September 2026.** The file was
   replaced with `brand/1-curriculos/CV-Lucas-Goncalves-Resumido.pdf`, the audited two-page
   version that is regenerated from source and checked for page count, dashes and ATS text
   extraction on every build. The replaced file was dated 14 August 2026, predated every
   correction, and was verified before replacement to still publish: **205 automated tests at
   roughly 83 percent coverage** (measured since at 372 and 89.8), **roughly 42 times Python
   throughput** (retracted in the project's own decision record; the valid figure is 28.5 times
   on a million rows), **a 0.71 baseline** (a third-party zero-shot score on 1,000 samples,
   removed outright), **0.19°C RMSE across 211 countries** (withdrawn for data leakage), the
   phrase **"Sole developer"**, and **"Intern"** in role titles. It also renders the headline as
   "AI/ML Engineer" against the site's "AI Engineer".

   Four of those numbers are contradicted by case studies published on this same site, one
   click away. The weather-forecast record exists specifically to explain why 0.19°C was
   withdrawn, and the PDF linked from the hero still asserts it. A visitor who opens both finds
   the author retracting a number in one tab and claiming it in the other.

   The previous file remains recoverable in Git history at commit `d4bc726`. The served
   résumé now carries the same headline as the site and none of the retracted figures.

2. **The published LinkedIn declares a different institution.** It says Faculdade de Tecnologia
   de São Paulo (FATEC-SP), the capital campus, while every other source says Fatec Shunji
   Nishimura in Pompeia. They are different institutions. The site, the CV and the profile
   should agree before a recruiter checks all three.

3. **The LinkedIn location field reads "Estados Unidos"** against a site that says Marília and
   a CV that says Brazil. Of the three, only one can be right on a profile a recruiter uses to
   judge work eligibility.

4. **The 0.887 against 0.584 pairing is Partial in the audit**, because the notebook outputs
   are not committed by repository convention. It now appears in the hero proof strip, in the
   About copy and in a case study. Re-running notebook 06 and committing the evidence closes
   the only headline number on this site that cannot be re-opened by a reader.

5. **FAPESP grant 2024/00985-1 is To validate.** It does not appear anywhere in the
   repositories and it is published in three places. Have the confirmation to hand.
