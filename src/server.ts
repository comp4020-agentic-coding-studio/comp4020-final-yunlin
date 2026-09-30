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

async function readBody(req: import("node:http").IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
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
    const raw = await readBody(req);
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
