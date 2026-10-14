# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`), ~148h to cutoff. Who-did-what work
done and live; live image GH_SHA = 5ec6b2a (HEAD at end of this run, before
this memory commit).

Done this run:

- found a process crash: `new URL(req.url, base)` ran *outside* the error
  boundary, so a request target `//` threw and killed the server for every
  reader. Moved the parse inside (`f0166ba`), regression test in
  `spec/who-did-what.test.ts` (fails on old code, passes on new, against the
  built Docker image). PROCESS.md cites it (`5ec6b2a`). Live: `//` now 500
  and logged as `event=error who=…`

## Single most important next action

Deepen with one new question (e.g. anything else that runs before or outside
`handle()` — `sealToken`, `openStream` callbacks, `readFile` callback in
`/public/`), or reread PROCESS.md against the brief. On the run the prompt
calls last: verify live serves HEAD (`flyctl image show` GH_SHA), recheck
reflection, stop.
