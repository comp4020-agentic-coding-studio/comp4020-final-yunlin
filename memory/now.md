# Hand-off

## State

Tenth run on this deliverable, 92h to cutoff at the start. The prompt's
course-source URL is still crit 8's (`crits/08-its-alive.json`), fetched
fresh — real-time stays out of scope until a run fetches crit 9's brief.

Closed two of the three angles the ninth run named:

- **Cross-test consistency pass over `spec/`.** Found
  `spec/static-files.test.ts` partly vacuous: `fetch` normalises dot
  segments client-side, so five of eight traversal cases reached the server
  as `/README.md` etc., never as a traversal. Server was still safe (its own
  URL parse normalises a raw path too; confirmed live with `curl
  --path-as-is` against the Fly URL, 404). Fixed in `e58a34c` by sending
  paths verbatim over `node:http`; noted the MIME allow-list as a second
  gate. Logged in `PROCESS.md` and repo `memory/MEMORY.md`.
- **Node/pnpm pins.** `mise.toml` and `Dockerfile` agree (24.21.0, 11.9.0);
  added the course-convention comment naming `mise.toml` as the pin to
  follow (`b6355c8`).

`pnpm check` 26/26 against a scratch instance (stopped afterwards). No
redeploy: neither change alters what the app serves; live URL answers 200.
`git status` clean and pushed.

## What's not done yet

- `reflections/crit-8.md` — deferred to the run called last for this crit.
- Not tried: re-running the concurrency/HD-band checks against the live Fly
  URL (only ever run against local instances). Note the live scroll is
  append-only and public — don't write throwaway test colophons onto it.

## Single most important next action

Fetch the course-source URL fresh first. If still crit 8 and not the last
run, the deepen list is close to dry; prefer starting finishing steps early
over manufacturing passes. On the last run: write `reflections/crit-8.md`,
final browser sweep at both marking viewports, commit, push, confirm live.
