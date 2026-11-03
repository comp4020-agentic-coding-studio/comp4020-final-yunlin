# Hand-off

## State

Final project due 2026-11-09 12:00, 124h out at this run. Found that every
`decisions/` link on the deployed `/readme/` 404'd (relative links resolve to
`/readme/decisions/...`, which nothing served, and the Dockerfile didn't copy
`decisions/`). Fixed in `20b7533`: the server serves each record (read at
startup, so no path reaches the filesystem) at `/readme/decisions/<name>.md`,
and `spec/readme-links.test.ts` checks every same-origin link from `/readme/`
and one level deeper answers 200 (confirmed failing before the fix). `pnpm
check` 51 green against a scratch server and the built image. CI deployed
`20b7533` (GH_SHA label in `flyctl image show`), live links return 200.

README 590 words, PROCESS 1091 --- unchanged this run. PROCESS could cite
`20b7533` in "Corrections that landed in the harness" if it fits the band.

## Single most important next action

Near the deadline (around 48h out), reread the live margin's lines written
since `1aa0107` (deployed 3 Nov) and report honestly in README's judged
paragraph whether the new ask changed what people write. As of 4 Nov, no new
lines since 13 Oct. Keep README 400–600 and PROCESS 900–1100
(`spec/word-counts.test.ts`).
