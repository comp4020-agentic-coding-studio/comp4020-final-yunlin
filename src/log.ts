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
// break or an "event=" in it can't forge a second line or a field. JSON leaves
// C1 controls, Unicode line separators, zero-width and bidi characters as they
// are, and a log viewer would break, hide or reorder the line on them.
const INVISIBLE = /[\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g;

function value(v: string | number): string {
  if (typeof v === "number" || /^[\w./:-]+$/.test(v)) return String(v);
  return JSON.stringify(v).replace(INVISIBLE, (c) => `\\u${c.codePointAt(0)!.toString(16).padStart(4, "0")}`);
}

export function formatEvent(event: string, token: string | undefined, fields: Record<string, string | number> = {}): string {
  const parts = [`event=${event}`, `who=${token === undefined ? "-" : pseudonym(token)}`];
  for (const [k, v] of Object.entries(fields)) parts.push(`${k}=${value(v)}`);
  return parts.join(" ");
}

export function logEvent(event: string, token: string | undefined, fields?: Record<string, string | number>): void {
  console.log(formatEvent(event, token, fields));
}
