# Hand-off

## State

Eleventh run, 86h to cutoff. Course source still crit 8 (`crits/08-its-alive`),
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
