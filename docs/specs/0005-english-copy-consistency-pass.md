# SPEC: fix(content): one English, checked by a gate

## Problem

Public copy on this site is written in two Englishes at once. Seven words use British
spellings (`data centre`, `behaviour`, `labelled`, `artefacts`, `artefact`, `serialise`,
`standardisation`) while the surrounding copy uses American ones (`specialized`,
`optimizer`, `recognizes`, `analysis`), the document declares `lang="en"` and post dates
are formatted `en-US`. The audience is US and international recruiters, so the mix reads
as unproofed rather than as a dialect choice.

Three further defects sit in the same copy:

- The download control is labelled `Résumé` in four places while the file it serves is
  `/my_resume.pdf`, so the label and the artifact disagree. The accented spelling is
  correct English and renders correctly (no mojibake in `dist/`), but it is the only
  accented loanword in the interface, it is set in uppercase mono at `0.2em` tracking,
  and it invites the half-accented `Resumé` on the next edit.
- One hero proof line is ungrammatical: "Macro-F1 gain after a fine-tuning run came out
  worse than its baseline" drops the relative pronoun, so the sentence says the gain came
  out worse.
- `about.ts` closes on "Off the keyboard:", which is not an English idiom.

Nothing enforces the copy rules that `AGENTS.md` already states (no em or en dashes, no
contractions, plain punctuation), so each of these was reachable and none was caught.

## Design Decision

Normalise every piece of public copy to American English, label the download `Resume` so
it matches `my_resume.pdf`, fix the two grammar defects, and add
`scripts/check-copy.mjs`: a build-time gate that fails on British spellings, on `Résumé`,
on em and en dashes and on dash entities in `src/data/`, `src/content/` and the `.astro`
files. The gate is the test for this change and the regression guard afterwards, which is
what ADR-0001 asks for when a static site has a rule but no way to check it.

## Alternatives Considered

- **Keep `Résumé` and fix only the dialect mix.** Rejected: the label would still
  disagree with the filename it downloads, and the accent would still be the one piece of
  typographic ornament in an interface whose own rule strips ornament.
- **Standardise on British English instead.** Rejected: `lang="en"`, the `en-US` date
  format and the majority of existing spellings are already American, and the stated
  target is US and international roles. Fewer edits and no contradiction with the markup.
- **Fix the copy and add no gate.** Rejected: the rule is already written in `AGENTS.md`
  and was already violated. A rule nothing checks is what produced this spec.
- **Run a spellchecker (cspell) in CI.** Rejected: a new dependency and a dictionary to
  maintain, to catch a closed list of seven words plus two punctuation marks. A 60-line
  script with no dependency covers the stated rules exactly.

## Scope

- Includes:
  - `src/data/about.ts`: `data centre` to `data center`; `Off the keyboard:` to
    `Away from the keyboard:`.
  - `src/data/site.ts`: the hero stat grammar fix; `Open to international` to
    `Open to international roles`; the `résumé` code comment.
  - `src/data/experience.ts`: `behaviour` to `behavior`.
  - `src/content/projects/smartb100-rag-agent.md`: `labelled` to `labeled`.
  - `src/content/projects/tweet-sentiment-analysis.md`: `artefacts` to `artifacts`.
  - `src/content/projects/weather-forecast.md`: `artefact` to `artifact`, `serialise` to
    `serialize`, `standardisation` to `standardization`.
  - `src/components/layout/Nav.astro` (x2), `src/components/sections/Hero.astro`,
    `src/components/layout/MobileActionBar.astro`: `Résumé` to `Resume`.
  - `src/pages/blog/index.astro`: `résumé` to `resume`, and the dead `/#projects` anchor
    in `src/content/blog/a-rag-agent-that-knows-when-it-is-unsure.md` to `/#work`, which
    the editorial restructure orphaned.
  - New `scripts/check-copy.mjs`, wired as `npm run check:copy` and run from `check`.
- Does NOT include:
  - The `my_resume.pdf` file itself, its contents, or its path.
  - Contractions inside quoted model output in the blog post, which are quotations.
  - Any layout, token, component structure or schema change.
  - The unused `kind` and `evaluation` fields, the Writing/Blog label split, and the
    semantic-entropy contradiction between the blog post and the project record. All
    three are recorded in the review that accompanies this change and none is an English
    defect.
  - `README.md`, `CLAUDE.md`, `AGENTS.md`, `docs/`: repository documents, not site copy.

## Acceptance Criteria

- `copy_gate_fails_first`: `npm run check:copy` exits non-zero on the current tree and
  names all seven British spellings and all five `Résumé` occurrences.
- `copy_gate_passes_after`: `npm run check:copy` exits 0 once the copy is corrected.
- `one_dialect`: grepping public copy for the British forms returns nothing.
- `label_matches_artifact`: every download control reads `Resume` and points at
  `/my_resume.pdf`.
- `hero_stat_parses`: the second hero stat is a grammatical sentence.
- `no_dead_anchor`: no link in `src/content/` targets a section id that
  `src/pages/index.astro` does not render.
- `build_succeeds`: `npm run build` exits 0.
- `typecheck_clean`: `npm run check` reports 0 errors.
- `no_visual_change`: no class, token or element changes; the diff is text and one new
  script.

## Reproducibility

`node scripts/check-copy.mjs` on Node 22, from a clean tree. `npm run check` then
`npm run build`.

## Risks and Assumptions

- Risk: the gate rejects a legitimate future word (a quoted British source, a proper
  name). Mitigated by matching whole words from a closed list and by the gate naming the
  file and line, so an exception is a one-line edit to the list with a reason.
- Assumption: American English is the right target, on the evidence of `lang="en"`, the
  `en-US` dates, the existing majority spelling and the stated US and international
  audience.
