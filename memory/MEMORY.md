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

## A crafted Cookie header is part of the attack surface too, not just the POST body

`src/cookies.ts`'s `parseCookie` calls `decodeURIComponent` on whatever a
client sends as a cookie value. A malformed percent-encoding (`seal=%`, say
— invalid, but nothing stops a client sending it) threw uncaught, synchronously,
inside the request handler, crashing the whole Node process before any route
ran — confirmed live by sending it and watching the container exit. Fixed by
wrapping the call in try/catch and treating a rejected decode the same as no
cookie at all (fresh token issued). Any future code that reads a header value
a client controls — not just a POST body a form is supposed to constrain —
needs the same "what if this throws" question asked of it; `tsc`/build/tests
can't see this, since the code is type-correct and the exception only fires
on a specific malformed input no test had tried yet.

## The CI Docker check proves the app works, not that data survives a restart

`--tmpfs /data` (matching `.github/workflows/checks.yml`) is memory-backed
and gone the moment that container stops — a clean `pnpm check` run against
it says nothing about whether a colophon actually survives the one thing
the brief asks for ("a trace that's still there when they come back"). The
real test needed a real restart of the live Fly machine: with two existing
colophons already on the live scroll, `flyctl machine restart
<id> -a comp4020-final-yunlin` (a full Firecracker reboot, confirmed via
`flyctl logs` — `SIGINT`, volume unmount, a genuine `reboot: Restarting
system`, fresh boot) left both exactly where they were. Also checked while
reading those logs: the server has no custom `SIGINT` handler, but every
write is one synchronous `node:sqlite` statement, so there's no multi-step
commit a restart could ever catch mid-flight. Clean result — worth doing
this specific check (a real platform restart on the live deploy, not the
CI-matching Docker stand-in) on any future deliverable whose core promise is
persistence across a restart, since the stand-in test structurally can't
verify it.

## An append-only, never-editable entry makes a layout bug permanent, not just a content one

Every prior check of "nothing written here can ever be removed" asked about
security or content (XSS, length, ownership) — never rendering. `.colophon-
body` had `white-space: pre-wrap` but no `overflow-wrap`, so a single
unbroken word (well under the 320-char cap — a pasted URL, mashed keys, any
ordinary input) had no point to wrap at: the grid column's min-content width
grew to fit it, pushing `document.body.scrollWidth` to 2203px against a
1280px viewport in a live screenshot. Because no colophon can ever be
edited or deleted, that one entry would have stayed broken for every future
visitor permanently. Fixed with `overflow-wrap: anywhere` on `.colophon-
body`, guarded by `spec/layout.test.ts` (greps the rule, same style as
`spec/accent.test.ts`). Checked the adjacent "Zalgo text" risk too (a short
string stacking many combining marks on one base character) — Chromium
already caps visible combining-mark stacking on its own, so that variant
renders safely with no fix needed; worth knowing this is a browser-level
mitigation, not something this app's CSS has to defend against itself.
Any future change to `.colophon-body`'s CSS should keep `overflow-wrap`
in place — this file's own standing "once something is irreversible, a bug
in rendering it is as permanent as a bug in its content" lesson, not
previously stated this explicitly.

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
