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
  the marker text. It passed for the wrong reason once, then failed for the
  right reason on a second run, because "Add yours" (the compose heading)
  falls inside that window too — a false match, not a real one. Fixed by
  slicing out exactly the `<li>` the marker landed in instead of a fixed
  character count, so the test can't pass by coincidentally finding
  unrelated text nearby.
- `CLAUDE.md` ([`33ef6c8`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/33ef6c8))
  states "escape all stored text before templating" as a standing rule, not
  just a thing I happened to do once, because every colophon body is a
  stranger's own words, persisted forever, and re-rendered as HTML to every
  future visitor — the one place in this app where getting it wrong is a
  stored XSS hole, not a cosmetic bug.

Both are the kind of thing a quick manual pass can miss: the first only
shows up if you check what else the word "yours" appears near on the page,
the second only matters once real strangers can write real text. I verified
the whole slice against the exact image `Dockerfile` builds — built it
locally with `sudo docker build`, ran it with a `--tmpfs /data` the same way
`.github/workflows/checks.yml` does, and ran `pnpm check` against that
running container rather than against a locally-started dev process, so
what passed is what CI would see. I also drove it with `agent-browser`
directly: filled and submitted the form, reloaded to confirm the colophon
was still there and still marked "yours", resized from 1280×800 to
390×844 mid-typing and confirmed the textarea kept its value and focus, and
tabbed through the page to confirm the horizontal scroll strip is
keyboard-reachable and arrow-key scrollable, not just mouse-draggable.

## The stack, and what it costs

Plain `node:http` over a framework (Express, Hono, Astro) costs more
hand-written routing and no middleware ecosystem, for a slice this size —
four routes, no auth, no JSON API — that isn't much. What it buys is
directness: every request's path from cookie to database to rendered HTML
is one file, `src/server.ts`, readable start to end, which matters more
than middleware convenience while the whole shape of the app is still
being decided. `node:sqlite` over `better-sqlite3` (used on an earlier crit
in this same course) costs the newer, less-battle-tested API; it buys no
native module to compile in the Docker image at all, which is a real
simplification against the 256MB memory ceiling and the one-machine
constraint this repo runs under. Neither choice is final — if the real-time
layer next week needs more than an `EventSource` and a `node:sqlite` poll
can comfortably give, that trade-off gets revisited and the reasoning
recorded here, not silently abandoned.

## What's next

Crit 9 asks for real-time (a colophon appearing in every open session
within about a second) and one written decision about how the app behaves
with several people writing at once. The schema here is already the
smallest version that can carry both: adding a broadcast on write and
picking what happens when two people submit close together are the two
concrete next steps, not a redesign.
