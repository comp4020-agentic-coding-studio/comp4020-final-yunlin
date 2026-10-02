# Hand-off

## State

Eighth run on this deliverable, 110h to cutoff at the start of the run. The
prompt's course-source URL is still crit 8's own (`crits/08-its-alive.json`)
— fetched fresh — so real-time still stays out of scope until a run fetches
crit 9's brief directly. Working tree matched the seventh run's hand-off
exactly at the start; nothing new had drifted in.

The seventh run's hand-off named three untried angles. Tried two of them,
both closed clean:

- **Concurrent writes to `addColophon`.** Ported crit 7's
  `addBooking`/`cancelBooking` concurrency-test technique. `addColophon` is
  a single synchronous `node:sqlite` insert with no read-then-write check
  (a different, simpler shape than crit 7's overlap logic), but that's a
  reasoned claim until tested: fired 40 genuinely concurrent `curl` POSTs
  at a running instance first (all 40 landed, each exactly once, no
  crash), then locked it in as a permanent test,
  [`e10f004`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/e10f004)
  (`spec/colophon-concurrency.test.ts`, 30 parallel `fetch`es via
  `Promise.all`). `pnpm check` went from 22 to 23 passing tests.
- **The HD-band trio** (keyboard, resize mid-interaction, a slow
  connection), run against this app for the first time. All three clean:
  a full keyboard walk matches DOM order and a fully keyboard-driven
  submission works end to end; typing → resizing live to the 390px
  viewport mid-type → continuing to type → submitting preserves value and
  focus with no corruption; a CDP-throttled 150kbps/400ms fresh load (same
  flatten-mode `attachToTarget` script technique as crit 7's) renders
  fully styled in ~5.5s with no FOUC, since the page is plain
  server-rendered HTML with nothing client-side to race.

The third angle — "what could a crafted README.md or colophon body do to
the markdown renderer" — turned out not to apply: `renderMarkdown` only
ever runs on `README.md` (`src/server.ts`'s `/readme/` route), which is a
static file this agent itself writes, never user input. The colophon body
is escaped and rendered as plain text (`render.ts`'s `colophonEntry`), never
passed through `marked` at all. Not a gap to keep chasing — recorded as
checked-and-not-applicable so a future run doesn't re-open it.

Logged in `PROCESS.md`
([`f757d7d`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/f757d7d))
and both memory files. No redeploy this run: nothing in `src/` changed,
only a new test file and process/memory documentation, so the
already-deployed image at `https://comp4020-final-yunlin.fly.dev/` already
matches this repo's runtime behaviour exactly. `git status` is clean and
pushed.

## What's not done yet

- `reflections/crit-8.md` still doesn't exist — still deliberately deferred
  to whichever run is called last for this crit's window, same reasoning as
  every prior hand-off.
- No real-time layer. Don't start it until a run fetches crit 9's own
  course-source URL directly.

## Single most important next action

Whichever run reads this next: fetch the prompt's course-source URL fresh
before doing anything else. If it's still crit 8, the deepen phase has now
survived five "declare it dry, then find one more thing" cycles (restart-
persistence, the layout-overflow bug, the unbounded-cookie-token bug, the
clean static-file-traversal check, and this run's clean concurrency/HD-band
checks). This repo's write path and rendering are both genuinely simple
(one synchronous insert, no client JS required, no read-then-write
anywhere) — several bug families other crits found in this course
(double-firing events, pointer-capture drift, animation-timer races) are
structurally absent here, so re-pointing those same lenses at this app is
unlikely to find anything new. A fresh angle needs to be shaped for what
this app actually does, not transplanted wholesale. Not yet tried: the
`sealGlyph` function (does every token, including a crafted non-UUID
cookie value that still passes the shape check some other way, map to a
glyph without throwing or degenerating); whether two tabs with different
seal cookies ever see each other's "mine" state leak (reread
`colophonEntry`'s `mine` comparison for any case where `ownToken` could be
undefined/empty and compare loosely); and a direct fact-check of
`README.md`'s own claims (it argues what "good" means for this app — the
content-practices discipline in the global `MEMORY.md` applies to a
self-descriptive README exactly as it does to any other page). If the
prompt calls this crit's window closed instead, the finishing steps
(reflection, final sweep across both marking viewports, commit, confirm
live) are what's left — the repo going public and starting CI deploys for
crit 9 isn't this agent's job to trigger, per doctrine.
