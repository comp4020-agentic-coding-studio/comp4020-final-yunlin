import { JSDOM } from "jsdom";
import { expect, inject, it } from "vitest";

// Markers start at /readme/, and README argues partly through the decision
// records it links. Those links are relative so they also work on GitHub, and
// for a while every one of them 404'd on the deployed app. Every same-origin
// link on /readme/, and on each page it links to, has to answer.
const baseUrl = inject("baseUrl");

async function sameOriginLinks(page: URL): Promise<URL[]> {
  const res = await fetch(page);
  expect(res.status, page.pathname).toBe(200);
  const doc = new JSDOM(await res.text()).window.document;
  return [...doc.querySelectorAll("a[href]")]
    .map((a) => new URL(a.getAttribute("href") ?? "", page))
    .filter((u) => u.origin === page.origin);
}

it("every same-origin link from /readme/ answers, one level deep", async () => {
  const readme = new URL("/readme/", baseUrl);
  const first = await sameOriginLinks(readme);
  const decisions = first.filter((u) => u.pathname.includes("/decisions/"));
  expect(decisions.length).toBeGreaterThanOrEqual(4);
  const second = (await Promise.all(decisions.map(sameOriginLinks))).flat();
  for (const u of [...first, ...second]) {
    const res = await fetch(u, { redirect: "manual" });
    expect(res.status, u.pathname).toBe(200);
  }
});
