# Process overview

## From the brief to the object

The brief fixes three requirements (multi-user, real-time, persistent) and
leaves "good" open. Rather than pick a stack and look for a use for it, I
started from the lens this agent has carried since its first crit, Ni Zan and
"taste is what you leave out", and asked what a multi-user, real-time,
persistent object already looks like in that world. Handscroll colophons
answered directly: strangers appending a line each to the same painting for six
centuries, nobody editing anyone else's. `README.md`
([`8d76d80`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/8d76d80))
argues it from the Met's history of the format, Robin Sloan's home-cooked app
and Hundred Rabbits. My position on that small-web writing is narrower than
theirs: I care less about an app being small than about it being _finished_
in Sloan's sense, a fixed shape that strangers add to.

## The stack, and what it costs

[`334d24f`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/334d24f)
is the first slice: `node:http` and `node:sqlite`, both Node stdlib, no
framework, no bundler. I checked Node 24.21 directly before committing to it:
it runs `.ts` unmodified, and `node:sqlite` needs no native module compiled in
Docker, so the image is one `pnpm install --prod` and the same source the repo
typechecks. The cost is hand-written routing and a newer, less battle-tested
SQLite binding. For five routes and no auth that's cheap.

Real-time is server-sent events
([`340c133`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/340c133)).
Everything that travels here goes one way, server to browser: a new colophon,
or a change in who's looking. Writing stays a plain form post, which the
harness requires to work with JavaScript off. WebSockets would add a second
write path for no gain, and polling fast enough to hit "within a second" would
be a request per second per open page on a 256MB machine. SSE also gives
reconnection for free: the browser resends the id of the last event it saw,
and because the scroll is append-only, "what you missed" is exactly every row
with a higher id. The cost is that presence lives in one process's memory,
which ties the app to one machine. The course gives it one machine.

## Several people at once

This week's decision is in
[`decisions/0001-who-else-is-here.md`](decisions/0001-who-else-is-here.md),
written and committed
([`2a7d6e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/2a7d6e3))
before any of the code. The question that mattered was whether a visitor can
see who else is looking. My first instinct was "nobody, only ink travels",
since a colophon is asynchronous by nature. Rereading the history turned that
over. Scrolls were unrolled at gatherings of friends, and many inscriptions
were written at exactly such a gathering, so the page now shows the seals of
whoever has it open and lets them go when they leave. Presence is wet ink and
is never stored; only a colophon is. The record weighs this against a reader
count (a metric, which the README rules out), permanent viewing marks
(surveillance dressed as history) and typing indicators, and names the costs:
presence leaks timing, and twelve glyphs collide.

The decision then had to land in all three places the brief marks for
agreement
([`a7c9b80`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/a7c9b80)).
`README.md` says why, `CLAUDE.md` gained two rules (presence never touches disk
and no token ever goes over the stream; a change to shared behaviour starts as
a decision record), and `spec/live.test.ts` holds the app to it over real event
streams. Before trusting those tests I broke the code three ways (no
broadcast, no replay, never forgetting a closed stream), and each break failed
the test that names it. They still missed one thing, which only the deployed
app showed: a browser that navigated away kept its seal in the row, because
Chrome holds the departed page in its back-forward cache with the stream still
open. The fix closes the stream on `pagehide`, and a new test runs the served
script to hold it
([`a777b00`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/a777b00)).

The first record had also left someone out: a screen-reader user heard nothing
when another person wrote, so for them the page wasn't real-time at all. A
second record
([`1953a16`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/1953a16))
extends the wet/dry split to sound, announcing new colophons but never
arrivals, and collapsing a reconnect's replay to a count; the code followed
([`1042539`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/1042539)).

## Corrections that landed in the harness

Most of what the agent got wrong surfaced by asking one question of one
boundary at a time, and each fix left a test or a rule behind:

- `--seal` had drifted into three meanings besides "this colophon is yours",
  despite the rule saying otherwise. Fixed, plus a test that greps every use
  ([`6a3ecdf`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/6a3ecdf))
- the POST body had no size cap. Two attempts at rejecting it early raced the
  client into connection errors, caught only by repeated runs against the
  built image, before draining the body to its end held
  ([`abd5dc4`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/abd5dc4),
  [`9ef7505`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/9ef7505))
- a `seal=%` cookie crashed the whole process
  ([`6b5e6fb`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/6b5e6fb)),
  and a 15KB one persisted forever on every colophon its sender wrote
  ([`791839c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/791839c))
- one unbroken word blew the page out sideways. On an append-only scroll that
  is a permanent scar, not an annoyance
  ([`487d6bc`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/487d6bc))
- my own traversal test couldn't fail: `fetch` normalised `..` away before
  sending
  ([`e58a34c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/e58a34c))
- every reader's arrival sent the whole room's presence to the whole room, so
  800 streams opened at once took the server to 3.7 GB against a 256 MB
  machine. Presence now goes out once per burst, and a stream that stops
  reading is dropped
  ([`801c6a1`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/801c6a1),
  [`28be3b0`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/28be3b0))
- a colophon the browser accepted at exactly 320 characters was rejected as
  too long whenever it had line breaks, since the form sends each as CRLF, and
  the visitor's words were lost with it. Found by typing one in a real browser
  ([`f1f23da`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/f1f23da))
- the README quoted Hundred Rabbits with a phrase the interview doesn't contain
  ([`f7d259f`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/f7d259f))

## How I directed, grounded and corrected the work

Each run starts from the course page and `memory/now.md`, and I treat the
hand-off's "next action" as a hypothesis rather than an order. A crit 8 run
was told to build the real-time layer early and declined, because crit 8's
brief said real-time could wait and the README already argued that week was
the smallest version of the object.

Grounding means checking against the real thing rather than a stand-in. The
spec runs against the image the `Dockerfile` builds, with a throwaway `/data`
exactly as CI does, and timing-sensitive fixes run several times before I
trust them. Persistence was checked by restarting the live Fly machine with
colophons already on the scroll, since a tmpfs proves nothing about
persistence. Real-time was checked with two independent browser sessions: a
line written in one appeared in the other, marked "yours" only in the first. Claims in prose get the same treatment, so quotes are checked
against a source's raw HTML rather than a summary.

Correction means the fix lands where the next run will meet it: a `spec/` test
for a behaviour, a `CLAUDE.md` rule for a standard, or a decision record for a
choice someone could reasonably argue the other way.
