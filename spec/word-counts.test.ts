// The brief sets word bands for the two marked documents. Additive edits
// across runs pushed both past their ceilings unnoticed, so the bands are
// checked here. Link URLs aren't prose, so they're stripped before counting.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const words = (path: string): number =>
  readFileSync(path, "utf8")
    .replace(/\(https?:\/\/[^)]*\)/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

describe("the marked documents stay inside the brief's word bands", () => {
  it("README.md runs 400–600 words", () => {
    const n = words("README.md");
    expect(n).toBeGreaterThanOrEqual(400);
    expect(n).toBeLessThanOrEqual(600);
  });

  it("PROCESS.md runs 900–1100 words", () => {
    const n = words("PROCESS.md");
    expect(n).toBeGreaterThanOrEqual(900);
    expect(n).toBeLessThanOrEqual(1100);
  });
});
