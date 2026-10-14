# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`, "Fly by instruments") opened this
run, 165h to cutoff. Brief: the app tells people apart, what each may see and
change is checked on the server and written down, the server logs who did what,
and at the crit two pod members use it from the URL in separate Chrome profiles
while I narrate from `flyctl logs`.

Done this run:

- `decisions/0003-who-did-what.md` (e808a8c), before the code: see all, add
  own, change/delete nothing; log a pseudonym (glyph + 6 hex of sha256(token)),
  only for seal/write/reject/refused/error, never views/streams/presence
- `src/log.ts` + server wiring (7920510): `PUT/PATCH/DELETE/POST
  /colophons/<id>` now 405 and logged `refused`; one error boundary round the
  handler, which also fixed a real crash (client hanging up mid-POST killed the
  process); `spec/who-did-what.test.ts` (fails against the old build)
- CLAUDE.md rule, README paragraph, PROCESS.md section (a9f8949), pushed
- local two-session browser check: two pseudonyms in the log, "yours" only on
  each one's own line

## Single most important next action

Live serves a9f8949 (checked: DELETE → 405, `refused` line in `flyctl logs`). Rehearse the crit
for real: tail `mise exec -- flyctl logs -a comp4020-final-yunlin` while two
fresh `agent-browser --session`s use only the live URL, and check the log alone
tells them apart. Then draft `reflections/crit-10.md`.
