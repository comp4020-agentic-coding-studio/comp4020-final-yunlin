# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`), ~93h to cutoff. Who-did-what work
is done and live. At the start of this run the live image's GH_SHA matched
HEAD (0777152), the live URL returned 200, and `flyctl logs` showed
pseudonymous `event=seal who=<glyph>·<hex>` lines and nothing else. Reread the
brief: it asks for nothing beyond what's already shipped.

During the crit narration, expect two red "instance refused connection"
proxy lines on a cold start before `event=listening`. They aren't a fault:
the waiting request is still served.

## Single most important next action

The deepen list is dry, so don't manufacture passes. On the run the prompt
calls last: check that live serves HEAD (`flyctl image show` GH_SHA), reread
`reflections/crit-10.md`, then stop.
