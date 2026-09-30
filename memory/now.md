# Hand-off

## State

Third run on this deliverable, 147h to cutoff at the start of the run. The
prompt's course-source URL is still crit 8's own (`crits/08-its-alive.json`)
— confirmed by fetching it fresh rather than trusting the previous hand-off's
guess — so this run stayed inside crit 8's scope, same reasoning as the
second run: real-time is explicitly crit 9's, not this week's.

The second run's hand-off named the keyboard/resize/slow-connection/
forced-colors checks as the next work. Keyboard and resize were actually
already covered by the second run's own `agent-browser` pass (its `PROCESS.md`
account just didn't label them as the HD-band trio explicitly). This run ran
the two genuinely missing ones, both clean:

- **Slow connection**: throttled to 400kbps/400ms via a raw CDP script
  (`Network.emulateNetworkConditions`) against the built Docker image — full
  page loaded in ~1.8s, form present, no errors.
- **Forced-colors/prefers-contrast**: `Emulation.setEmulatedMedia` toggling
  `forced-colors: active` showed the page correctly inherits system colours
  (no `forced-color-adjust: none` opt-out anywhere); computed contrast ratios
  for every colour pair in `styles.css` all clear WCAG AA (4.68–12.73:1), so
  `prefers-contrast: more` having nothing to add is a clean result, not a gap.

Also ran a concurrent-write check on `addColophon` (10 genuinely parallel
`curl` POSTs) — all 10 landed exactly once, no lost writes. Clean.

Then found and fixed a real, severe bug by asking a new question: "what
could a crafted request do" extended from the POST body (already checked
twice) to the **Cookie header**. `seal=%` (invalid percent-encoding) crashed
the whole Node process via an uncaught `decodeURIComponent` throw — no
try/catch anywhere in the request path. Confirmed live: the container
exited; the bug was already exposed on the live Fly deployment before this
run started. Fixed
([`6b5e6fb`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/6b5e6fb)),
covered by `spec/cookie-safety.test.ts` (confirmed it actually fails against
the pre-fix code via `git stash`), verified against the built Docker image,
**redeployed the same run** (didn't wait for a finishing run, since the app
was already live-vulnerable), and reconfirmed clean against
`https://comp4020-final-yunlin.fly.dev/` afterward. `PROCESS.md` updated to
account for this (now ~1181 words — no enforced ceiling found in
`scripts/check-evidence.ts`, this is just a self-set target from prior runs;
didn't chase it below ~1180 since there's real substance to report).

Grepped every other client-controlled input the request handler touches
(`content-length`, the URL itself) for the same "what if this throws"
question — both already safe (`Number()` never throws, `new URL()` doesn't
throw on malformed percent-encoding). Checked `/public/` path traversal too:
blocked by the URL parser's own dot-segment normalisation plus the MIME
extension allowlist. This lens is now exhausted for this app.

Repo-local `memory/MEMORY.md` and the global one both updated with the
Cookie-header lesson, per the standing practice of keeping both in sync.

## What's not done yet

- `reflections/crit-8.md` still doesn't exist — still deliberately deferred
  to whichever run is called last for this crit's window.
- No real-time layer. Don't start it until a run fetches crit 9's own
  course-source URL directly.
- A second-tab live-update check has nothing to test yet (no broadcast
  layer exists) — wait for crit 9.
- Haven't yet checked: JS-disabled end-to-end (trivial here since the app
  ships zero client-side `<script>` at all — the "must work with JS off"
  rule in `CLAUDE.md` is satisfied by construction, but worth an explicit
  `agent-browser` pass with script execution disabled if a future run wants
  to close this out formally rather than by inspection).

## Single most important next action

Whichever run reads this next: fetch the prompt's course-source URL fresh
before doing anything else — don't assume it's still crit 8 just because
this file says so. If it's moved to crit 9, read that brief and build the
real-time layer from it. If it's still crit 8, this crit's own bar (proof of
life, README argument, harness rules) is solid and thoroughly checked at
this point — the next fresh angle, if one is still needed, should come from
a genuinely new question (not a re-verification of keyboard/resize/slow-
connection/forced-colors/concurrency/crafted-header, all now closed clean
or fixed), or it may be time to treat this deepen phase as dry for crit 8
specifically and hold until crit 9's brief actually exists.
