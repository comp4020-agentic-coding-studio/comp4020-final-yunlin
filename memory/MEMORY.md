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

## A trusted cookie value needs a shape check too, not just a decode-safety one

`src/cookies.ts`'s `sealToken` trusted any non-empty, successfully-decoded
cookie value as an existing identity and wrote it verbatim into the
append-only `colophons` table on every insert from that visitor — no length
or format check, even though every token this server ever issues is a fixed-
shape `randomUUID()`. Confirmed live before fixing: a 15,000-byte garbage
`seal` cookie landed byte-for-byte in the `token` column; unlike the
colophon body (capped at 320 characters at the same write boundary), nothing
bounded the one other piece of attacker-controlled data this app persists,
and a crafted cookie near Node's own ~16KB header ceiling would repeat that
cost on every colophon that visitor ever wrote, forever, with no way to undo
it. Fixed by only trusting a cookie matching the UUID shape this server
actually issues (`UUID_RE` in `src/cookies.ts`); anything else gets a fresh
real token, bounding the column to 36 bytes regardless of input. Guarded by
a new test in `spec/cookie-safety.test.ts` alongside the existing malformed-
cookie-crash one — both ask the same "what could a crafted Cookie header do"
question, one about decode safety, one about shape/length. Any future code
that adds another cookie this server reads needs the same shape check from
the start, not just a try/catch around the decode.

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

## The static-file route is safe by construction, not by luck — confirmed, not just reasoned

Every prior "what could a crafted request do at the API boundary" check
(above) was about the POST body or the Cookie header; this run asked it of
`GET /public/*` in `src/server.ts`, which reads `.${url.pathname}` straight
off disk, gated only by `startsWith("/public/")`. Confirmed live rather than
trusting the reasoning that WHATWG URL parsing collapses dot segments:
plain (`/public/../README.md`), percent-encoded, double-percent-encoded, and
backslash-form traversal attempts all 404, because `new URL(...)` removes
every dot segment (it recognises percent-encoded `%2e`/`%2E` forms too, per
spec) before the route's own prefix check ever runs — a `..` can't survive
to reach the filesystem read. Clean result, not a bug, but locked in with
`spec/static-files.test.ts` (same style as the cookie/body regression
tests) rather than left as an untested assumption, since a future refactor
of this route (e.g. swapping the URL class for manual string splitting)
could easily lose this property silently.

That test was partly vacuous until `e58a34c`: `fetch` and plain `curl`
normalise dot segments client-side, so `/public/../X` and `/public/%2e%2e/X`
reached the server as `/X`. Send traversal probes over `node:http` (or
`curl --path-as-is`), which pass the path verbatim. The MIME allow-list is
a second gate behind the prefix check.

## `addColophon` under real concurrency, and the HD-band trio — both closed clean

`addColophon` is a single synchronous `node:sqlite` insert, no read-then-
write check, so it can't have the overlap-style race crit 7's booking
endpoints could — but that's a reasoned claim, confirmed live rather than
left as one: 40 genuinely concurrent `curl` POSTs, then 30 via
`Promise.all` in `spec/colophon-concurrency.test.ts`, all land exactly
once, no crash. The artefact criterion's keyboard/resize/slow-connection
trio, run against this app for the first time: keyboard-only tab order
matches DOM order and a fully keyboard-driven submission works; typing,
resizing live to the 390px viewport mid-type, and submitting afterward
preserves value and focus; a CDP-throttled 150kbps/400ms fresh load still
renders fully styled with no FOUC in ~5.5s, since the page is plain
server-rendered HTML with nothing client-side to race. Worth remembering
this app's whole shape (no client JS required for the core interaction, no
read-then-write on its one write path) makes several of the bug families
other crits found in this course structurally absent here — don't expect
to find them by re-asking the same questions; a future deepen pass needs a
question shaped for *this* app's shape, not a transplanted one.

## `README.md`'s own cited sources needed the same fact-check as any other prose

The content-practices discipline (checkable claims need verifying against
the source, not memory) had been run on every prior crit's prose but never
on this repo's own `README.md`. Two of its three cited sources checked out
exactly (the painting attribution; the Met essay's "continuous dialogue"
phrase), but the Hundred Rabbits bullet quoted "a lesser home-brewed tool
tailored specifically to our own needs" as if from the cited interview —
that phrase doesn't appear anywhere in the source page. Fixed by swapping
in two real quotes from the same interview that support the same point.
`sealGlyph`/`mine` in `src/render.ts` were also checked this run and are
safe: both sides of the `mine` comparison always come from `sealToken`,
which only ever returns a validated UUID (the cookie-shape check or a fresh
`randomUUID()`), so neither can be empty/undefined, and `sealGlyph`'s
character loop never throws on any string shape. Any future edit adding a
new cited source to `README.md` needs the source's raw text checked
directly before trusting a quotation mark around a paraphrase.
