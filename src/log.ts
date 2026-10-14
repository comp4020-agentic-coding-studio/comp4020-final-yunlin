import { createHash } from "node:crypto";
import { sealGlyph } from "./seal.ts";

// Who did what, server-side, decided in decisions/0003-who-did-what.md. A
// visitor appears as a pseudonym, never their token: Fly keeps these lines,
// and anyone holding a token could write as its owner. Only things a person
// does are logged, never that they're looking.

export function pseudonym(token: string): string {
  return `${sealGlyph(token)}·${createHash("sha256").update(token).digest("hex").slice(0, 6)}`;
}

// Values are JSON-quoted unless plainly safe, so visitor text with a line
// break or an "event=" in it can't forge a second line or a field.
function value(v: string | number): string {
  return typeof v === "number" || /^[\w./:-]+$/.test(v) ? String(v) : JSON.stringify(v);
}

export function formatEvent(event: string, token: string | undefined, fields: Record<string, string | number> = {}): string {
  const parts = [`event=${event}`, `who=${token === undefined ? "-" : pseudonym(token)}`];
  for (const [k, v] of Object.entries(fields)) parts.push(`${k}=${value(v)}`);
  return parts.join(" ");
}

export function logEvent(event: string, token: string | undefined, fields?: Record<string, string | number>): void {
  console.log(formatEvent(event, token, fields));
}
