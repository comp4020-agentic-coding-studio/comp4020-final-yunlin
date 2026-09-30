import { createServer } from "node:http";
import { readFile, readFileSync } from "node:fs";
import { extname } from "node:path";
import { addColophon, listColophons } from "./db.ts";
import { sealToken } from "./cookies.ts";
import { renderIndex, renderReadme, MAX_BODY_LENGTH } from "./render.ts";
import { renderMarkdown } from "./markdown.ts";

const PORT = Number(process.env.PORT ?? 8080);
const README = readFileSync("README.md", "utf8");

const MIME: Record<string, string> = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// A URL-encoded 320-character colophon body never comes close to this — it's
// a hard ceiling against a request that skips the form's own maxlength, not a
// tuned limit. Checked as bytes arrive, not after the fact: buffering an
// unbounded body into memory first (whatever a crafted Content-Length or a
// chunked request without one claims) is itself the vulnerability on a
// single-machine deploy with a tight memory ceiling.
const MAX_REQUEST_BODY_BYTES = 16 * 1024;

function declaredBodyTooLarge(req: import("node:http").IncomingMessage): boolean {
  const declared = Number(req.headers["content-length"]);
  return Number.isFinite(declared) && declared > MAX_REQUEST_BODY_BYTES;
}

// Only reached once the declared length (if any) already passed; still caps
// the actual bytes read, since Content-Length is a client-supplied claim, not
// a guarantee — a chunked request can omit it, or a client can send fewer or
// more bytes than it declared.
async function readBody(req: import("node:http").IncomingMessage): Promise<string | undefined> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    total += (chunk as Buffer).length;
    if (total > MAX_REQUEST_BODY_BYTES) {
      req.destroy();
      return undefined;
    }
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://internal");
  const { token, setCookie } = sealToken(req.headers.cookie);
  if (setCookie) res.setHeader("Set-Cookie", setCookie);

  if (req.method === "GET" && url.pathname === "/") {
    const error = url.searchParams.get("error");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderIndex(listColophons(), token, error ?? undefined));
    return;
  }

  if (req.method === "POST" && url.pathname === "/colophons") {
    if (declaredBodyTooLarge(req)) {
      // Don't req.destroy() here: the client may still be mid-write of the
      // oversized body it declared, and tearing the socket down immediately
      // races that write into an ECONNRESET/EPIPE on the client's side before
      // it ever reads this response. Draining (not buffering) the body lets
      // the client finish its write and read a clean 413; Connection: close
      // still closes the socket once that's done, so nothing lingers.
      req.resume();
      res.writeHead(413, { "Content-Type": "text/plain; charset=utf-8", Connection: "close" });
      res.end("payload too large");
      return;
    }

    const raw = await readBody(req);
    if (raw === undefined) {
      res.writeHead(413, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("payload too large");
      return;
    }
    const params = new URLSearchParams(raw);
    const body = (params.get("body") ?? "").trim();

    let error: string | undefined;
    if (body.length === 0) error = "empty";
    else if (body.length > MAX_BODY_LENGTH) error = "long";

    if (!error) addColophon(token, body);

    res.writeHead(303, { Location: error ? `/?error=${error}` : "/" });
    res.end();
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
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`colophon listening on 0.0.0.0:${PORT}`);
});
