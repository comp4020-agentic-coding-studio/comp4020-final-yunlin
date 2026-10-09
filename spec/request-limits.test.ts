import { expect, inject, it } from "vitest";

// A crafted request can skip the form entirely, the same way
// spec/colophon.test.ts already posts straight to /colophons. Before the fix this test guards, the server
// read an entire oversized body into memory before ever checking its length —
// a single request could exhaust the process's memory on this app's
// single-machine deploy. It has to reject early, not just reject eventually.
const baseUrl = inject("baseUrl");

it("an oversized request body is rejected, not fully buffered", async () => {
  const oversized = "x".repeat(5 * 1024 * 1024); // far past MAX_BODY_LENGTH (320)
  const res = await fetch(new URL("/colophons", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `body=${oversized}`,
  });
  expect(res.status).toBe(413);
});

it("the server still answers normal requests right after an oversized one", async () => {
  const res = await fetch(new URL("/", baseUrl));
  expect(res.status).toBe(200);
});
