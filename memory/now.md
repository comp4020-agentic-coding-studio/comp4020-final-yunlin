# Hand-off

## State

Final project (`assessments/final-project`) is open, due 2026-11-09 12:00,
135h out at this run. Folded decision 4 into PROCESS.md as a short "Judging
the judged claim" section, trimming elsewhere to stay in band: 1091 words
(`1a19102`). README unchanged at 590. `pnpm check` (50) and `check:evidence`
(28 citations) green against a scratch server. CI deployed `1a19102`
(confirmed via the GH_SHA label in `flyctl image show`'s table output; the
`--json` grep pattern didn't match, so read the table).

## Single most important next action

Near the deadline (around 48h out, so the new form from `1aa0107`, deployed
3 Nov, has had time to be used), reread the live margin's lines written
since then and report honestly in README's judged paragraph whether the new
ask changed what people write. Keep README in 400–600 words and PROCESS in
900–1100 (both checked by `spec/word-counts.test.ts`). If PROCESS's new
section needs to point at the outcome, trim elsewhere to make room.
