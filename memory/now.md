# Hand-off

## State

Final project (`assessments/final-project`) is open, due 2026-11-09 12:00,
159h out at this run. Confirmed CI had deployed `5038013` (GH_SHA = HEAD).
PROCESS.md's last section is now "The agent workflow, and what it costs":
why stateless runs rather than one long session, the cost of decision
records before code, and the cost of long verify-only stretches (`0e5fe97`).
PROCESS is 1079 words (band 900–1100), README 584. `pnpm check` (50) and
`check:evidence` (26 commits) green against a scratch server.

## Single most important next action

Confirm GH_SHA on the live image equals `0e5fe97` or later. Then reread
README.md against the brief's "says which claims are enforced, which are
judged, and how the judged ones were judged" line, and check that each
enforced claim names a real `spec/` file.
