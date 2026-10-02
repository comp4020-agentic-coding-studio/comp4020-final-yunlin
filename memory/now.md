# Hand-off

## State

Ninth run on this deliverable, 99h to cutoff at the start of the run. The
prompt's course-source URL is still crit 8's own (`crits/08-its-alive.json`)
— fetched fresh — so real-time still stays out of scope until a run fetches
crit 9's brief directly. Working tree matched the eighth run's hand-off
exactly at the start; nothing new had drifted in.

The eighth run's hand-off named three untried angles. Closed all three:

- **`sealGlyph` on any token shape, and `mine`'s cross-tab leak risk.** Both
  clean, confirmed by reading `src/render.ts`/`src/cookies.ts` together
  rather than in isolation: `sealGlyph`'s per-character hash loop can't
  throw on any string (an empty string just leaves the hash at 0), and
  `c.token`/`ownToken` in the `mine` comparison always come from
  `sealToken`, which only ever returns a validated UUID on either branch —
  there's no path where either side is empty/undefined, so no false "mine"
  match is possible.
- **A direct fact-check of `README.md`'s own three cited sources** — the
  content-practices discipline this agent runs on every other crit's prose,
  never yet run on this repo's own README. Two checked out exactly: the
  painting attribution (Wang Yi painted the portrait, Ni Zan added pine and
  rock, 1363, Palace Museum Beijing — confirmed independently via
  WebSearch) and the Met essay's "continuous dialogue" phrase (the source
  reads "past and present in continuous dialogue"). The third didn't: the
  Hundred Rabbits bullet quoted "a lesser home-brewed tool tailored
  specifically to our own needs" as if from the cited interview — that
  exact phrase, and nothing close to it, appears anywhere on the source
  page (checked against the raw HTML text, not a search-engine summary).
  Fixed in
  [`f7d259f`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/f7d259f)
  by swapping in two real quotes from the same interview that support the
  same point the bullet was already making.

Logged in `PROCESS.md`
([`4b6af0d`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/4b6af0d))
and both memory files. Ran `pnpm check` against a scratch instance
(`DB_PATH`/`PORT` pointed at a throwaway dir, started and stopped within
this run, nothing left running) — 23/23 passing, confirmed the README fix
renders correctly via a direct `curl` of `/readme/`. No redeploy this run:
the only change is prose in a static markdown file served verbatim, no
`src/` behaviour changed, so the already-deployed image at
`https://comp4020-final-yunlin.fly.dev/` still matches this repo's runtime
behaviour exactly — only the *deployed* README's cited source text is now
stale until a redeploy, which isn't urgent since the error was a misquote,
not a live bug. `git status` is clean and pushed.

## What's not done yet

- `reflections/crit-8.md` still doesn't exist — still deliberately deferred
  to whichever run is called last for this crit's window, same reasoning as
  every prior hand-off.
- No real-time layer. Don't start it until a run fetches crit 9's own
  course-source URL directly.
- The fixed README text hasn't been redeployed to the live Fly URL yet —
  worth doing on the next run that touches `src/` anyway, or as part of the
  finishing-run redeploy; not urgent on its own since no behaviour changed.

## Single most important next action

Whichever run reads this next: fetch the prompt's course-source URL fresh
before doing anything else. If it's still crit 8, the deepen phase has now
survived six "declare it dry, then find one more thing" cycles (restart-
persistence, the layout-overflow bug, the unbounded-cookie-token bug, the
clean static-file-traversal check, the clean concurrency/HD-band checks,
and this run's fabricated-quote fix). Every angle this run's own hand-off
named is now closed. Not yet tried: re-running the HD-band/concurrency
checks against the *redeployed* live Fly URL rather than only a scratch
local instance (every prior live-restart/concurrency check in this repo ran
against a local build or an earlier deploy, never the current commit on the
live machine); a fresh read of `spec/*.test.ts` collectively for whether
any two tests assert contradictory things about the same code path (no
run has done a cross-test consistency pass, only per-test correctness);
and whether `Dockerfile`/`fly.toml`/`mise.toml` still agree on the Node
version this repo pins, now that six runs have passed since that was last
checked. If the prompt calls this crit's window closed instead, the
finishing steps (reflection, final sweep across both marking viewports
against the built preview, redeploy this run's README fix, commit, confirm
live) are what's left — the repo going public and starting CI deploys for
crit 9 isn't this agent's job to trigger, per doctrine.
