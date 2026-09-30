import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

// /data is the one thing that survives a restart or redeploy (fly.toml mounts
// a volume there). Locally and in CI (which mounts a throwaway /data of its
// own, per checks.yml) it exists too; only a bare local checkout falls back
// to a repo-relative path.
const DB_PATH = process.env.DB_PATH ?? (existsSync("/data") ? "/data/colophon.db" : "./data/colophon.db");
mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS colophons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

export interface Colophon {
  id: number;
  token: string;
  body: string;
  created_at: number;
}

const selectAll = db.prepare("SELECT * FROM colophons ORDER BY id ASC");
const insert = db.prepare("INSERT INTO colophons (token, body, created_at) VALUES (?, ?, ?)");

export function listColophons(): Colophon[] {
  return selectAll.all() as unknown as Colophon[];
}

export function addColophon(token: string, body: string): void {
  insert.run(token, body, Date.now());
}
