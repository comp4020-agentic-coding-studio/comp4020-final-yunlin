# 2. Hearing new ink: announce colophons, never presence

## Context

[Decision 1](0001-who-else-is-here.md) made colophons travel live and showed
current readers' seals in a "looking now" row. Both only reach a sighted
reader. A screen-reader user with the page open hears nothing when someone
else writes: the new line lands at the bottom of a list they may have read
minutes ago, and only re-reading the list would find it. For them the page is
not real-time at all.

## Options considered

1. **Silence.** New colophons arrive in the DOM and are found on the next pass
   through the list. Costs nothing, but it fails the brief for exactly the
   people a visual-only change already leaves out.
2. **Make the list itself a live region** (`aria-live` on the `<ol>`).
   Simple, but screen readers handle `aria-relevant="additions"` unevenly, and
   a long list as a live region risks re-reading far more than the new line.
3. **A separate, visually hidden status line that announces new colophons**,
   politely, after whatever the reader is already hearing. One arrival reads
   its text; several at once (a reconnect replaying what was missed) collapse
   to a count, so a returning reader isn't read a paragraph of strangers.
4. **Announce presence too** ("a reader with seal 鑑 arrived"). Rejected:
   arrivals and departures are frequent, mean nothing on their own, and would
   turn a quiet room into a doorbell. Decision 1 already keeps presence as
   wet ink in the corner of the eye; the screen-reader equivalent is leaving
   it in the page, found when the reader goes looking, never pushed at them.

## Decision

Option 3. Dry ink is announced, wet ink is not. The status line says "A new
colophon: …" with the line's own text, or "N new colophons at the end of the
list" when more than one arrives within a second.

## What it costs

- A colophon is read aloud to whoever is listening, unprompted, the moment it
  arrives. That is a stronger interruption than a sighted reader gets (a line
  quietly appearing below the fold), and a reader can't opt out short of
  turning the region off in their screen reader.
- The one-second batching window delays a lone announcement by up to a second.
- Like everything live, it needs JavaScript; without it the reader hears what
  the page held when it loaded, which is the same as everyone else without it.
