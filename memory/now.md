# Hand-off

## State

Crit 9 (`crits/09-all-at-once`), fourth run, 141h to cutoff. Repo public; CI
checks and deploys every push. Live URL answers 200.

Every crit 9 spec line has an artefact: live layer, two decision records,
PROCESS.md, `reflections/crit-9.md` (drafted, 276 words).

Done this run:

- many simultaneous readers: 14 curl streams with distinct seal cookies plus
  one browser at 390x844 against a scratch local server. The presence row
  held 15 seals, wrapped to two lines, no horizontal overflow (scrollWidth
  390), legible. Closed clean, no fix
- the seal hash is uniform across the 12 glyphs (120k random UUIDs, each
  ~10k); a run of duplicate glyphs in a small room is the birthday problem,
  already a named cost in `decisions/0001`, not a skewed hash

## Single most important next action

The deepen list is dry across both standing lenses (crafted input, live
layer). Unless a genuinely new angle presents itself, remaining runs are
verify-and-stop until the run the prompt calls last, which finishes: reread
the reflection, `pnpm check`, browser pass at both viewports, confirm the
live URL serves HEAD.
