# SPEC: feat(ui): evidence-based engagement refinements for the recruiter skim

## Problem

Recruiters form a near-instant visual judgment (17-50 ms) that halos onto perceived competence and
trust, and they skim rather than read. A deep-research pass (NN/g eye-tracking; Lindgaard 2006;
Tuch & Bargas-Avila 2012; Reinecke 2013; and corrective meta-analyses on Zeigarnik/choice-overload)
identified where this portfolio can raise engagement **ethically** without adding visual noise. This
change applies the highest-confidence, lowest-risk levers and one honest "closing" trigger.

## Design Decision

Apply five research-backed refinements, preferring **reducing** complexity over adding elements
(the strongest finding is that low visual complexity maximizes appeal and the halo effect):

1. **(A) Calm the hero / above-the-fold visuals** — the single highest-leverage lever (first
   impression + aesthetic-usability halo + cognitive fluency). Temper the decorative load site-wide
   but felt most in the dense hero: lower the analog-grain opacity and soften the cursor-glow
   (smaller radius + lower alpha). The Concrete Terminal identity (ADR-0002) and the CRT overlay
   (ADR-0006) are **kept** — only their intensity is dialed down. Recorded in **ADR-0013**.
2. **(G) Front-load Experience highlights** — lead each work bullet with its outcome/number
   (F-pattern / "first 2 words" / layer-cake scanning). Pure reordering + tightening of the
   existing copy in `src/data/experience.ts` — **no new or altered factual claims**.
3. **(I) Peak-end close on Contact** — end the page with a short, confident closing line that
   restates the honest availability (`site.availability`) and points to one primary action, so the
   last thing a recruiter sees reinforces "reachable + open" (peak-end; honest availability, not a
   fake-scarcity dark pattern).
4. **(J) Single clear primary action in Contact** — frame the email link as the explicit secondary
   ("prefer email?") so the form reads as the one primary path (friction/clarity; justified by
   fluency, not by an over-claimed "choice overload law").
5. **(B) Hero headline & (E) case-study metric lead** — audited as **already satisfied** by the
   current design (the hero positioning line leads with the AI/ML specialty; `ProjectCard` already
   renders the metric as the visual hero above the title). No change beyond confirming this; noted
   so the acceptance criteria cover them.

Explicitly **out of scope / not applied now** (evidence weak or "open" in the research, and each
would add complexity): open-loop/curiosity-gap recall (debunked for memory), extra social-proof
widgets, added micro-interactions/motion, storytelling rewrites. These can be A/B-tested later,
one at a time.

## Alternatives Considered

- **Stripping the CRT overlay / grain entirely** — rejected: over-corrects; the identity is an
  asset. Dialing intensity down preserves brand while reducing complexity.
- **Rewriting the hero headline / case taglines** — rejected: they already front-load; rewriting
  would touch the author's voice/claims for no evidenced gain.
- **Adding testimonials / logos / a fake "limited slots" banner** — rejected: solo portfolio has no
  honest logos to show, and fake scarcity is a dark pattern (explicitly excluded).
- **A reading-progress / open-loop teaser to boost dwell** — rejected: the 2025 meta-analysis found
  no memory advantage; not worth the added complexity.

## Scope

- Includes:
  - `src/styles/global.css`: lower `.bt-grain` opacity (0.06 → 0.04). (A)
  - `src/layouts/Layout.astro`: soften `#cursor-glow` (radius 520 → 420px, alpha 13% → 9%). (A)
  - `src/data/experience.ts`: reorder/tighten the work `highlights` to lead with the
    outcome/number; no claim added or changed. (G)
  - `src/components/sections/Contact.astro`: add a peak-end closing line using `site.availability`
    (I); frame the email link as the explicit secondary path (J).
  - `docs/adr/0013-...md` + a README Engineering Decisions row.
- Does NOT include:
  - Any change to factual claims, metrics, or the design system/palette.
  - New dependencies, new sections, social-proof widgets, added motion, or copy rewrites of the
    hero/case studies (B/E already satisfied).
  - Removing the CRT overlay or grain (only intensity is reduced).

## Acceptance Criteria

Verified by build, type-check, the Lighthouse budget, and named manual checks (no unit harness, per
`docs/adr/0001-presentation-only-verification-policy.md`).

- `build_succeeds` / `typecheck_clean`: `npm run build` exit 0; `npm run check` 0 errors.
- `hero_calmer` (A): `.bt-grain` opacity is reduced and the cursor-glow radius/alpha are lowered;
  the CRT overlay + grain still render (identity preserved), just fainter.
- `experience_frontloaded` (G): each work highlight leads with its outcome/number; the set of facts
  is unchanged from the prior copy (reorder/tighten only).
- `contact_peak_end` (I): the Contact section ends with a closing line that restates
  `site.availability` and points to one primary action.
- `contact_single_primary` (J): the form is the visual primary; the email link is explicitly framed
  as the secondary ("prefer email?").
- `already_satisfied` (B/E): the hero positioning line leads with the specialty and `ProjectCard`
  shows the metric above the title — confirmed, unchanged.
- `no_dark_pattern`: no fake scarcity/urgency, no manufactured social proof; availability language
  is the real `site.availability`.
- `content_decoupled`: copy changes live in `src/data/*.ts` / the section component per CLAUDE.md.
- `adr_recorded`: ADR-0013 exists and is linked from the README.
- `lighthouse_budget_met`: `lighthouserc.json` still passes (a11y ≥0.95, CLS ≤0.1, perf not
  regressed).

## Reproducibility

- Build: `npm run build`; type-check: `npm run check`. No new deps.
- Visual: load `/` — the hero reads calmer (fainter grain/glow) while keeping the CRT/brutalist
  look; Experience bullets lead with numbers; the Contact section ends on the availability close.
- Reduced motion / light theme: unaffected (only opacity/copy changed).

## Risks and Assumptions

- Risk: "calmer" is subjective — the grain/glow values are single-line tunables; the user confirms
  in the browser and we adjust. Reverting is trivial.
- Risk: front-loading edits could subtly shift emphasis — mitigated by preserving every fact and
  only reordering; shown in the PR diff for review.
- Assumption: aesthetic-first-impression findings (lab aesthetic ratings) transfer to recruiter
  skimming as a reasonable design inference, not a directly tested outcome (per the research
  caveats).
