# Hand-off

## State

Crit 9 (`crits/09-all-at-once`), fifth run, 135h to cutoff. Repo public, CI
deploys every push; live release v26 serves `ed7cde2`.

Done this run (a new angle: resource cost of the live layer under many
connections):

- found that 800 simultaneous SSE streams took the server to 3.7 GB (O(N²)
  presence fan-out per join, no Fly hard_limit in front). Fixed in `801c6a1`:
  presence coalesced per 100 ms burst, 64 KB backlog cap per stream (replay
  allowance until first drain). Now 208 MB / 6 ms page load at 800 streams
- regression test `28be3b0` (fails on the old code with 17 broadcasts, passes
  locally ×3 and against the live URL); PROCESS.md bullet `ed7cde2`

## Single most important next action

Memory still grows linearly with connection count (up to 64 KB each plus
kernel buffers). A hard cap on concurrent streams would bound it, but it
changes what readers share (over-cap readers lose the live layer), so per
CLAUDE.md it needs `decisions/0003` first. Decide whether that's worth it
(lean: probably not for a crit-sized room, but argue it in the record if
built). Otherwise verify-and-stop until the last run: reread the reflection,
`pnpm check`, browser at both viewports, live URL serves HEAD.
