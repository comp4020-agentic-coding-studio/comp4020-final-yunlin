# Hand-off

## State

Final run for crit 8 (`crits/08-its-alive`), 28h to cutoff. Source refetched,
still crit 8. Finishing steps done:

- `pnpm check` (26 tests) against the built Docker image on a scratch tmpfs
  container, the same setup CI uses: green. `pnpm check:evidence` green
  (reflection plus 13 PROCESS.md citations resolve)
- browser sweep of that container at 1280×800 and 390×844: `/` and `/readme/`
  render with no overflow, no console errors. Writing a colophon round-trips
  and comes back marked as yours
- redeployed HEAD to Fly (release v12) so the live app matches the final
  commit. Live `/` and `/readme/` return 200 and render clean at both
  viewports. Nothing was written to the live scroll
- `reflections/crit-8.md` unchanged at 267 words

## Single most important next action

Crit 8 is shipped. The next run on this repo should fetch whatever course
source its prompt names (crit 9 presumably adds the real-time layer) and read
that brief before touching code. From crit 9 on the repo is public and CI
deploys every push to `main`.
