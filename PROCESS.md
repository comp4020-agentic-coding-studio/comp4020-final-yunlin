# Process overview

## From the brief to the object

The final project brief fixes three requirements — multi-user, real-time,
persistent — and leaves everything else, including what "good" means, open.
Rather than start from a stack and look for a use for it, I started from a
lens this agent has carried since its very first crit — Ni Zan, ink-wash
restraint, "taste is what you leave out" — and asked what a genuinely
multi-user, real-time, persistent object already looks like in that world.
Chinese handscroll
colophons answered directly: collectors have been appending inscriptions to
the same scroll for centuries, an actual distributed, asynchronous,
permanent multi-author object, long before the word "multi-user" existed.
Building a small digital version of that — one painting, a line each, no
account, no edits — gave the brief's three fixed requirements a concrete,
historically grounded shape instead of the median chat room with the nouns
swapped, which the brief explicitly warns against. `README.md`
([`8d76d80`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/8d76d80)) argues
this in full, against three read sources.

## Building the smallest version of it

[`334d24f`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/334d24f) is the
whole first slice: `node:http` for the server and `node:sqlite` for storage,
both Node stdlib, no framework and no bundler. I checked Node 24.21 (the
version this repo pins) directly before committing to this — it runs `.ts`
files unmodified with no build step, and `node:sqlite` needs no native
module compiled in Docker, which is what let the Dockerfile stay a single
`pnpm install --prod` with no build stage. The core write path (posting a
colophon) is a plain HTML form to a POST route that redirects afterward, so
it works with JavaScript off; the real-time layer the brief expects belongs
to next week and would be additive on top of this, not a rewrite of it.

An anonymous per-browser cookie is the only notion of a visitor — no
accounts, matching what `README.md` argues "who counts as a person" should
mean here. The one accent colour (`--seal`) marks exactly one thing: a
colophon the current browser wrote. That's also how this slice answers the
crit's own bar directly — a stranger writes a line, leaves, and the next
time they load the page (even a different day, even after a redeploy, since
the database lives on the Fly volume at `/data`), their own line is still
there, still marked as theirs.

## Corrections that landed in the harness, not just a retry

Two things got caught and fixed by checking rather than assuming:

- The own-seal spec test
  ([`807906b`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/807906b))
  first asserted "yours" appeared somewhere in a 400-character slice after
  the marker text — passed for the wrong reason once, then failed for the
  right reason, since "Add yours" (the compose heading) falls inside that
  window too. Fixed by slicing out exactly the `<li>` the marker landed in.
- `CLAUDE.md` ([`33ef6c8`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/33ef6c8))
  states "escape all stored text before templating" as a standing rule, not
  just a thing I happened to do once: every colophon body is a stranger's
  own words, persisted forever and re-rendered to every future visitor —
  the one place here where getting it wrong is a stored XSS hole, not a
  cosmetic bug.

A second-run deepen pass found two more, both grounded in this repo's own
harness rules rather than a generic bug hunt:

- `CLAUDE.md` says `--seal` marks exactly one thing, "this colophon is
  yours" — but `styles.css` also spent it on the kicker line, the form-error
  banner and the readme's blockquote border
  ([`6a3ecdf`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/6a3ecdf)).
  Moved all three to `--ink`/`--ink-soft` and added a test that greps every
  `var(--seal)` use, rather than trusting the rule's own wording — a prior
  crit's identical drift went unnoticed for several runs.
- `readBody` buffered an incoming POST with no size cap
  ([`abd5dc4`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/abd5dc4)):
  a request skipping the form's own `maxlength="320"` could exhaust memory
  on this single-machine deploy. Confirmed with raw sockets, both a
  declared `Content-Length` over budget and a chunked request declaring
  none. Two fix attempts — destroy the connection, then resume-and-respond
  — both raced a still-writing client into a connection error, caught by
  `pnpm check` flaking against the built image across repeated runs.
  Draining the body to its natural end while discarding past the cap
  ([`9ef7505`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/9ef7505))
  removed the race: no memory cost, and it only responds once the
  client's own write has finished.

All four are things a quick manual pass can miss: the seal check only shows
up by rereading the whole stylesheet, not the markup a design argument is
framed around; the body cap only matters once a crafted request, not the
form, is asking. I verified the whole slice against the exact image the
`Dockerfile` builds — built it locally with `sudo docker build`, ran it with
a `--tmpfs /data` the same way `.github/workflows/checks.yml` does, and ran
`pnpm check` against that running container rather than a locally-started
dev process, so what passed is what CI would see. I also drove it with
`agent-browser`: filled and submitted the form, reloaded to confirm the
colophon was still there and marked "yours", resized 1280×800 to 390×844
mid-typing with the value and focus intact, and tabbed through to confirm
the horizontal scroll strip is keyboard-reachable, not just mouse-draggable.

A third-run pass asked the same "what could a crafted request do" question
of the Cookie header, not just the POST body: a `seal=%` cookie — invalid
percent-encoding no real browser sends, but nothing stops any client from
sending it — threw uncaught inside `decodeURIComponent` before any route
ran, crashing the whole process. Confirmed live against the built image: the
container exited, and the single Fly machine this app runs on would have
needed a restart to serve the next visitor. Fixed
([`6b5e6fb`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/6b5e6fb))
by treating a cookie `decodeURIComponent` rejects the same as no cookie at
all, deployed the same run, and reconfirmed live at
`https://comp4020-final-yunlin.fly.dev/` — a bug this severe, already live,
wasn't one to leave for the finishing run.

## The stack, and what it costs

Plain `node:http` over a framework (Express, Hono, Astro) costs more
hand-written routing and no middleware ecosystem, for a slice this size —
four routes, no auth, no JSON API — that isn't much. It buys directness:
every request's path from cookie to database to rendered HTML is one file,
readable start to end, which matters more than middleware convenience while
the app's shape is still being decided. `node:sqlite` over `better-sqlite3`
(used on an earlier crit) costs a newer, less-battle-tested API; it buys no
native module to compile in Docker, a real simplification against the
256MB/one-machine constraint this repo runs under. Neither choice is
final — if next week's real-time layer needs more than an `EventSource` and
a `node:sqlite` poll can give, that trade-off gets revisited and recorded
here, not silently abandoned.

## What's next

Crit 9 asks for real-time (a colophon appearing in every open session
within about a second) and one written decision about how the app behaves
with several people writing at once. The schema here is already the
smallest version that can carry both: adding a broadcast on write and
picking what happens when two people submit close together are the two
concrete next steps, not a redesign.
