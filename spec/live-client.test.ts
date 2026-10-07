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
