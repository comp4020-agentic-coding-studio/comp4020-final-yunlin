# Hand-off

## State

Seventh run on this deliverable, 116h to cutoff at the start of the run. The
prompt's course-source URL is still crit 8's own (`crits/08-its-alive.json`)
— fetched fresh — so real-time still stays out of scope until a run fetches
crit 9's brief directly. Working tree matched the sixth run's hand-off
exactly at the start; nothing new had drifted in.

The sixth run's hand-off said the deepen phase had survived three "declare
it dry, then find one more thing" cycles and the next run should keep
looking for a genuinely new question, not a re-verification. Found one: the
standing "what could a crafted request do at the API boundary" lens had
only ever been pointed at the POST body and the Cookie header — never at
the static-file route, `GET /public/*` in `src/server.ts`, which reads
`.${url.pathname}` straight off disk with only a `startsWith("/public/")`
guard. Rather than reason it through and move on, confirmed live against a
running dev server: plain `../`, percent-encoded (`%2e%2e`), double-percent-
encoded (`%252e%252e`), backslash, and encoded-slash traversal attempts all
404, because WHATWG URL parsing (`new URL(req.url, "http://internal")`)
collapses every dot segment — including percent-encoded forms — before the
route's own prefix check ever runs. A clean result, not a bug: this route
was already safe, by construction of using the URL class rather than manual
string handling. Locked it in anyway with a new `spec/static-files.test.ts`
(9 cases: one real file still serves, eight traversal shapes all rejected)
so a future refactor of this route can't silently lose the property.
`pnpm check` went from 13 to 22 passing tests. Logged in `PROCESS.md`
([`c1c9fdf`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/c1c9fdf),
process note in
[`dd24753`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/dd24753))
and both memory files.

No redeploy this run: nothing in `src/` changed, only a new test file and
process/memory documentation, so the already-deployed image at
`https://comp4020-final-yunlin.fly.dev/` already matches this repo's
runtime behaviour exactly (confirmed live as of the sixth run's hand-off).
Redeploying an unchanged image would have been motion without a reason.
`git status` is clean and pushed.

## What's not done yet

- `reflections/crit-8.md` still doesn't exist — still deliberately deferred
  to whichever run is called last for this crit's window, same reasoning as
  every prior hand-off.
- No real-time layer. Don't start it until a run fetches crit 9's own
  course-source URL directly.

## Single most important next action

Whichever run reads this next: fetch the prompt's course-source URL fresh
before doing anything else. If it's still crit 8, the deepen phase has now
survived four "declare it dry, then find one more thing" cycles (restart-
persistence, the layout-overflow bug, the unbounded-cookie-token bug, and
this run's clean static-file-traversal check) — keep trying a genuinely new
question of the app rather than re-verifying anything already listed here
or in `memory/MEMORY.md`. Angles not yet tried, as starting points rather
than instructions: the markdown renderer (`src/markdown.ts`, `marked`) has
never been asked "what could a crafted README.md or a crafted colophon body
do to it" directly; concurrent writes to the same SQLite file under real
parallel load (crit 7's `addBooking`/`cancelBooking` concurrency-test
technique, logged in the global `MEMORY.md`, has never been ported to this
repo's `addColophon`); and the HD-band trio (keyboard, resize mid-
interaction, a slow connection) logged for other crits has never been run
against this app at all. If the prompt calls this crit's window closed
instead, the finishing steps (reflection, final sweep across both marking
viewports, commit, confirm live) are what's left — the repo going public
and starting CI deploys for crit 9 isn't this agent's job to trigger, per
doctrine.
