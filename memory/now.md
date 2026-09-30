# Hand-off

## State

First run on this deliverable (`comp4020-final-yunlin`, crit 8 "It's
alive!"). Built, tested, committed and deployed a first working slice from
an empty repo: **Colophon**, a shared margin on one real handscroll painting
(Wang Yi's 1363 *Portrait of Yang Zhuxi*, Ni Zan's pine and rock, Palace
Museum Beijing, public domain via Wikimedia Commons). Visitors write one
short permanent line each — no accounts, no edits, an anonymous per-browser
"seal" — modelled directly on the real historical practice of collectors
appending colophons to a scroll over centuries. Full reasoning in
`README.md` and `PROCESS.md`.

Live at https://comp4020-final-yunlin.fly.dev/ — verified today: writes
persist across a real redeploy (the crit's own proof-of-life bar), own-seal
highlighting works, both marking viewports render clean with no console
errors, keyboard reaches and scrolls the horizontal scroll strip, a resize
mid-typing keeps the textarea's value and focus. `pnpm check` is green
against the exact Docker image CI builds (built and ran it locally with
`sudo docker` — this sandbox needs `sudo` for the docker socket, plain
`docker` gets a permission error).

Stack: plain `node:http` + `node:sqlite` (both Node 24 stdlib — no
framework, no bundler, no native module to compile), TypeScript run
directly (Node 24 strips types, no build step), `marked` as the one runtime
dependency for `/readme/`. Reasoning and trade-offs are in `PROCESS.md`.

## What's not done yet

- **`reflections/crit-8.md` doesn't exist yet.** Deliberately deferred
  rather than written on the very first build pass — the doctrine's own
  reflection prompts ("the breakthrough that moved the work forward") read
  better once there's been a full week's worth of runs to reflect on, and
  every other crit logged in `../memory/MEMORY.md` wrote it near the end of
  the crit's window, not the start. `pnpm check:evidence` currently fails
  only on this (confirmed locally); needs to land before this crit's
  cutoff, on whichever run is called last for this window.
- No real-time layer yet — that's crit 9 ("All at once"), not this one.
  `PROCESS.md`'s own "What's next" section names the two concrete steps
  (broadcast on write, one decision about concurrent writers) already.
- `spec/colophon.test.ts` covers persistence, seal ownership and input
  bounds; hasn't yet had a deepen-phase pass (keyboard/resize/slow-
  connection HD-band trio, forced-colors, a second real browser tab
  watching for the crit-9 real-time work once that lands).
- Haven't re-read `README.md` word count after any further edits — it's at
  ~560 words now (within the eventual 400–600 target), `PROCESS.md` at
  ~940 (within 900–1100). Both will need rechecking after any future edit,
  per the standing lesson in `../memory/MEMORY.md` about ceilings getting
  silently re-crossed by additive changes.
- Haven't yet backfilled anything into `../memory/MEMORY.md` (the global,
  cross-crit file) — nothing here yet rises to a durable, reusable lesson
  beyond what's already recorded there from other crits, but worth
  checking again once crit 9's real-time layer is built (that's more
  likely to produce a genuinely new lesson, per the pattern crit 7 hit
  with its wall-clock-computed accent colour).

## Single most important next action

Read `PROCESS.md`'s "What's next" section, then build crit 9's real-time
layer (an SSE broadcast on every new colophon, plus one written decision
about what happens when two people submit close together — the schema
already carries both without a redesign). Do that before touching anything
cosmetic; the deepen-phase checks listed above can wait until there's a
real-time claim worth testing live.
