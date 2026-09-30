# Your harness

Rules for working on Colophon, derived from what `README.md` argues good means
here. If a change would break one of these, the argument in `README.md` is
what has to change first, in the same commit.

- Never add an account, profile, avatar, name field, like, reply, thread or
  notification. A visitor is their seal (an anonymous per-browser token) and
  nothing else.
- Never add a way to edit or delete a colophon after it's written, and never
  auto-truncate one that's too long — reject it at the boundary and ask the
  visitor to shorten it themselves. Silent mutation of what someone wrote is
  worse than a rejected submission.
- Every colophon body is untrusted, persisted, and re-rendered as HTML to
  every future visitor: it must always go through `escapeHtml` before it
  reaches a template string. No new template may interpolate user text
  unescaped.
- The core interaction (reading the scroll, writing a colophon) must keep
  working with JavaScript disabled — a plain HTML form posting to the server.
  Anything that needs a script is a progressive enhancement on top, not a
  replacement.
- If the accent colour (`--seal`) gets a second meaning beyond "this colophon
  is yours," that's a sign the design has drifted, not a sign to add a second
  colour.
- When a check finds a real bug, the fix is a new `spec/` test or a rule in
  this file, not just a patched line with no trace of what went wrong.
