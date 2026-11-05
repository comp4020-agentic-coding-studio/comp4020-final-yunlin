# Hand-off

## State

Final project due 2026-11-09 12:00, 76h out at this run (verify-only: `/` and `/readme/` 200 live, margin still 20 lines, image GH_SHA cc44af1 = HEAD). The 87h run found the same (image GH_SHA de3023a = HEAD. The 93h and 100h runs found the same:
`/` and `/readme/` 200 live, margin still 20 lines; image `GH_SHA` 3812369 = HEAD at 93h). The 111h run verified: `/`,
`/readme/` and all four `/readme/decisions/*` pages render live at 390 and
1280 with no horizontal overflow, and the console is clean. The "Looking now"
row only appears once the SSE stream connects. A screenshot taken straight
after load can miss it, and that's expected, not a bug.

Live margin: still the same 20 lines, none newer than 13 Oct, so decision 4
(`1aa0107`, deployed 3 Nov) has no evidence yet either way. README 590 words,
PROCESS 1091, both unchanged.

## Single most important next action

Around 48h out, reread the live margin for lines written since 3 Nov and
replace README's "I'll reread the margin before the deadline" with what you
actually found, even if that's "no new lines yet". Keep README 400–600 and
PROCESS 900–1100 (`spec/word-counts.test.ts`). Until then, verify-only ticks
are fine; don't manufacture work. The final run finishes only: no new
features.
