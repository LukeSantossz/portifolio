# Temper above-the-fold visual complexity for the first-impression halo

A deep-research pass on evidence-based engagement (recruiter audience) found that the strongest,
best-supported lever is the **instant visual first impression**: aesthetic judgments form in
17-50 ms and halo onto perceived trust and competence, and **low visual complexity** maximizes
that appeal (Lindgaard 2006; Tuch & Bargas-Avila 2012; Reinecke 2013; NN/g aesthetic-usability).
The portfolio's decorative stack — analog grain (ADR-0002) + the global CRT overlay/beam
(ADR-0006) + a cursor-follow accent glow — is densest exactly where it matters most: the hero.

## Status

Accepted. Tempers (does not revoke) ADR-0002 and ADR-0006.

## Considered Options

- **Dial the intensity down, keep the identity (chosen)**: lower the grain opacity (0.06 → 0.04)
  and soften the cursor glow (radius 520 → 420px, alpha 13% → 9%). The Concrete Terminal look and
  the CRT ambience still render — just fainter — so the brand is intact while the hero reads
  calmer and cleaner, raising the aesthetic first impression with near-zero risk. Values are
  single-line tunables, trivially reverted.
- **Remove the CRT overlay / grain above the fold**: rejected — over-corrects; the analog texture
  is a deliberate identity asset, and the research supports *low* (not *zero*) complexity (the
  appeal curve is an inverted-U).
- **Leave it as-is**: rejected — the densest decoration sits on the highest-leverage screen; a
  cheap, reversible reduction is worth the first-impression gain.

## Consequences

- `.bt-grain` opacity and the `#cursor-glow` gradient are the only visual changes; no palette,
  layout, or motion changes, and the CRT beam is untouched (still reduced-motion-gated).
- This is a design inference from lab aesthetic-rating studies, not a directly measured hiring
  outcome; the values are tunable and confirmed in the browser.
- Companion, lower-risk engagement refinements shipped alongside (front-loaded Experience
  highlights; a peak-end availability close and a single clear primary action on Contact) do not
  touch the identity and needed no ADR. Debunked/weak triggers (open-loop recall; manufactured
  social proof; fake scarcity) were deliberately excluded.
