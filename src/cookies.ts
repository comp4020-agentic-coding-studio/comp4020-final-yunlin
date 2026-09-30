import { randomUUID } from "node:crypto";

const SEAL_COOKIE = "seal";
const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

export function parseCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return undefined;
}

// Every visitor is identified by one anonymous, unguessable token, set the
// first time they arrive with no account and no name attached — the same
// answer to "who counts as a person" a seal gives: presence without identity.
export function sealToken(cookieHeader: string | undefined): { token: string; setCookie?: string } {
  const existing = parseCookie(cookieHeader, SEAL_COOKIE);
  if (existing) return { token: existing };

  const token = randomUUID();
  return { token, setCookie: `${SEAL_COOKIE}=${token}; Max-Age=${TEN_YEARS_SECONDS}; Path=/; HttpOnly; SameSite=Lax` };
}
