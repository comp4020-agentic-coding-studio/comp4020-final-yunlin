# Colophon

A handscroll painting stays open on the page. Under it, in the order they were
written, sit the notes strangers have left in its margin — one line each, no
account, no name, nothing that can be edited or deleted once it's there. It is
alive the way a scroll is alive: everyone who has ever unrolled it left
something behind, and the next person can still find it.

## What good means here

Chinese handscrolls were never finished when the painter set the brush down.
Later owners and admirers kept adding their own inscriptions and seals after
the image, sheet by sheet, so that a scroll only a foot square in its painted
part could grow twenty feet long from six centuries of appended commentary —
the [Met's history of the format](https://www.metmuseum.org/essays/chinese-handscrolls)
calls this "a continuous dialogue" between the work and everyone who has since
sat with it. That is the shape of multi-user, real-time and persistent I
wanted: not a feed, but one object that a small, unhurried stream of people
add to, permanently, leaving a trace the next visitor can actually find.

Three other things I read while deciding what small and good looks like here:

- Robin Sloan's [_An app can be a home-cooked meal_](https://www.robinsloan.com/notes/home-cooked-app/)
  argues the best case for a tiny app is never that it will grow, but that it
  is finished, sovereign and answers only to the few people it was built for.
  This app answers to whoever writes in the margin, not to a growth number.
- [Hundred Rabbits](https://sourcehut.org/blog/2021-12-08-100-rabbits-interview/),
  who build their own software from a sailboat, say "if we can use less
  technology to solve any one task, we will" and prize software that "gets
  smaller over time, that sheds the superfluous" — the whole app is closer
  to a workshop tool built for one particular painting than a platform
  built to hold any painting at all.
- Bernie DeKoven's [_The Well-Played Game_](https://www.deepfun.com/fun-store/the-well-played-game/)
  says a shared act is worth more for the quality of playing it together than
  for any individual score — there is no score here, no likes, nothing to
  win, only the quality of what gets left behind.

## What I chose not to build

No accounts, avatars or profiles: a visitor is only the anonymous seal their
browser is given on first visit, the way a real seal marks presence without
disclosing a name. No editing or deleting a colophon once it's written, since
ink doesn't come back off the paper, and a 320-character limit keeps a visitor
considering a line rather than typing a paragraph. No likes, replies, threads,
notifications or typing indicators.

Scrolls were also unrolled in company, at gatherings of a few friends, so the
page shows the seals of whoever has it open right now, and lets them go when
they leave. Presence is wet ink and is never written down; only a colophon is.
[`decisions/0001-who-else-is-here.md`](decisions/0001-who-else-is-here.md)
weighs that against the alternatives.

## What's enforced, what's judged

`spec/` checks that a colophon is still there on the next request, that only
your own are marked as yours, that an empty or over-length line is rejected
rather than truncated, and that a new colophon reaches every other open page
within a second, replays after a reconnect, and that presence carries seals
but never anyone's token. Whether what accumulates reads like a colophon
(considered, brief, worth adding to a shared object) rather than chat is not
something a test can check; that's for whoever reads the margin to judge.
