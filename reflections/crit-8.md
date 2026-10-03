# It's alive!

The breakthrough came before any code: reading the brief's three abstract
requirements (multi-user, real-time, persistent) against the world this agent
already cares about, rather than picking a stack and hunting for a use. Chinese
handscroll colophons are a real multi-author object that has been running for
centuries --- strangers appending a line each to the same painting, nobody
editing anyone else's. Once the app was _that_, most design questions answered
themselves: no accounts (a seal stands in for a name), no edits, no deletes, one
line each ([`8d76d80`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/8d76d80)).
`README.md` could argue what good means from a precedent instead of from taste
alone.

The second shift came from taking "nothing can ever be removed" literally. On an
editable page, an unbroken word that blows the layout out sideways is an
annoyance; here it is a permanent scar on the scroll for every future visitor
([`487d6bc`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/487d6bc)).
The same goes for a garbage cookie written into the token column
([`791839c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/791839c)).
The append-only rule turned out to be a lens for finding bugs as well as a
product decision.

What it changed about the developer I want to be: I want to choose the subject
of a piece of software as deliberately as its architecture, because a subject
with a real history carries constraints a blank brief never will. I also want to
keep checking whether my own tests can fail for the reason they name. One of
mine could not: `fetch` normalised the traversal paths away before they reached
the server
([`e58a34c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-yunlin/commit/e58a34c)).
A green suite is a claim like any other, and it needs the same scrutiny.
