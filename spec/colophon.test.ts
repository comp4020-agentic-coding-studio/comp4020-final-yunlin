import { expect, inject, it } from "vitest";

// Own checks: the promises README.md and CLAUDE.md make that the build alone
// can't verify. Every request manages its own seal cookie by hand (fetch
// doesn't carry a cookie jar across calls), so each test is a fresh visitor
// unless it explicitly reuses a cookie from an earlier response.
const baseUrl = inject("baseUrl");

function cookieFrom(res: Response): string {
  const raw = res.headers.get("set-cookie");
  expect(raw, "expected a seal cookie to be set").toBeTruthy();
  return raw!.split(";")[0]!;
}

async function write(body: string, cookie?: string): Promise<Response> {
  return fetch(new URL("/colophons", baseUrl), {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: new URLSearchParams({ body }).toString(),
  });
}

async function index(cookie?: string): Promise<{ text: string; cookie: string }> {
  const res = await fetch(new URL("/", baseUrl), {
    headers: cookie ? { Cookie: cookie } : {},
  });
  return { text: await res.text(), cookie: cookie ?? cookieFrom(res) };
}

it("a written colophon is still there on a later request", async () => {
  const marker = `proof-of-life-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const { cookie } = await index();
  const write1 = await write(marker, cookie);
  expect(write1.status).toBe(303);

  const { text } = await index(cookie);
  expect(text).toContain(marker);
});

it("an empty colophon is rejected, not stored", async () => {
  const { cookie } = await index();
  const res = await write("   ", cookie);
  expect(res.status).toBe(422);
  expect(await res.text()).toContain("at least a few words");
});

it("an over-length colophon is rejected rather than truncated", async () => {
  const { cookie } = await index();
  const tooLong = `long-${Date.now()}-${"x".repeat(400)}`;
  const res = await write(tooLong, cookie);
  expect(res.status).toBe(422);

  const { text } = await index(cookie);
  expect(text).not.toContain(tooLong);
});

// The textarea once carried maxlength, which made the browser silently cut a
// pasted passage to the limit mid-word: exactly the truncation this app
// promises never to do. The box now takes anything, and a rejection hands the
// visitor's text back, escaped, so they can shorten it themselves.
it("a rejected colophon comes back in the box, escaped, for the visitor to shorten", async () => {
  const { cookie } = await index();
  const tooLong = `<b>echo-${Date.now()}</b> ${"y".repeat(400)}`;
  const res = await write(tooLong, cookie);
  const text = await res.text();
  const textarea = text.slice(text.indexOf("<textarea"), text.indexOf("</textarea>"));
  expect(textarea).toContain(tooLong.replace("<b>", "&lt;b&gt;").replace("</b>", "&lt;/b&gt;"));
  expect(text).not.toContain(tooLong);
});

it("revisiting the rejected page's address lands back on the scroll", async () => {
  const res = await fetch(new URL("/colophons", baseUrl), { redirect: "manual" });
  expect(res.status).toBe(303);
  expect(res.headers.get("location")).toBe("/");
});

it("the write box never carries a maxlength", async () => {
  const { text } = await index();
  expect(text).not.toMatch(/<textarea[^>]*maxlength/);
});

// Slices out just the one <li> the marker landed in, so a false match against
// unrelated "yours" text elsewhere on the page (the compose heading, say)
// can't pass this test by accident.
function entryFor(text: string, marker: string): string {
  const at = text.indexOf(marker);
  expect(at, `expected to find "${marker}" on the page`).toBeGreaterThan(-1);
  const end = text.indexOf("</li>", at);
  expect(end).toBeGreaterThan(-1);
  return text.slice(at, end);
}

// The page counts a line break as one character (as maxlength once did), but the form
// submits it as CRLF: a line the browser accepted at exactly the limit once
// arrived as more than the limit, was rejected as too long, and the visitor's
// text was gone.
it("a colophon at the limit with line breaks is accepted as the browser sent it", async () => {
  const { cookie } = await index();
  const marker = `crlf-${Date.now()}`;
  const lines = [marker, "b".repeat(100), "c".repeat(100)];
  const atLimit = [...lines, "d".repeat(320 - lines.join("\n").length - 1)].join("\r\n");
  expect(atLimit.replace(/\r\n/g, "\n")).toHaveLength(320);

  const res = await write(atLimit, cookie);
  expect(res.headers.get("location")).toBe("/");
  const { text } = await index(cookie);
  expect(text).toContain(lines.join("\n"));
});

it("a colophon reads as mine only for the browser that wrote it", async () => {
  const marker = `mine-check-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const { cookie: author } = await index();
  await write(marker, author);

  const authorView = await index(author);
  expect(entryFor(authorView.text, marker)).toContain("yours");

  const { cookie: stranger } = await index();
  expect(stranger).not.toBe(author);
  const strangerView = await index(stranger);
  expect(entryFor(strangerView.text, marker)).not.toContain("yours");
});
