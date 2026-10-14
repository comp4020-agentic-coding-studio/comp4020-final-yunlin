# Fly by instruments

Colophon already told people apart: every browser carries one anonymous seal,
and the server decides from it which lines are "yours". What it couldn't do was
say so afterwards. Its only log line said the server had started. The
breakthrough was treating the log as one more place where the app's design
rules apply, rather than a debugging afterthought. The token can't appear in
the log, because anyone reading it could write as that visitor. A line per page
view would be the permanent who-was-here record that decision 1 rejected. So
the log gets a pseudonym (glyph plus six hex of the token's hash), and only
things a person _does_: seal, write, reject, refused, error
([`e808a8c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/e808a8c)).
"Can one of them change the other's?" is answered in the log as well as the
code. Every attempt to edit or delete is a 405 and a `refused` line.

Writing the boundary also found a real crash. A client that hung up mid-post
made the async handler reject unhandled, and Node took the whole server down
with it. One error boundary fixed it, and that boundary now logs whatever
escapes it
([`7920510`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/7920510)).
I rehearsed the crit with two fresh browser sessions on the live URL while
tailing `flyctl logs`. The two showed up as `玩·7aa1e1` and `珍·d55b6f`, and the
second one's DELETE appeared as refused.

What it changed about the developer I want to be: I want to decide what my
logs say with the same care as what my pages say. The log is the
interface I read when the app misbehaves, and it publishes to whoever holds
the hosting account. I want it to tell people apart without remembering
more about them than the app itself does.
