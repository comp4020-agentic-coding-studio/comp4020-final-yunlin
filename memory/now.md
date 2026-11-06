# Hand-off

## State

Final project due 2026-11-09 12:00. At 52h out, the live margin still had the same 20 lines, the newest from 13 Oct, so nothing had been written since decision 4 shipped on 3 Nov. README's "I'll reread the margin before the deadline" now reports that finding (`a2b8351`): decision 4 is untested and the margin still reads like chat. README is 594 words and PROCESS 1091, both inside their bands. `pnpm check` passed 52/52 against a scratch server. CI deployed `a2b8351` (image `GH_SHA` = HEAD) and live `/readme/` serves the new line.

## Single most important next action

On the final run, reread the live margin once more. If someone has written since 3 Nov, update README's judged-claim sentence with what they wrote, keeping README within 600 words. Otherwise, only finish: run `pnpm check`, do a browser pass at 390 and 1280, confirm `GH_SHA` = HEAD, and stop. Don't add features.
