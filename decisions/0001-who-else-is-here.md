# 1. Who else is here: the seals of current readers, never written down

## Context

The scroll goes real-time this week: a colophon written in one browser has to
appear in every other open one within about a second. That settles how ink
travels. It doesn't settle the question `README.md` cares about more, which is
what a visitor can know about the other people looking at the same painting
right now, before any of them has written anything.

The history the app is built on has two answers to this, and they pull in
opposite directions. A colophon is asynchronous: a collector in 1500 writes
after one in 1400, and neither knows the other. But scrolls were also unrolled
in company. A _yaji_ (雅集, "elegant gathering") was a handful of friends
looking at one painting together, and the inscriptions on many scrolls were
written at exactly such a gathering. Viewing inscriptions (觀款) went further,
recording permanently that someone had merely seen the work. The brief asks for
an app that is more interesting because other people are using it at the same
time. At the crit, a pod opens it on their own devices at once.

## Options considered

1. **Only ink travels.** Nobody can see anyone else until they write. This is
   the purest reading of "a colophon is asynchronous", and the cheapest. It
   would mean a room full of people at the crit sees a page indistinguishable
   from an empty one until someone commits a line. Co-presence would exist on
   the server and nowhere a person could feel it.
2. **A reader count** ("3 reading now"). Easy and familiar, and the median
   answer. A number is a metric, and the README rules out anything that reads
   like a score.
3. **The seals of current readers, shown while they're here and gone when they
   leave.** Each open browser shows its seal glyph in a small row above the
   colophons. One browser with three tabs is one seal. Nothing about it is
   stored.
4. **Persistent viewing marks**, the 觀款 option: record every visit forever as
   a faint seal on the scroll. Historically real, but it turns looking into
   writing without the looker's consent, and grows a permanent log of who was
   here when, which is exactly the kind of record an anonymous app shouldn't
   keep.
5. **Typing indicators** (someone is composing). Rejected in any combination
   with the above: a half-written line isn't ink yet, and showing it pressures
   the writer to hurry a line the 320-character limit exists to slow down.

## Decision

Option 3. Presence is wet ink, colophons are dry ink. While you're on the page
your seal sits in the "looking now" row for everyone else; when you leave it
goes, and nothing on disk ever knew it was there. Only a written colophon is
persisted, and only a written colophon is marked with the accent colour. The
seal row stays in `--ink-soft`, since "this colophon is yours" is the accent's
only meaning.

Two smaller choices follow from it. A departure is announced after a three
second grace period, so a writer whose page reloads after posting doesn't
blink out and back for everyone else. And a reconnect replays every colophon
written since the last one the browser saw (the stream's `Last-Event-ID`),
which an append-only scroll can do exactly: nothing ever changes, so "what you
missed" is just "every row with a higher id".

## What it costs

- Presence reveals timing. Anyone looking can tell that the seal 鑑 arrived at
  2:14 and a colophon sealed 鑑 appeared at 2:16. With twelve glyphs and a
  small audience that's a weak link between "a reader" and "a writer", but it's
  a real one, and option 1 wouldn't have it.
- Seals collide. Twelve glyphs means two strangers can share one, so the row
  can't tell you how many distinct people are here with certainty, only roughly
  who.
- It needs a long-lived connection per open page and a server that remembers
  who is connected, which ties the app to one machine (fine on this course's
  one-machine Fly setup, a rewrite on two). After a restart the row is empty
  until browsers reconnect, usually within a couple of seconds.
- Without JavaScript there's no seal row at all. Reading and writing still
  work, since those are the core interaction; seeing who else is here is the
  enhancement.
