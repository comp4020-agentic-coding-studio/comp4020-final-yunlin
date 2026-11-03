# 4. Asking for a colophon, not a message

## Context

After the crits I read the live margin: twenty lines, nearly all greetings and
tests ("HI", "helooo", "delete this", "Apple"). `README.md` judges the app on
whether the margin reads like colophons rather than chat, and by that measure
it doesn't yet.

The write form is part of the reason. It is a blank box labelled "A line for
the margin" under a heading "Add yours". Nothing on it mentions the painting.
A blank box on a page other people are looking at reads as a chat input, and
people answer it the way they answer one: by saying hello to whoever else is
there. A historical colophon is never addressed to the other readers. It
answers the painting: what the writer saw in it, what it reminded them of, who
they looked at it with.

## Options considered

1. **Change only the argument.** Keep the app, and let the README keep saying
   the margin reads like chat. Honest, and free, but it leaves the one claim
   the app is judged on knowingly unmet with a week still to go.
2. **Filter what's written**: a minimum word count, or rejecting "test" and
   greetings. Rejected. The server can't tell a considered line from a
   careless one, a sincere four-word line would be turned away, and the
   harness only lets the boundary reject an empty or over-long line. Judging
   content at the boundary is the moderation this app chose not to have.
3. **One colophon per seal.** A collector usually inscribed a scroll once, and
   scarcity would make a line worth considering. Rejected for now: a seal is a
   cookie, so the limit is trivially escaped, and it would stop someone
   adding a second, better line after a first careless one.
4. **Ask for a colophon.** Point the form at the painting: say what a colophon
   was for, and ask the visitor what they see in it. No new mechanism, no rule
   about content, only words on the page that make a response to the painting
   the obvious thing to write.

## Decision

Option 4. The heading asks the visitor to write in the scroll; a sentence
under it says what collectors wrote there; the label asks what the painting
makes them think of. The section note above the colophons says they are
responses to the painting, oldest first.

## What it costs

- The page now tells the visitor what to write, which is more direction than
  an empty margin gives. A visitor can still write anything; the form only
  says what the margin is for.
- It may not work. Whether it does is judged, not enforced: I'll reread the
  live margin before the deadline and report in `README.md` what it shows,
  including if it still reads like chat.
- The twenty lines already written stay. Nothing can be deleted, mine
  included, so the margin carries its own first, chattier week permanently.
