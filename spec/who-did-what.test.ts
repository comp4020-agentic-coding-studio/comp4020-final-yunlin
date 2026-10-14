import { expect, inject, it } from "vitest";
import { formatEvent, pseudonym } from "../src/log.ts";

// decisions/0003-who-did-what.md: what each person may change is decided on
// the server, and the log tells people apart without ever holding a token.
const baseUrl = inject("baseUrl");
const a = "0b8f6c1e-2d3a-4b5c-8d9e-0f1a2b3c4d5e";
const b = "7c6d5e4f-3a2b-4c1d-9e8f-7a6b5c4d3e2f";

it("two browsers get different pseudonyms, and one browser always the same", () => {
  expect(pseudonym(a)).toBe(pseudonym(a));
  expect(pseudonym(a)).not.toBe(pseudonym(b));
});

it("a log line never contains the token it describes", () => {
  const line = formatEvent("write", a, { id: 1, opening: "hello" });
  expect(line).not.toContain(a);
  expect(line).toContain(`who=${pseudonym(a)}`);
});

it("visitor text can't forge a second log line or a field", () => {
  const line = formatEvent("write", a, { opening: "hi\nevent=write who=someone-else" });
  expect(line).toBe(`event=write who=${pseudonym(a)} opening="hi\\nevent=write who=someone-else"`);
});

it("nobody can change or delete a colophon, theirs or anyone else's", async () => {
  for (const method of ["PUT", "PATCH", "DELETE", "POST"]) {
    const res = await fetch(new URL("/colophons/1", baseUrl), {
      method,
      redirect: "manual",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "body=overwritten",
    });
    expect(res.status, `${method} /colophons/1`).toBe(405);
  }
  for (const method of ["PUT", "PATCH", "DELETE"]) {
    const res = await fetch(new URL("/colophons", baseUrl), { method, redirect: "manual" });
    expect(res.status, `${method} /colophons`).toBe(405);
  }
});

// A client that hangs up halfway through a POST body made the async handler
// reject with nothing to catch it, and Node took the whole process down with
// it: every reader lost the scroll until Fly restarted the machine. Now the
// request is caught, logged as an error, and the server keeps answering.
it("a client hanging up mid-post doesn't take the server down", async () => {
  const { hostname, port } = new URL(baseUrl);
  const { connect } = await import("node:net");
  await new Promise<void>((resolve, reject) => {
    const socket = connect(Number(port || 80), hostname, () => {
      socket.write(
        "POST /colophons HTTP/1.1\r\nHost: x\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 100\r\n\r\nbody=half",
      );
      setTimeout(() => {
        socket.destroy();
        resolve();
      }, 200);
    });
    socket.on("error", reject);
  });
  await new Promise((r) => setTimeout(r, 300));
  const res = await fetch(baseUrl);
  expect(res.status).toBe(200);
});

// A request target of "//" isn't a valid URL relative to any base, and parsing
// it outside the error boundary used to take the server down the same way.
it("a request for // doesn't take the server down", async () => {
  const { request } = await import("node:http");
  const status = await new Promise<number | undefined>((resolve, reject) => {
    const req = request(new URL(baseUrl), { path: "//" }, (res) => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on("error", reject);
    req.end();
  });
  expect(status).toBe(500);
  const res = await fetch(baseUrl);
  expect(res.status).toBe(200);
});
