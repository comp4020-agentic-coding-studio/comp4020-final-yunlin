# Hand-off

## State

Sixth run on this deliverable, 123h to cutoff at the start of the run. The
prompt's course-source URL is still crit 8's own (`crits/08-its-alive.json`)
— fetched fresh — so real-time still stays out of scope until a run fetches
crit 9's brief directly. Working tree matched the fifth run's hand-off
exactly at the start.

The fifth run's hand-off said every lens tried so far was dry (twice over,
across two "declare it dry, then find one more thing" cycles) and the next
run should keep asking a genuinely new question. Found one: every prior
"what could a crafted request do" check (the POST body cap, the malformed-
cookie decode crash) had been asked of the colophon *body* or of cookie
*decoding* — never of the cookie's *shape/length* once it decodes fine.
`sealToken` trusted any non-empty cookie value verbatim as an existing
identity and wrote it into the append-only `colophons` table on every
insert. Confirmed live before touching anything: a 15,000-byte garbage
`seal` cookie landed byte-for-byte in the `token` column — unlike the body,
capped at 320 characters at the same boundary, nothing bounded the one
other piece of attacker-controlled data this app persists, and it would
repeat that cost on every colophon the same visitor ever wrote, forever,
with no way to undo it (the harness's own no-edit/no-delete rule). Fixed by
only trusting a cookie matching the fixed `randomUUID()` shape this server
actually issues
([`791839c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/791839c));
anything else now gets a fresh real token. Added a test to
`spec/cookie-safety.test.ts`, logged in `PROCESS.md`
([`6301f34`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/6301f34))
and both memory files.

`pnpm check` ran clean (13/13, up from 12) against the dev process, then
again against a freshly built Docker image (`sudo docker build`, `--tmpfs
/data`, matching `.github/workflows/checks.yml`) before trusting it.
Confirmed live on the actual deployed app, not just the build: a Fly deploy
hit several `insufficient memory available to fulfill request on the
current host` failures in a row (a transient host-capacity issue on Fly's
side, not anything this repo did — same command, same image, no config
change) before one attempt succeeded; the live app was never down in the
meantime (it just sat in its normal auto-stop "stopped" state between
attempts, confirmed by `flyctl status` and a 200 on the next real request).
Once deployed, re-ran the exact 15,000-byte-cookie request against
`https://comp4020-final-yunlin.fly.dev/` directly and confirmed the fresh-
UUID behaviour is what's actually being served, then confirmed `/` and
`/readme/` both still answer 200. All scratch servers, the scratch Docker
container/image, and scratch DB directories were cleaned up; `git status`
is clean and pushed.

## What's not done yet

- `reflections/crit-8.md` still doesn't exist — still deliberately deferred
  to whichever run is called last for this crit's window, same reasoning as
  every prior hand-off (writing it early would contradict doctrine's own
  "write the reflection on your final run" instruction, and nothing in CI
  checks for it before the repo goes public at cutoff).
- No real-time layer. Don't start it until a run fetches crit 9's own
  course-source URL directly.

## Single most important next action

Whichever run reads this next: fetch the prompt's course-source URL fresh
before doing anything else. If it's still crit 8, the deepen phase has now
survived three "declare it dry, then find one more thing" cycles (restart-
persistence, the layout-overflow bug, the unbounded-cookie-token bug) — the
next fresh angle should keep trying a genuinely new question, not a
re-verification of anything already listed here or in `memory/MEMORY.md`.
One thing worth remembering if a future deploy also hits the Fly host-
capacity error this run saw: it resolved on retry with no config change
needed, so retry a few times (with a short wait) before assuming it's
something in this repo to fix — but don't thrash on it forever either; if
several retries all fail, it's fine to leave the fix committed and pushed
and let a later run's deploy pick it up, since the live app keeps serving
its last successfully-deployed image in the meantime, not a broken one. If
the prompt calls this crit's window closed, the finishing steps (reflection,
final sweep across both marking viewports, commit, confirm live) are what's
left — the repo going public and starting CI deploys for crit 9 isn't this
agent's job to trigger, per doctrine.
