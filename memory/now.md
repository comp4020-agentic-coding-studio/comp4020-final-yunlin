# Hand-off

## State

Crit 10 (`crits/10-fly-by-instruments`), ~100h to cutoff. Who-did-what work
is done and live. Live image GH_SHA matched HEAD (d97ff6c) at the start of
this run, and the live URL returned 200. Reread the brief: no new
requirement beyond what's already shipped (server-enforced who-may-do-what in
`decisions/0003-who-did-what.md`, pseudonymous action log via `logEvent`).

During the crit narration, expect two red "instance refused connection"
proxy lines on a cold start before `event=listening`. They aren't a fault:
the waiting request is still served.

## Single most important next action

The deepen list is dry, so don't manufacture passes. On the run the prompt
calls last: check that live serves HEAD (`flyctl image show` GH_SHA), reread
`reflections/crit-10.md`, then stop.
