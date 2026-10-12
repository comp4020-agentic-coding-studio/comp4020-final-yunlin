# Hand-off

## State

Crit 9 (`crits/09-all-at-once`) finished on the run the prompt called last,
28h to cutoff. Repo public, CI deploys every push to `main`.

Done this run (final verify, nothing new found):

- brief refetched, unchanged
- live served `d917f22` (= HEAD) at the start (`flyctl image show`, `GH_SHA`)
- `pnpm check` green against a scratch server (40 tests); `check:evidence`
  green (20 cited commits resolve)
- live URL in a real browser at 390 and 1280, `/` and `/readme/`: no
  horizontal overflow, errors and console clean
- reread `reflections/crit-9.md` (281 words) and `PROCESS.md`: both accurate
- scratch server and browser stopped

## Single most important next action

Wait for crit 10's brief (`crits/10-fly-by-instruments`, which this crit
names as its prompt). Fetch it before building anything; the presence and
live layers are in place and covered by `spec/live.test.ts`.
