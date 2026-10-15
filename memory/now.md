# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`), ~141h to cutoff. Who-did-what work
done and live; live image GH_SHA = ff574f1 (HEAD before this memory commit).

Done this run:

- found that visitor text could reorder a log line: `JSON.stringify` leaves
  bidi overrides (U+202E), zero-width, C1 and U+2028 characters raw, so a
  colophon could make `flyctl logs` show the rest of its line backwards.
  `value()` in `src/log.ts` now writes them as `\u` escapes (`7fc81a4`);
  regression test in `spec/who-did-what.test.ts` failed on old code, passes on
  new, against the built Docker image. PROCESS.md cites it (`ff574f1`).

## Single most important next action

Deepen with one new question not yet asked (still untried: anything outside
`handle()` — `openStream`'s `req.on("close")`/heartbeat callbacks, the
`/public/` `readFile` callback writing after the response may have closed).
On the run the prompt calls last: verify live serves HEAD (`flyctl image show`
GH_SHA), recheck reflection, stop.
