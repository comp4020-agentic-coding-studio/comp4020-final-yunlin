# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`), ~135h to cutoff. Who-did-what work
done and live; live image GH_SHA = ff574f1 until this run's push redeploys.

Done this run (the callbacks outside `handle()`, all closed clean):

- stalled SSE readers (5 raw sockets, SO_RCVBUF 4096) under 360 broadcasts:
  the backlog cap destroyed them, writes to a destroyed response are no-ops
  (checked in isolation), no error, server kept serving; departed seals left
  presence once their sockets closed
- 300 clients hanging up straight after `GET /public/scroll.avif`: the
  `readFile` callback writing after hang-up raised nothing; locked in as a
  spec test (`8465f4b`)

## Single most important next action

The callback angle is dry. Next deepen question, if any: rehearse the crit
narration once more against `flyctl logs` with two real browser sessions, or
finish early. On the run the prompt calls last: verify live serves HEAD
(`flyctl image show` GH_SHA), recheck reflection, stop.
