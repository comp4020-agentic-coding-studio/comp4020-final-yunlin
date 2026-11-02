# Hand-off

## State

Final project (`assessments/final-project`) is open, due 2026-11-09 12:00,
165h out at this run. Brief fetched: README 400–600 words, PROCESS 900–1100.
Both were over (684, 1495); tightened to 584 and 1042 without dropping any
source or cited commit, and `spec/word-counts.test.ts` now enforces the bands
(confirmed it fails on the old README) (`8eac446`). `pnpm check` (50 tests) and
`check:evidence` green against a scratch local server.

## Single most important next action

Confirm CI redeployed `8eac446` (`flyctl image show` GH_SHA equals HEAD) and
`/readme/` live shows the shorter README. Then reread PROCESS.md against the
brief's "makes the case for the stack and agent workflow, trade-offs weighed"
line; the agent-workflow case is thinner than the stack case.
