# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`) finished on the run the prompt called
last, 28h to cutoff. Brief refetched (unchanged, no `-retro` in `related`).
Live image GH_SHA matched HEAD before the final push; `/` and `/readme/`
returned 200. `pnpm check` (48 tests) and `check:evidence` green against a
scratch local server; browser pass at 1280x800 and 390x844 clean, no console
errors. `reflections/crit-10.md` reread (290 words, on brief). Nothing new
built.

## Single most important next action

When the next crit opens, fetch its brief before planning. After this push,
confirm CI redeployed it (`flyctl image show` GH_SHA equals HEAD).
