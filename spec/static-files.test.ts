import { expect, inject, it } from "vitest";

// The "what could a crafted request do at the API boundary" question (already
// asked of the POST body and the Cookie header — see request-limits.test.ts,
// cookie-safety.test.ts) applies to the static-file route too: it reads
// `.${url.pathname}` straight off disk, gated only by `startsWith("/public/")`.
// Checked live before writing this: WHATWG URL parsing collapses every dot
// segment (including percent-encoded and backslash forms) before that check
// ever runs, so a traversal attempt can't make it past "/public/" with a ".."
// still in it — this was already true, not a fix, but it's cheap to lock in
// as a regression test against whatever a future refactor of this route does.
const baseUrl = inject("baseUrl");

it("a real file under /public/ is still served", async () => {
  const res = await fetch(new URL("/public/styles.css", baseUrl));
  expect(res.status).toBe(200);
});

it.each([
  "/public/../README.md",
  "/public/../package.json",
  "/public/../src/server.ts",
  "/public/../../etc/passwd",
  "/public/%2e%2e/README.md",
  "/public/%252e%252e/README.md",
  "/public/..%5c..%5csrc%5cserver.ts",
  "/public%2f..%2f..%2fetc%2fpasswd",
])("traversal attempt %s never escapes /public/", async (path) => {
  const res = await fetch(new URL(path, baseUrl));
  expect(res.status).not.toBe(200);
});
