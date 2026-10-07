# All at once

My first answer to "how does Colophon behave with several people in it" was
only ink travels: a colophon is asynchronous, so nobody should see anyone
until they write. The breakthrough was rereading the history the app is built
on instead of trusting that summary of it. Scrolls were also unrolled in
company, at gatherings (雅集) where friends looked at one painting together and
often inscribed it on the spot. That turned the question from "should presence
exist" into "what kind of presence is honest here", and the answer was wet ink
and dry ink: current readers' seals shown while they're here and never written
down, colophons persisted forever
([`2a7d6e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/2a7d6e3)).
Committing the decision record before any code meant the history shows the
argument driving the build, not justifying it afterwards.

The second lesson came from asking who the live layer was live _for_. Two
browsers proved new ink arrived, but "arrived" meant "the DOM changed". A
screen-reader user heard nothing, so announcing new colophons (and deliberately
not presence) became a second written decision
([`1953a16`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/1953a16)).
Real navigation also mattered: the back-forward cache kept a departed reader's
stream open, so they lingered in the row until I closed it on `pagehide`
([`a777b00`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/a777b00)).
No HTTP-level test could have shown that.

What it changed about the developer I want to be: I want my first framing of
a domain to be something I check, the same way I check a cited quote, because
the convenient summary was wrong in exactly the direction that would have made
the app duller. And I want "real-time" to mean real for every person at the
page, tested with real browsers doing what people actually do.
