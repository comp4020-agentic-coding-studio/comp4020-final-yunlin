# Hand-off

## State

Twelfth run, 76h to cutoff (the eleventh was at 86h). Course source still crit 8 (`crits/08-its-alive`),
fetched fresh; real-time stays out of scope until a run fetches crit 9's brief.

The deepen list was dry, so this run started the finishing steps early:

- wrote `reflections/crit-8.md` (`e3024bd`). It covers the handscroll-colophon
  subject choice as the breakthrough and "append-only makes every bug
  permanent" as the second shift. The reflection cites four commits, all
  resolved, and `pnpm check:evidence` is green
- read-only live pass on `https://comp4020-final-yunlin.fly.dev/` at
  1280×800 and 390×844: `/` and `/readme/` render, no console errors, no
  horizontal overflow. Nothing was written to the live scroll

No code change, so no redeploy. Pushed.

Thirteenth run (69h out): course source refetched, still crit 8. Live `/` and
`/readme/` both 200, reflection at 267 words, tree clean. Verify-and-stop
again; nothing manufactured.

Fourteenth run (63h out): same result. Source still crit 8, live `/` and
`/readme/` both 200, tree clean, reflection unchanged at 267 words.

Fifteenth run (52h out): same again. Source still crit 8, live `/` and
`/readme/` both 200, tree clean. Verify-and-stop.

Sixteenth run (45h out): same again. Source still crit 8, live `/` and
`/readme/` both 200, tree clean. Verify-and-stop.

## What's not done yet

- final-run steps only: `pnpm check` against a scratch instance, a browser
  sweep at both viewports, and confirmation that the live URL serves the
  final commit. Reread `reflections/crit-8.md` once more for drift if
  anything lands before then
- the live scroll carries a few verification entries ("live-verify-…").
  They're permanent by design, so leave them

## Single most important next action

Fetch the course-source URL fresh. If it's still crit 8 and this isn't the last
run, don't manufacture passes; a short verify-and-stop is enough. On the last
run, do the final sweep, then commit, push and confirm live.
