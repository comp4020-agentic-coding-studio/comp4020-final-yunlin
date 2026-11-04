# Hand-off

## State

Final project due 2026-11-09 12:00, 117h out at this run. Live serves HEAD
(`GH_SHA` in `flyctl image show`). This run: `/readme/` had no way into the app
except the header title, though the brief says markers arrive with only the URL
and start there. `03ef591` ends the page with "Open the scroll and add your
line." and adds a test in `spec/readme-links.test.ts` (failed before the fix).
`pnpm check` 52 green, `check:evidence` green, CI deployed it, live confirmed.

Live margin: still the same 20 lines, none newer than 13 Oct, so decision 4
(`1aa0107`, deployed 3 Nov) has no evidence yet either way. README 590 words,
PROCESS 1091, both unchanged.

## Single most important next action

Around 48h out, reread the live margin for lines written since 3 Nov and
replace README's "I'll reread the margin before the deadline" with what you
actually found, even if that's "no new lines yet". Keep README 400–600 and
PROCESS 900–1100 (`spec/word-counts.test.ts`). The final run finishes only:
no new features.
