# Hand-off

## State

Second run on this deliverable, 158h to cutoff at the start of the run
(crit 8, "It's alive!" — proof of life was already shipped last run). This
run stayed inside crit 8's own scope rather than jumping ahead to crit 9's
real-time layer: the crit's own brief says real-time "can all wait," and
`README.md`/`PROCESS.md` already argue "this week is the smallest version of
the object itself" — building the broadcast layer now would have contradicted
what this week's own shipped prose claims, not extended it. The previous
now.md's "single most important next action" (build crit 9's real-time layer)
was the wrong call for this run on that basis; crit 9's own brief hasn't been
fetched yet and shouldn't be guessed at.

Instead, did a deepen-phase pass grounded in this repo's own harness rules
(`CLAUDE.md`) and found two real bugs, both fixed, both tested, both verified
against the built Docker image and the live Fly deployment:

- `--seal` (the "one accent, one meaning" rule) had drifted into three
  unrelated places in `styles.css` — fixed, and `spec/accent.test.ts` now
  greps every `var(--seal)` use so it can't silently recur.
- `readBody` buffered an incoming POST with no size cap — a request skipping
  the form's own `maxlength="320"` could exhaust memory on this app's 256MB
  single-machine deploy. Fixed properly on the third attempt (see this
  repo's own `memory/MEMORY.md` for why the first two attempts raced); now
  covered by `spec/request-limits.test.ts` and confirmed live against
  `https://comp4020-final-yunlin.fly.dev/` with a real oversized-body
  request over TLS.

`PROCESS.md` is at 1087 words (ceiling 1100, real headroom this time, not the
exact edge). `README.md` untouched this run, still ~564 words (target
400–600). Pushed to `origin/main` and redeployed via `flyctl deploy
--remote-only --ha=false -a comp4020-final-yunlin`; live URL reverified
after redeploy (persistence still works, oversized-body rejection confirmed
live, app stayed healthy).

## What's not done yet

- `reflections/crit-8.md` still doesn't exist — still deliberately deferred
  to whichever run is called last for this crit's window, per the previous
  run's reasoning (unchanged).
- No real-time layer yet. Don't start it until a run actually fetches crit
  9's own course-source URL and reads its brief — don't build from memory of
  what "probably" comes next.
- Haven't run the keyboard/resize/slow-connection HD-band trio, forced-colors
  check, or a second-tab live-update check yet (the last one has nothing to
  test until crit 9's broadcast layer exists anyway).
- Word counts: re-measure `PROCESS.md` after any further edit — it's been
  right at the edge twice now before trimming back with real margin both
  times.

## Single most important next action

Whichever run reads this next: check whether the prompt's course-source URL
is still crit 8's, or has moved to crit 9. If it's moved, fetch crit 9's own
brief and build from that, not from this file's guess about what it asks.
If it's still crit 8, the deepen-phase checks listed above (keyboard/resize/
slow-connection, forced-colors) are the next real work; this crit's proof-of-
life bar and its README argument are both already solid.
