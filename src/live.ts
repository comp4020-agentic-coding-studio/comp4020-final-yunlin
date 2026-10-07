import type { IncomingMessage, ServerResponse } from "node:http";
import { listColophonsAfter, type Colophon } from "./db.ts";
import { colophonEntry } from "./render.ts";
import { sealGlyph } from "./seal.ts";

// The live layer, decided in decisions/0001-who-else-is-here.md: colophons
// (dry ink) travel to every open page and replay on reconnect; presence (wet
// ink) is the seals of whoever has a page open right now, held only in this
// process's memory and never written to disk. One machine, one process, so an
// in-memory set of open streams is the whole fan-out.

interface Client {
  res: ServerResponse;
  token: string;
}

const clients = new Set<Client>();

// A writer's page reloads after posting; without a grace period their seal
// would blink out and back for everyone else on every colophon.
const LEAVE_GRACE_MS = 3000;
const HEARTBEAT_MS = 20_000;

function send(c: Client, event: string, data: unknown, id?: number): void {
  c.res.write(`${id === undefined ? "" : `id: ${id}\n`}event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// Seals only, never tokens: a token is the visitor's whole identity, and
// anyone holding it could write as them.
function presenceFor(viewer: Client): { seal: string; you: boolean }[] {
  const tokens = new Set([...clients].map((c) => c.token));
  return [...tokens].map((t) => ({ seal: sealGlyph(t), you: t === viewer.token }));
}

function broadcastPresence(): void {
  for (const c of clients) send(c, "presence", presenceFor(c));
}

function colophonEvent(c: Client, colophon: Colophon): void {
  send(c, "colophon", { id: colophon.id, html: colophonEntry(colophon, c.token) }, colophon.id);
}

export function broadcastColophon(colophon: Colophon): void {
  for (const c of clients) colophonEvent(c, colophon);
}

// Anything that isn't a plain non-negative integer means "replay nothing":
// the page the stream belongs to already rendered everything up to its load.
function parseId(raw: string | string[] | null | undefined): number {
  if (typeof raw !== "string" || !/^\d{1,15}$/.test(raw)) return Infinity;
  return Number(raw);
}

export function openStream(req: IncomingMessage, res: ServerResponse, url: URL, token: string): void {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("retry: 2000\n\n");

  const client: Client = { res, token };

  // The page says what it rendered up to (?after=); a browser reconnecting on
  // its own says what it last received (Last-Event-ID). Whichever is later.
  const fromQuery = parseId(url.searchParams.get("after"));
  const fromHeader = parseId(req.headers["last-event-id"]);
  const after = Math.max(...[fromQuery, fromHeader].filter(Number.isFinite), -1);
  // Replay and joining the set happen in one synchronous run, so no colophon
  // written in between can fall through the gap.
  if (after >= 0) for (const c of listColophonsAfter(after)) colophonEvent(client, c);
  clients.add(client);
  broadcastPresence();

  const heartbeat = setInterval(() => res.write(": keep-alive\n\n"), HEARTBEAT_MS);
  req.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(client);
    setTimeout(broadcastPresence, LEAVE_GRACE_MS);
  });
}
