# 3. Who did what: log ink and refusals, never looking

## Context

The app already tells people apart: each browser carries one anonymous seal
token in an `HttpOnly` cookie, and the server alone decides from it which
colophons are "yours". Nothing else about what a person may do has ever been
written down in one place, and nothing is logged beyond the line saying the
server started. When the deployed app misbehaves, or when two people use it
side by side and someone has to say afterwards who did what, the server's
output is silent.

Two constraints from earlier decisions shape what a log may hold. The token
is the visitor's whole identity, so it can never appear anywhere but their own
`Set-Cookie` (Fly keeps logs, and anyone reading them could write as that
visitor). And [decision 1](0001-who-else-is-here.md) rejected a permanent
record of who was here when; a log line per page view or per stream would be
exactly that record, kept by the hosting provider instead of the database.

## What each person may see and change

Checked on the server, on every request, from the seal cookie and nothing the
browser could claim in a form field:

- **see**: every colophon, everyone's. The scroll is public; that's its point.
  The "yours" mark is computed per request against the cookie's token, never
  stored in or sent from the page.
- **add**: one colophon per post, attributed to the cookie's token. The body
  can't name a different author, because there's no author field to fill.
- **change or delete**: nothing, including your own. There is no route for it,
  and any attempt (`PUT`, `PATCH`, `DELETE` or `POST` against
  `/colophons/<id>`) is answered `405` and logged as refused, so "can one of
  them change the other's?" has an answer in the log, not just in the code.

## Options considered for the log

1. **Log nothing per person.** Keeps anonymity absolute, and leaves the
   operator unable to say who did anything.
2. **Log the seal glyph.** Readable, but twelve glyphs collide: two people in
   one room share a glyph one time in twelve, and the log couldn't separate
   them.
3. **Log a pseudonym derived from the token**: the seal glyph plus the first
   six hex characters of the token's SHA-256 (`鑑·3fa2c1`). Stable for one
   browser, different between browsers, and not reversible to the token, so
   reading the log grants no power to write as anyone.
4. **Log every request**, page views and streams included. Most diagnostic,
   and a full history of who was looking when.

## Decision

Option 3, applied to things a person *does*, never to the fact of looking:

- `seal` when a browser is given its seal for the first time
- `write` when a colophon is added: its id, its length and its opening text
  (the text is public on the scroll anyway)
- `reject` when a write is refused for being empty, too long or too large
- `refused` when anyone tries to change or delete a colophon
- `error` when a request throws, with its method and path

Page views, presence arrivals and departures, and stream connections are not
logged per person. Each line is `event=… who=… key=value`, with any visitor
text JSON-quoted, so a colophon containing a line break can't forge a second
log line.

## What it costs

- The log is a history of when each pseudonym wrote, kept by Fly for as long
  as Fly keeps it. Since every colophon is already dated on the public scroll,
  this adds the pseudonym link between a person's several lines, which the
  page itself only shows to that person. That is the price of being able to
  say who did what.
- The narrator can tell what each person did, but not when someone merely
  opened the page and left. A visitor who only reads leaves one `seal` line on
  their first visit and nothing afterwards.
- Six hex characters can collide too, one pair in about sixteen million;
  enough for a room, not a proof of identity.
- A stolen cookie is a stolen identity, here as everywhere: the log would show
  the thief under the owner's pseudonym.
