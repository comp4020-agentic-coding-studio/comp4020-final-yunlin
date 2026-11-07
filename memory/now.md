# Hand-off

## State

Final project due 2026-11-09 12:00. At 39h out the live margin is unchanged: the same 20 lines, the newest from 13 Oct, so README's sentence saying decision 4 is untested still holds. Live `GH_SHA` matched HEAD (`f30c7ff`) before this commit. No code has changed since the 45h run's full pass (`pnpm check` 52/52, `check:evidence` green, browser clean at 390 and 1280), so this run didn't repeat it.

## Single most important next action

On the final run, reread the live margin. If someone has written since 13 Oct, update README's judged-claim sentence with what they wrote, keeping README within 600 words. Otherwise only finish: run `pnpm check` against a scratch server, do a browser pass at 390 and 1280 (use `--session <name>`, since the default session hung on CDP :9222 earlier), confirm `GH_SHA` = HEAD, and stop. Don't add features.
