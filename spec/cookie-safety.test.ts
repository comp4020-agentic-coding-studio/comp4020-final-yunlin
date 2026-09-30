import { expect, inject, it } from "vitest";

// A visitor's own Cookie header is as untrusted as any POST body — the same
// "what could a crafted request do at the API boundary" question this repo's
// other spec/ files already ask of the write endpoint. Before the fix this
// test guards, a seal cookie with a percent-encoding decodeURIComponent
// rejects (a bare "%", say) threw synchronously inside the request handler
// and took the whole single-machine process down: every visitor, not just
// the one who sent it, got nothing until the deploy restarted.
const baseUrl = inject("baseUrl");

it("a malformed seal cookie doesn't crash the request", async () => {
  const res = await fetch(new URL("/", baseUrl), { headers: { Cookie: "seal=%" } });
  expect(res.status).toBe(200);
  expect(res.headers.get("set-cookie"), "expected a fresh seal cookie to replace the malformed one").toBeTruthy();
});

it("the server still answers normal requests right after a malformed cookie", async () => {
  await fetch(new URL("/", baseUrl), { headers: { Cookie: "seal=%" } });
  const res = await fetch(new URL("/", baseUrl));
  expect(res.status).toBe(200);
});
