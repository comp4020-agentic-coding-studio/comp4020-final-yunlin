import { JSDOM } from "jsdom";
import { expect, inject, it } from "vitest";

// Runs the live.js the app actually serves against the page it actually
// serves, with a stand-in EventSource, since a reader leaving is something the
// browser does, not the server. Without the pagehide handler Chrome kept a
// navigated-away page's stream open in the back-forward cache, and its seal
// stayed in everyone's "looking now" row.
const baseUrl = inject("baseUrl");

class FakeEventSource {
  static opened: FakeEventSource[] = [];
  closed = false;
  listeners = new Map<string, (e: { data: string }) => void>();
  constructor(public url: string) {
    FakeEventSource.opened.push(this);
  }
  addEventListener(type: string, fn: (e: { data: string }) => void): void {
    this.listeners.set(type, fn);
  }
  close(): void {
    this.closed = true;
  }
}

async function page(): Promise<JSDOM> {
  const [html, script] = await Promise.all(
    ["/", "/public/live.js"].map(async (p) => (await fetch(new URL(p, baseUrl))).text()),
  );
  FakeEventSource.opened = [];
  const dom = new JSDOM(html.replace(/<script src="\/public\/live\.js"[^>]*><\/script>/, ""), {
    runScripts: "outside-only",
  });
  Object.assign(dom.window, { EventSource: FakeEventSource });
  dom.window.eval(script);
  return dom;
}

it("leaving the page closes its stream, and coming back reopens it from where it was", async () => {
  const dom = await page();
  const [first] = FakeEventSource.opened;
  expect(first).toBeDefined();
  first!.listeners.get("colophon")!({ data: JSON.stringify({ id: 987654321, html: "<li data-id=\"987654321\"></li>" }) });

  dom.window.dispatchEvent(new dom.window.Event("pagehide"));
  expect(first!.closed).toBe(true);

  const back = new dom.window.Event("pageshow");
  Object.defineProperty(back, "persisted", { value: true });
  dom.window.dispatchEvent(back);
  expect(FakeEventSource.opened).toHaveLength(2);
  expect(FakeEventSource.opened[1]!.url).toContain("after=987654321");
});

it("presence seals are set as text, never parsed as markup", async () => {
  const dom = await page();
  FakeEventSource.opened[0]!.listeners.get("presence")!({
    data: JSON.stringify([{ seal: "<img src=x>", you: false }]),
  });
  const row = dom.window.document.querySelector(".presence-seals")!;
  expect(row.querySelector("img")).toBeNull();
  expect(row.textContent).toContain("<img src=x>");
  expect(dom.window.document.querySelector<HTMLElement>(".presence")!.hidden).toBe(false);
});

// decisions/0002: a screen-reader user hears new ink, never presence.
const entry = (id: number, body: string) =>
  JSON.stringify({ id, html: `<li data-id="${id}"><p class="colophon-body">${body}</p></li>` });
const settle = () => new Promise((r) => setTimeout(r, 1100));

it("a new colophon is announced by its text; presence changes are not", async () => {
  const dom = await page();
  const source = FakeEventSource.opened[0]!;
  const status = dom.window.document.querySelector('.arrivals[role="status"]')!;
  source.listeners.get("presence")!({ data: JSON.stringify([{ seal: "鑑", you: false }]) });
  await settle();
  expect(status.textContent).toBe("");
  source.listeners.get("colophon")!({ data: entry(900000001, "pine wind") });
  await settle();
  expect(status.textContent).toBe("A new colophon: pine wind");
});

it("several colophons arriving at once, as on a reconnect, are announced as a count", async () => {
  const dom = await page();
  const source = FakeEventSource.opened[0]!;
  for (const id of [900000002, 900000003, 900000004]) source.listeners.get("colophon")!({ data: entry(id, "x") });
  await settle();
  expect(dom.window.document.querySelector(".arrivals")!.textContent).toBe("3 new colophons at the end of the list");
});
