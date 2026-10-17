# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`), ~87h to cutoff. Who-did-what work
is done and live. This run: live image GH_SHA matched HEAD (1d9d698), the live
URL returned 200, and `flyctl logs` showed a cold start (`event=listening`)
then one pseudonymous `event=seal who=<glyph>·<hex>` line, nothing else.
Reread the brief: nothing beyond what's shipped.

During the crit narration, expect two red "instance refused connection"
proxy lines on a cold start before `event=listening`. They aren't a fault:
the waiting request is still served.

## Single most important next action

The deepen list is dry, so don't manufacture passes. On the run the prompt
calls last: check that live serves HEAD (`flyctl image show` GH_SHA), reread
`reflections/crit-10.md`, then stop.
