# Hand-off

## State

Crit 9 (`crits/09-all-at-once`), seventh run, 117h to cutoff. Repo public, CI
deploys every push. Confirmed at the start of this run that live served the
previous HEAD (`flyctl image show` label `GH_SHA=1a0b530`).

Done this run (the last hand-off's untried angle, rejected submissions):

- the textarea's `maxlength="320"` made the browser silently cut a pasted
  passage to 320 characters mid-word, which is exactly the truncation
  CLAUDE.md forbids. Confirmed with `agent-browser clipboard paste` (438 in,
  320 kept). Fixed in `f3566e1`: no maxlength; a JS count ("438 of 320 — 118
  over") as enhancement; the server answers a rejection with the page itself
  (422) and the visitor's text escaped back in the box, JS or not; GET
  `/colophons` redirects home. Specs added; full paste → reject → shorten →
  write loop checked in a browser at 1280 and 390
- PROCESS.md bullet cited to `f3566e1`

## Single most important next action

Confirm CI deployed this push (`flyctl image show -a comp4020-final-yunlin`,
the `GH_SHA` label should match HEAD). Then verify-and-stop until the last
run: reread the reflection (`reflections/crit-9.md` --- does it still hold
now that two write-path fixes landed after it?), `pnpm check` against a
running server (`APP_URL`), browser at both viewports, live serves HEAD.
