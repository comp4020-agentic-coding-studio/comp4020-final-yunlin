import { afterEach, expect, inject, it } from "vitest";

// The real-time layer, checked over real event streams against the running
// app. decisions/0001-who-else-is-here.md is what these hold it to: colophons
// reach every open page within about a second and replay after a reconnect;
// presence shows seals, never tokens, and lets go of a reader who leaves.
// Only this file opens streams, and tests in a file run one at a time, so the
// presence counts here aren't disturbed by other spec files.
const baseUrl = inject("baseUrl");

interface SseEvent {
  event: string;
  id?: string;
  data: string;
}

interface Stream {
  next(event: string, match?: (data: string) => boolean, timeoutMs?: number): Promise<SseEvent>;
  raw(): string;
  close(): void;
}

const open: Stream[] = [];
afterEach(() => {
  for (const s of open.splice(0)) s.close();
});

async function stream(cookie: string, query = "", headers: Record<string, string> = {}): Promise<Stream> {
  const abort = new AbortController();
  const res = await fetch(new URL(`/events${query}`, baseUrl), {
    headers: { Cookie: cookie, ...headers },
    signal: abort.signal,
  });
  expect(res.headers.get("content-type")).toMatch(/^text\/event-stream/);
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();

  const events: SseEvent[] = [];
  let buffer = "";
  let all = "";
  const waiters: (() => void)[] = [];
  void (async () => {
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) return;
        buffer += value;
        all += value;
        let at: number;
        while ((at = buffer.indexOf("\n\n")) !== -1) {
          const block = buffer.slice(0, at);
          buffer = buffer.slice(at + 2);
          const ev: SseEvent = { event: "message", data: "" };
          for (const line of block.split("\n")) {
            if (line.startsWith("event: ")) ev.event = line.slice(7);
            else if (line.startsWith("id: ")) ev.id = line.slice(4);
            else if (line.startsWith("data: ")) ev.data += line.slice(6);
          }
          if (ev.data) events.push(ev);
          for (const w of waiters.splice(0)) w();
        }
      }
    } catch {
      // aborted
    }
  })();

  const s: Stream = {
    async next(event, match = () => true, timeoutMs = 1000) {
      const deadline = Date.now() + timeoutMs;
      for (;;) {
        const i = events.findIndex((e) => e.event === event && match(e.data));
        if (i !== -1) return events.splice(0, i + 1).at(-1)!;
        const left = deadline - Date.now();
        if (left <= 0) throw new Error(`no matching "${event}" event within ${timeoutMs}ms`);
        await new Promise<void>((resolve) => {
          waiters.push(resolve);
          setTimeout(resolve, left);
        });
      }
    },
    raw: () => all,
    close: () => abort.abort(),
  };
  open.push(s);
  return s;
}

async function visitor(): Promise<string> {
  const res = await fetch(new URL("/", baseUrl));
  return res.headers.get("set-cookie")!.split(";")[0]!;
}

async function write(body: string, cookie: string): Promise<void> {
  const res = await fetch(new URL("/colophons", baseUrl), {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookie },
    body: new URLSearchParams({ body }).toString(),
  });
  expect(res.status).toBe(303);
}

const marker = (label: string): string => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

it("a colophon reaches another open page within a second, escaped", async () => {
  const [author, reader] = [await visitor(), await visitor()];
  const watching = await stream(reader);
  const text = marker("live");
  await write(`${text} <b>bold</b>`, author);

  const ev = await watching.next("colophon", (d) => d.includes(text), 1000);
  const { html } = JSON.parse(ev.data) as { html: string };
  expect(html).toContain("&lt;b&gt;bold&lt;/b&gt;");
  expect(html).not.toContain("<b>");
  expect(html).not.toContain("yours");
});

it("a live colophon is marked yours only on the author's own pages", async () => {
  const author = await visitor();
  const ownOtherTab = await stream(author);
  const text = marker("own-tab");
  await write(text, author);
  const ev = await ownOtherTab.next("colophon", (d) => d.includes(text));
  expect(JSON.parse(ev.data).html).toContain("yours");
});

it("a page that reconnects gets every colophon it missed, and none twice", async () => {
  const [author, reader] = [await visitor(), await visitor()];
  const first = await stream(reader);
  const before = marker("before-drop");
  await write(before, author);
  const seen = await first.next("colophon", (d) => d.includes(before));
  first.close();

  const missed = [marker("missed-1"), marker("missed-2")];
  for (const m of missed) await write(m, author);

  // what a browser's own EventSource sends when it reconnects
  const again = await stream(reader, "?after=0", { "Last-Event-ID": seen.id! });
  for (const m of missed) await again.next("colophon", (d) => d.includes(m));
  expect(again.raw()).not.toContain(before);
});

it("presence carries seals, never anyone's token", async () => {
  const [a, b] = [await visitor(), await visitor()];
  const sa = await stream(a);
  const sb = await stream(b);
  const ev = await sa.next("presence", (d) => JSON.parse(d).length >= 2);
  const here = JSON.parse(ev.data) as { seal: string; you: boolean }[];
  expect(here.filter((p) => p.you)).toHaveLength(1);
  for (const token of [a, b].map((c) => c.split("=")[1]!)) {
    expect(sa.raw()).not.toContain(token);
    expect(sb.raw()).not.toContain(token);
  }
});

it("one browser in several tabs is one seal, and a reader who leaves is let go", async () => {
  const [stayer, leaver] = [await visitor(), await visitor()];
  const watching = await stream(stayer);
  const baseline = JSON.parse((await watching.next("presence")).data).length as number;

  const tab1 = await stream(leaver);
  await stream(leaver);
  await watching.next("presence", (d) => JSON.parse(d).length === baseline + 1);
  await tab1.next("presence");

  for (const s of open.filter((s) => s !== watching)) s.close();
  await watching.next("presence", (d) => JSON.parse(d).length === baseline, 6000);
}, 10_000);

// Found under load: one presence broadcast per arrival costs the square of the
// room on every join, and 800 readers arriving at once took the server to
// 3.7 GB. A burst of arrivals is one broadcast.
it("readers arriving together cost one presence broadcast, not one each", async () => {
  const watcher = await visitor();
  const watching = await stream(watcher);
  const baseline = JSON.parse((await watching.next("presence")).data).length as number;
  const before = watching.raw().split("event: presence").length;

  const arrivals = await Promise.all(Array.from({ length: 10 }, visitor));
  await Promise.all(arrivals.map((c) => stream(c)));
  await watching.next("presence", (d) => JSON.parse(d).length === baseline + 10, 2000);
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(watching.raw().split("event: presence").length - before).toBeLessThanOrEqual(3);
});
