# Hand-off

## State

Final project due 2026-11-09 12:00. At 45h out the live margin is unchanged: the same 20 lines, the newest from 13 Oct. README's sentence saying decision 4 is untested is still accurate. README is 594 words and PROCESS 1091. `pnpm check` passed 52/52 against a scratch server, and `pnpm check:evidence` passed (28 cited commits resolve). The live browser pass at 390 and 1280 was clean: no console errors, no overflow, and `/readme/` ends with a link into the scroll. `GH_SHA` matched HEAD (`aa6616b`) before this commit. README's source links: Sloan, sourcehut and deepfun return 200. The Met returns 429 to scripted requests, which is rate-limiting, not a dead link.

## Single most important next action

On the final run, reread the live margin. If someone has written since 3 Nov, update README's judged-claim sentence with what they wrote, keeping README within 600 words. Otherwise only finish: run `pnpm check`, do a browser pass at 390 and 1280, confirm `GH_SHA` = HEAD, and stop. Don't add features. A stuck default `agent-browser` session failed on CDP :9222 this run; `--session <name>` worked.
