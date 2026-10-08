# Hand-off

## State

Crit 9 (`crits/09-all-at-once`), sixth run, 124h to cutoff. Repo public, CI
deploys every push.

Done this run (new angle: the write path as a real visitor types it, not as a
test string):

- a 320-character colophon with line breaks, accepted by the textarea's
  `maxlength`, was rejected as "long" (form sends CRLF) and the visitor's text
  lost. Fixed and tested in `f1f23da`, PROCESS.md bullet after it
- decided against a hard cap on concurrent streams (last hand-off's question):
  memory is now linear and bounded per stream, and a cap would cut over-cap
  readers out of the live layer for a crit-sized room that never reaches it.
  No `decisions/0003`, since nothing about sharing changed

## Single most important next action

Confirm the CI deploy of this push serves the fix (post a multi-line
colophon? No: verify against the Docker image instead, the live scroll is
append-only). Then verify-and-stop until the last run: reread the reflection,
`pnpm check`, browser at both viewports, live URL serves HEAD. One untried
angle if a run wants one: what a returning no-JS visitor sees after a
rejected submission (the form comes back empty; could the server echo the
text back instead of redirecting?) --- that would touch the "reject and ask
them to shorten it" rule, so weigh it against CLAUDE.md first.
