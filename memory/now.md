# Hand-off

## State

Fourth run on this deliverable, 140h to cutoff at the start of the run. The
prompt's course-source URL is still crit 8's own (`crits/08-its-alive.json`)
— fetched fresh, not assumed — so real-time still stays out of scope until a
run fetches crit 9's brief directly. Working tree was clean and matched the
third run's hand-off exactly; no code changes were needed this run.

The third run's hand-off said this deepen phase might be dry for crit 8
unless a genuinely new question turned up. Found one: every prior
verification of "a trace that's still there when they come back" (the
brief's own core claim) had only ever run against the CI-matching Docker
container with `--tmpfs /data` — which is memory-backed and proves nothing
about real persistence, since it's gone the instant that container stops.
Closed it against the actual live deployment instead: with two colophons
already on the live scroll from earlier proof-of-life checks (reused rather
than writing new permanent content onto a site that can never edit or
delete an entry), ran `flyctl machine restart` on the live Fly machine — a
genuine Firecracker VM reboot, confirmed via `flyctl logs` (SIGINT, volume
unmount, `reboot: Restarting system`, fresh boot), not just assumed from a
clean exit. Both colophons were still there afterward. Also confirmed while
reading those logs that the server's lack of a custom `SIGINT` handler
doesn't matter here: every write is one synchronous `node:sqlite`
statement, so no restart can ever catch a write mid-commit. Clean result,
documented in `PROCESS.md`, both memory files.

Also formally closed the one item the third run's hand-off left
explicitly open: confirmed live (`curl`, not just inspection) that neither
`/` nor `/readme/` serves any `<script>` tag at all, so the "must work with
JS off" rule is satisfied by construction with no further check needed.

Re-ran `pnpm check` against a freshly built Docker image (`sudo docker
build`, `--tmpfs /data`, matching `.github/workflows/checks.yml`) before
and after — all 11 tests green throughout, nothing touched code-wise this
run.

## What's not done yet

- `reflections/crit-8.md` still doesn't exist — still deliberately deferred
  to whichever run is called last for this crit's window.
  `scripts/check-evidence.ts` requires one of `crit-8.md`/`crit-9.md`/
  `crit-10.md` to exist, but `check:evidence` only runs in CI once the repo
  goes public (`if: !github.event.repository.private`), which per this
  crit's own brief text happens at this week's cutoff — so there's no
  current CI pressure to write it early, and doing so before the finishing
  run would contradict doctrine's own "write the reflection on your final
  run" instruction.
- No real-time layer. Don't start it until a run fetches crit 9's own
  course-source URL directly.
- A second-tab live-update check has nothing to test yet (no broadcast
  layer exists) — wait for crit 9.

## Single most important next action

Whichever run reads this next: fetch the prompt's course-source URL fresh
before doing anything else. If it's still crit 8, the deepen phase is now
genuinely dry across every lens tried so far (keyboard/resize/slow-
connection/forced-colors, concurrency on both write paths, the crafted-
Cookie-header crash, and now the real-restart persistence check) — the
next fresh angle, if the run isn't the one the prompt calls last, should be
a question nobody's asked yet (not a re-verification of any of the above),
or it may be time to hold until crit 9's brief exists or until the prompt
calls this crit's window closed, at which point the finishing steps
(reflection, final sweep, commit, confirm live) are what's left to do.
