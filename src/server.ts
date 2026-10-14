import { createServer } from "node:http";
import { readFile, readFileSync } from "node:fs";
import { extname } from "node:path";
import { addColophon, listColophons } from "./db.ts";
import { sealToken } from "./cookies.ts";
import { renderIndex, renderReadme, MAX_BODY_LENGTH } from "./render.ts";
import { renderMarkdown } from "./markdown.ts";
import { broadcastColophon, openStream } from "./live.ts";
import { logEvent } from "./log.ts";

const PORT = Number(process.env.PORT ?? 8080);
const README = readFileSync("README.md", "utf8");

const MIME: Record<string, string> = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
};

// A URL-encoded 320-character colophon body never comes close to this — it's
// a hard ceiling against a request that skips the form's own maxlength, not a
// tuned limit. Checked as bytes arrive, not after the fact: buffering an
// unbounded body into memory first (whatever a crafted Content-Length or a
// chunked request without one claims) is itself the vulnerability on a
// single-machine deploy with a tight memory ceiling.
const MAX_REQUEST_BODY_BYTES = 16 * 1024;

// Once the cap is crossed, later chunks are read and discarded rather than
// accumulated — costs no memory, since each one is immediately eligible for
// GC — but the stream is still let run to its natural end before responding.
// Destroying the connection early, tried first, raced a still-writing client
// into a raw connection error instead of a clean 413: a declared
// Content-Length is a promise the client already committed to keeping, and
// only reading it out fully guarantees the client's own write has finished
// before it goes to read our response. A stalled or genuinely enormous body
// is bounded by Node's own default request timeout, not by this function.
async function readBody(req: import("node:http").IncomingMessage): Promise<string | undefined> {
  const declared = Number(req.headers["content-length"]);
  let tooLarge = Number.isFinite(declared) && declared > MAX_REQUEST_BODY_BYTES;

  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = chunk as Buffer;
    total += buf.length;
    if (total > MAX_REQUEST_BODY_BYTES) tooLarge = true;
    if (!tooLarge) chunks.push(buf);
  }
  return tooLarge ? undefined : Buffer.concat(chunks).toString("utf8");
}

// A colophon can't be changed or deleted by anyone, its writer included.
// There's no route for it; an attempt is answered and logged, so whether one
// person tried to change another's is in the log, not just in the code.
function isChangeAttempt(method: string | undefined, pathname: string): boolean {
  if (pathname.startsWith("/colophons/")) return true;
  return pathname === "/colophons" && method !== "GET" && method !== "POST";
}

const server = createServer(async (req, res) => {
  const { token, setCookie } = sealToken(req.headers.cookie);
  try {
    // Inside the boundary: a request target like "//" isn't a valid URL here.
    const url = new URL(req.url ?? "/", "http://internal");
    await handle(req, res, url, token, setCookie);
  } catch (err) {
    logEvent("error", token, { method: req.method ?? "-", path: req.url ?? "-", message: String(err) });
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("something went wrong");
  }
});

async function handle(
  req: import("node:http").IncomingMessage,
  res: import("node:http").ServerResponse,
  url: URL,
  token: string,
  setCookie: string | undefined,
): Promise<void> {
  if (setCookie) {
    res.setHeader("Set-Cookie", setCookie);
    logEvent("seal", token, { path: url.pathname });
  }

  if (isChangeAttempt(req.method, url.pathname)) {
    logEvent("refused", token, { method: req.method ?? "-", path: url.pathname });
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, POST" });
    res.end("a colophon can't be changed or taken back, by anyone");
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderIndex(listColophons(), token));
    return;
  }

  if (req.method === "POST" && url.pathname === "/colophons") {
    const raw = await readBody(req);
    if (raw === undefined) {
      logEvent("reject", token, { reason: "large" });
      res.writeHead(413, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("payload too large");
      return;
    }
    const params = new URLSearchParams(raw);
    // A form submits each line break as CRLF, but the visitor saw (and the
    // page's counter counted) one character; count and store it that way.
    const body = (params.get("body") ?? "").replace(/\r\n?/g, "\n").trim();

    const error = body.length === 0 ? "empty" : body.length > MAX_BODY_LENGTH ? "long" : undefined;
    if (error) {
      logEvent("reject", token, { reason: error, length: body.length });
      res.writeHead(422, { "Content-Type": "text/html; charset=utf-8" });
      res.end(renderIndex(listColophons(), token, error, body));
      return;
    }

    const colophon = addColophon(token, body);
    logEvent("write", token, { id: colophon.id, length: body.length, opening: body.slice(0, 40) });
    broadcastColophon(colophon);
    res.writeHead(303, { Location: "/" });
    res.end();
    return;
  }

  // A rejected write is answered at /colophons; revisiting that address by GET
  // should land on the scroll, not a 404.
  if (req.method === "GET" && url.pathname === "/colophons") {
    res.writeHead(303, { Location: "/" });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/events") {
    openStream(req, res, url, token);
    return;
  }

  if (req.method === "GET" && url.pathname === "/readme/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderReadme(renderMarkdown(README)));
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/public/")) {
    const ext = extname(url.pathname);
    const type = MIME[ext];
    if (!type) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    readFile(`.${url.pathname}`, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, { "Content-Type": type });
      res.end(data);
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("not found");
}

server.listen(PORT, "0.0.0.0", () => {
  logEvent("listening", undefined, { port: PORT });
});
