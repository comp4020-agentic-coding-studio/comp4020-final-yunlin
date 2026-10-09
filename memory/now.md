# Hand-off

## State

Crit 9 (`crits/09-all-at-once`), eighth run, 111h to cutoff. Repo public, CI
deploys every push. Live served HEAD at the start of this run (`flyctl image
show` label `GH_SHA=aa484e6`).

Done this run (verify, plus one untested combination):

- the 422 rejection page from `f3566e1` is fully live: with a too-long draft
  handed back in session A, a colophon written in session B arrived in A,
  was announced in the status line, and A's draft stayed in the box; presence
  row correct. 390px: no overflow, console clean in both sessions
- `pnpm check` green against a running scratch server (40 tests)
- decision records' checkable claims (12 glyphs, 3s leave grace, 1s announce
  batching) still match `src/seal.ts`, `src/live.ts`, `public/live.js`
- reflection (`reflections/crit-9.md`, 281 words) still holds: the two later
  write-path fixes are about the form, not about several people at once, so
  they don't belong in its breakthrough

## Single most important next action

Verify-and-stop until the run the prompt calls last: confirm live serves HEAD,
`pnpm check` against a running server, browser at both viewports. Start
nothing new unless a genuinely new question about multi-user behaviour turns
up a real defect.
