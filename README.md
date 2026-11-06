# Colophon

A handscroll painting stays open on the page. Under it, in the order they were
written, sit the notes strangers have left in its margin — one line each, no
account, no name, nothing that can be edited or deleted once it's there.

## What good means here

Chinese handscrolls were never finished when the painter set the brush down.
Later owners and admirers kept adding their own inscriptions and seals after
the image, sheet by sheet, so that a scroll only a foot square in its painted
part could grow twenty feet long from six centuries of appended commentary —
the [Met's history of the format](https://www.metmuseum.org/essays/chinese-handscrolls)
calls this "a continuous dialogue" between the work and everyone who has since
sat with it. That is the shape of multi-user, real-time and persistent I
wanted: not a feed, but one object a small, unhurried stream of people add to,
permanently.

Three other things I read while deciding what small and good means:

- Robin Sloan's [_An app can be a home-cooked meal_](https://www.robinsloan.com/notes/home-cooked-app/)
  argues a tiny app's best case is not that it will grow but that it is
  finished and answers only to the few people it was built for.
- [Hundred Rabbits](https://sourcehut.org/blog/2021-12-08-100-rabbits-interview/),
  who build their own software from a sailboat, say "if we can use less
  technology to solve any one task, we will" and prize software that "gets
  smaller over time, that sheds the superfluous" — this is a tool for one
  painting, not a platform for any painting.
- Bernie DeKoven's [_The Well-Played Game_](https://www.deepfun.com/fun-store/the-well-played-game/)
  values playing well together over any individual score — there is no
  score here, no likes, nothing to win.

## What I chose not to build

No accounts, avatars or profiles: a visitor is only the anonymous seal their
browser is given. No editing or deleting a colophon once it's written, since
ink doesn't come back off the paper, and a 320-character limit keeps a visitor
considering a line rather than typing a paragraph. No likes, replies, threads,
notifications or typing indicators.

Scrolls were also unrolled at gatherings of a few friends, so the page shows
the seals of whoever has it open right now, and lets them go when they leave. Presence is wet ink and is never written down; only a colophon is.
[`decisions/0001-who-else-is-here.md`](decisions/0001-who-else-is-here.md)
weighs that against the alternatives. A screen reader hears each new colophon
as it arrives but never who comes and goes
([`decisions/0002-hearing-new-ink.md`](decisions/0002-hearing-new-ink.md)).

What a person may do is decided on the server from their seal alone: read
everyone's colophons, add their own, and change or delete nothing, theirs
included. The server logs what each person does (writing, being turned away,
trying to change a line) under a pseudonym derived from their seal, and never
logs that someone was merely looking
([`decisions/0003-who-did-what.md`](decisions/0003-who-did-what.md)).

## What's enforced, what's judged

Enforced, against the running app: a colophon persists, only your own are
marked yours, and an empty or over-length line is rejected, never truncated
(`spec/colophon.test.ts`); a new colophon reaches every open page within a
second and replays after a reconnect, and presence never carries a token
(`spec/live.test.ts`); nothing can be changed or deleted, and logs name a
pseudonym, never a token (`spec/who-did-what.test.ts`); the accent marks only
your own lines (`spec/accent.test.ts`).

Judged: whether the margin reads like colophons rather than chat. After the
crits, most of its twenty lines were greetings and tests ("helooo", "delete
this"). The form now asks what the painting makes you think of
([`decisions/0004-asking-for-a-colophon.md`](decisions/0004-asking-for-a-colophon.md));
by 7 November no one had written since, so it's untested: the margin still
reads like chat.
