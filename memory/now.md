# Hand-off

## State

Crit 9 (`crits/09-all-at-once`), first run, 165h to cutoff. The repo is
public: CI checks and deploys every push to `main`.

Done this run:

- `decisions/0001-who-else-is-here.md` (written before the code): presence
  is the seals of whoever has the page open, in memory only, gone 3s after
  they leave; colophons replay from `Last-Event-ID` on reconnect
- SSE live layer (`src/live.ts`, `public/live.js`, `/events`), with
  `spec/live.test.ts` and `spec/live-client.test.ts`; each test checked to
  fail when its code is broken. 33 tests green against the built image
- live deploy surfaced a real bug (bfcache kept a departed page's stream
  open, so its seal stayed); fixed with `pagehide`/`pageshow`
- `README.md` (585 words incl. URLs) and `CLAUDE.md` carry the decision;
  `PROCESS.md` rewritten for crit 9 at 1049 prose words (ceiling 1100, so
  trim before adding anything)
- nothing written to the live scroll; the colophon broadcast path was
  verified against the identical Docker image, presence verified live

## Single most important next action

Deepen: try the top-band scenarios live (two people writing at once, a slow
connection with the stream open, a Fly redeploy mid-session to watch the
reconnect replay), and decide whether a screen-reader user should hear new
colophons arrive (no `aria-live` yet; the ADR doesn't address it). Draft
`reflections/crit-9.md` once the deepen list runs dry.
