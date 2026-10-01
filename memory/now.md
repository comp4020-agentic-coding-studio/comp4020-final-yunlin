# Hand-off

## State

Fifth run on this deliverable, 134h to cutoff at the start of the run. The
prompt's course-source URL is still crit 8's own (`crits/08-its-alive.json`)
— fetched fresh — so real-time still stays out of scope until a run fetches
crit 9's brief directly. Working tree matched the fourth run's hand-off
exactly at the start.

The fourth run's hand-off said every lens tried so far (keyboard/resize/
slow-connection/forced-colors, concurrency on both write paths, the
crafted-Cookie-header crash, the real-restart persistence check) was dry,
and the next run should ask a genuinely new question. Found one: every
prior check of "nothing written here can ever be removed" treated that as a
security/content question (XSS, length, ownership), never a rendering one.
`.colophon-body` had `white-space: pre-wrap` but no `overflow-wrap`, so a
single unbroken word (well under the 320-char cap — a pasted URL, mashed
keys, perfectly ordinary input) had nowhere to break: confirmed live before
touching anything (`document.body.scrollWidth` 2203 vs `innerWidth` 1280,
screenshotted), and because a colophon can never be edited or deleted, that
one entry would have stayed broken for every future visitor forever. Fixed
with `overflow-wrap: anywhere` ([`487d6bc`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/487d6bc)),
confirmed live afterward at both marking viewports (`scrollWidth` back to
736, matching the 46rem body width), added `spec/layout.test.ts` (greps the
rule, same style as `spec/accent.test.ts`), logged in `PROCESS.md`
([`008b6df`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/008b6df))
and both memory files, and deployed the same run (this bug was already live
and visitor-triggerable, same reasoning as the crafted-cookie crash fix two
runs ago — not something to leave for the finishing run). Confirmed live:
`curl`'d `https://comp4020-final-yunlin.fly.dev/public/styles.css` shows the
fix is actually being served, and `/` and `/readme/` both still answer 200.

Also checked the adjacent "Zalgo text" risk (many combining marks stacked on
one base character, also well under the length cap) live in a browser —
Chromium already caps visible combining-mark stacking on its own, so this
variant renders safely with no fix needed. A clean result, not a second bug;
recorded in `memory/MEMORY.md` so a future run doesn't re-ask it.

`pnpm check` ran clean (12/12, up from 11) against the dev process, then
again against a freshly built Docker image (`sudo docker build`, `--tmpfs
/data`, matching `.github/workflows/checks.yml`) before any of this was
trusted. All scratch servers, the scratch Docker container, and the
agent-browser session were stopped/removed before finishing; `git status`
is clean and pushed.

## What's not done yet

- `reflections/crit-8.md` still doesn't exist — still deliberately deferred
  to whichever run is called last for this crit's window (`scripts/check-
  evidence.ts` only runs in CI once the repo goes public, which happens at
  this week's cutoff per the brief, so there's no CI pressure to write it
  early, and writing it before the final run would contradict doctrine's own
  "write the reflection on your final run" instruction).
- No real-time layer. Don't start it until a run fetches crit 9's own
  course-source URL directly — the fourth run's hand-off already warned
  against building this on spec, and that's still right.

## Single most important next action

Whichever run reads this next: fetch the prompt's course-source URL fresh
before doing anything else. If it's still crit 8, the deepen phase has now
survived two "declare it dry, then find one more thing" cycles (run 4:
restart-persistence; run 5: the layout-overflow bug) — the next fresh
angle, if the run isn't the one the prompt calls last, should keep trying a
genuinely new question (not a re-verification of anything listed above or
in `memory/MEMORY.md`) before assuming there's truly nothing left. If the
prompt calls this crit's window closed, the finishing steps (reflection,
final sweep across both marking viewports, commit, confirm live) are what's
left — the repo going public and starting CI deploys for crit 9 isn't this
agent's job to trigger, per doctrine.
