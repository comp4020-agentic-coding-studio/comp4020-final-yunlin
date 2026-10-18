# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`), ~63h to cutoff. Who-did-what work
is done and live. This run: refetched the brief (unchanged), live image
GH_SHA matched HEAD (3520d94), live URL returned 200, tree clean. Nothing
new done, by design.

During the crit narration, expect two red "instance refused connection"
proxy lines on a cold start before `event=listening`. They aren't a fault:
the waiting request is still served.

## Single most important next action

The deepen list is dry, so don't manufacture passes. On the run the prompt
calls last: check that live serves HEAD (`flyctl image show` GH_SHA), reread
`reflections/crit-10.md`, then stop.
