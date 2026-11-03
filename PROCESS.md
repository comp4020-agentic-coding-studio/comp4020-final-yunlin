# Process overview

## From the brief to the object

The brief fixes three requirements (multi-user, real-time, persistent) and
leaves "good" open. I started from the lens this agent has carried since its first crit, Ni Zan and
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
framework, no bundler. On Node 24.21, checked directly, it runs `.ts` unmodified, and `node:sqlite` needs no native module compiled in
Docker, so the image is one `pnpm install --prod` and the same source the repo
typechecks. The cost is hand-written routing and a newer, less battle-tested
SQLite binding. For five routes, cheap.

Real-time is server-sent events
([`340c133`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/340c133)).
Everything that travels goes server to browser: a new colophon, or a change
in who's looking. Writing stays a plain form post, which must work with JavaScript off.
WebSockets would add a second write path for no gain, and polling fast enough to hit "within a second" would
be a request per second per open page on a 256MB machine. SSE also gives
reconnection for free: the browser resends the id of the last event it saw,
and because the scroll is append-only, "what you missed" is exactly every row
with a higher id. The cost is that presence lives in one process's memory,
which ties the app to one machine. The course gives it one machine.

## Several people at once

The crit 9 decision, [`decisions/0001-who-else-is-here.md`](decisions/0001-who-else-is-here.md),
was committed ([`2a7d6e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/2a7d6e3)) before any code. My first instinct was that only
ink should travel, since a colophon is asynchronous. Rereading the history
overturned it: scrolls were unrolled at gatherings of friends, and many
inscriptions were written there. So the page shows the seals of whoever has it
open, and presence is wet ink, never stored. The record weighs this against a
reader count, permanent viewing marks and typing indicators, and names the
costs: presence leaks timing, and twelve glyphs collide.

The decision then landed in all three places the brief asks to agree
([`a7c9b80`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/a7c9b80)): the README's reason, two `CLAUDE.md` rules, and
`spec/live.test.ts` over real event streams. I broke the code three ways and each
break failed its test. They still missed what the deployed app showed: Chrome's back-forward cache
kept a departed page's stream open, so its seal stayed in the row
([`a777b00`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/a777b00)). A second record ([`1953a16`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/1953a16), code in [`1042539`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/1042539))
covers screen-reader users, who heard nothing when someone wrote: new
colophons are announced, arrivals never are.

## Telling people apart, from the logs

For crit 10 the server already told people apart by seal cookie, but logged
nothing. The record ([`e808a8c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/e808a8c), before the code again) reconciles a log
with two earlier rules, no token outside its own `Set-Cookie` and no record of
who was looking: the log names a pseudonym (glyph plus six hex of the token's
hash, since the glyph alone collides one time in twelve) and only for actions.
An attempt to change a line is now answered `405` and logged ([`7920510`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/7920510)).

## Judging the judged claim

After the crits I read the live margin: nearly all greetings and tests. The
fourth record ([`57c96a2`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/57c96a2)) traced part of that to a blank form
that never mentioned the painting, and chose changing the ask over content
filters or one line per seal ([`1aa0107`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/1aa0107)). Whether it worked can
only be judged; the README will report what the margin shows.

## Corrections that landed in the harness

Each fix left a test or rule behind:

- `--seal` had drifted into three meanings despite the rule; a test now greps
  every use ([`6a3ecdf`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/6a3ecdf))
- two attempts at capping the POST body raced the client into connection
  errors, caught only by repeated runs against the built image, before
  draining the body held ([`abd5dc4`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/abd5dc4), [`9ef7505`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/9ef7505))
- a `seal=%` cookie crashed the process ([`6b5e6fb`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/6b5e6fb)), and a 15KB one
  persisted on every colophon its sender wrote ([`791839c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/791839c)); a client
  hanging up mid-post, or a request for `//`, also killed it until one error
  boundary held everything ([`f0166ba`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/f0166ba))
- a right-to-left override in a colophon could reverse a log line
  ([`7fc81a4`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/7fc81a4))
- one unbroken word blew the page out sideways, a permanent scar on an
  append-only scroll ([`487d6bc`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/487d6bc))
- my traversal test couldn't fail: `fetch` normalised `..` away
  ([`e58a34c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/e58a34c))
- 800 streams opened at once took the server to 3.7 GB against a 256 MB
  machine; presence now goes out once per burst and a stalled stream is
  dropped ([`801c6a1`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/801c6a1), [`28be3b0`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/28be3b0))
- a 320-character colophon with line breaks was rejected, since the form
  sends CRLF ([`f1f23da`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/f1f23da)), and `maxlength` silently cut a paste mid-word,
  the truncation the harness forbids; the limit now lives only on the server
  ([`f3566e1`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/f3566e1))
- the README misquoted Hundred Rabbits ([`f7d259f`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/f7d259f))

## The agent workflow, and what it costs

I work in stateless runs: each reads the course page, the repo and
`memory/now.md`, does one job, commits and hands off. One long session would remember why a line exists, but would also carry its
wrong assumptions forward unexamined.
Stateless runs force every reason into the repo, where a marker can read it.
The cost is re-orienting every run and a hand-off that can be wrong, so I
treat its "next action" as a hypothesis: a crit 8 run told to build real-time
early declined, because crit 8's brief said real-time could wait.

Grounding means the spec runs against the image CI builds, and persistence
was checked by restarting the live Fly machine.

Correction means the fix lands where the next run will meet it: a `spec/`
test, a `CLAUDE.md` rule, or a decision record for a choice someone could
argue the other way. Writing the record first commits me to a position before I've tried it; in
return the code can be read against a reason.

The plainest cost is time spent finding nothing: asking one question of one
boundary at a time found most of the bugs above, and long runs of clean ticks ([`766cef5`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/766cef5) to
[`2e78da6`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/2e78da6)). Someone holding the whole design at once might have
seen several of those bugs together.
