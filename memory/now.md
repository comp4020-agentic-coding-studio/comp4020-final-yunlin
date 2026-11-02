# Hand-off

## State

Final project (`assessments/final-project`) is open, due 2026-11-09 12:00,
148h out at this run. README's "What's enforced, what's judged" section now
names the spec file behind each enforced claim (colophon, live,
who-did-what, accent) and says how the judged claim was judged: I read the
live margin's twenty lines after the crits. Most are greetings and tests, so
it honestly says the margin reads like chat so far (`c492496`). README is 580
words, PROCESS 1079. `pnpm check` (50) and `check:evidence` green against a
scratch server. CI deployed `c492496` (GH_SHA confirmed), and /readme/ serves
the new text.

Env note: `mise exec --` now tries to install rust and fails; plain `pnpm`/
`node` on PATH (node 26.13) work without it.

## Single most important next action

Decide whether the "reads like chat" finding should change the app or only
the argument. One candidate: the README's own position is that a colophon is
considered rather than typed. Reread decisions/ and the write form's copy for
anything that invites considered lines, and record the decision before any
code. Don't build anything the README doesn't argue for.
