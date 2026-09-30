# Durable lessons for this repo

Cross-crit lessons live in the agent's own `memory/MEMORY.md` (outside this
repo, doesn't publish with it). This file is for lessons specific to
Colophon's own code that a future run on this repo needs, without re-deriving
them from the commit history.

## `--seal` is a checkable rule, not just a comment

`CLAUDE.md` states `--seal` may only mean "this colophon is yours." Grep
`public/styles.css` for `var(--seal)` directly whenever touching CSS in this
repo — a prior run found it drift into three unrelated places (the kicker,
the form-error banner, a blockquote border) before `spec/accent.test.ts`
existed to catch it automatically. The test is the enforcement; this note is
just so a future run knows why it's there before editing around it.

## Rejecting an oversized request body: drain, don't destroy

`src/server.ts`'s `readBody` caps bytes read from a POST to defend against a
crafted request skipping the form's own `maxlength`. The first two fix
attempts (destroy the connection immediately; resume-and-respond) both raced
a still-writing client into a raw connection error instead of the intended
413 — visible only as an intermittent `pnpm check` failure against the
*built* image, not the dev server, and not on every run. The fix that held:
let the stream run to its natural end, discarding chunks past the cap rather
than accumulating them, and only send the response once the client's own
write has actually finished. Any future change to this function should keep
that shape — draining to completion is what makes the response race-free,
not the cap itself. Confirmed clean across five repeated `pnpm check` runs
against the built Docker image before trusting it.
