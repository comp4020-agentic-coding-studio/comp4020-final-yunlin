import { escapeHtml } from "./html.ts";
import { sealGlyph } from "./seal.ts";
import type { Colophon } from "./db.ts";

const dateFmt = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Australia/Canberra",
});

export const MAX_BODY_LENGTH = 320;

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta
      name="description"
      content="Colophon: a shared margin on one painting, written a line at a time by whoever visits."
    />
    <link rel="icon" href="/public/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/public/styles.css" />
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}

export function colophonEntry(c: Colophon, ownToken: string): string {
  const mine = c.token === ownToken;
  const glyph = sealGlyph(c.token);
  return `<li class="colophon${mine ? " colophon--mine" : ""}" data-id="${c.id}">
        <span class="colophon-seal" aria-hidden="true">${glyph}</span>
        <p class="colophon-body">${escapeHtml(c.body)}</p>
        <p class="colophon-date">${dateFmt.format(new Date(c.created_at))}${mine ? " — yours" : ""}</p>
      </li>`;
}

export function renderIndex(colophons: Colophon[], ownToken: string, error?: string): string {
  const errorMessage =
    error === "empty"
      ? "A colophon needs at least a few words."
      : error === "long"
        ? `Keep it to ${MAX_BODY_LENGTH} characters — the margin is not infinite.`
        : undefined;

  const body = `
    <header class="site-header">
      <h1>Colophon</h1>
      <p class="kicker">a shared margin on one painting</p>
      <p><a href="/readme/">what good means here</a></p>
    </header>
    <main>
      <figure class="scroll-frame">
        <div class="scroll-scroller" tabindex="0" role="img"
             aria-label="A handscroll painting: Wang Yi's 1363 portrait of Yang Zhuxi standing under a pine, with Ni Zan's rocks and pine, flanked by six and a half centuries of collectors' colophons and seals.">
          <img src="/public/scroll.avif" alt="" />
        </div>
        <figcaption>
          Wang Yi, <cite>Portrait of Yang Zhuxi</cite>, 1363 — Ni Zan painted the pine and
          rock. Palace Museum, Beijing. Scroll sideways to see the whole thing, including
          six and a half centuries of colophons already written into its margins.
        </figcaption>
      </figure>

      <section aria-labelledby="colophons-heading">
        <h2 id="colophons-heading">Colophons</h2>
        <p class="section-note">
          Oldest first, the way a scroll unrolls. Yours is marked once it's here — nothing
          you write can be edited or taken back, the same as ink.
        </p>
        <p class="presence" hidden>Looking now: <span class="presence-seals"></span></p>
        <ol class="colophon-list" data-last-id="${colophons.at(-1)?.id ?? 0}">
          ${colophons.map((c) => colophonEntry(c, ownToken)).join("\n          ")}
        </ol>
        ${colophons.length === 0 ? `<p class="empty-note">No one has written in the margin yet.</p>` : ""}
      </section>

      <section aria-labelledby="write-heading">
        <h2 id="write-heading">Add yours</h2>
        ${errorMessage ? `<p class="form-error" role="alert">${escapeHtml(errorMessage)}</p>` : ""}
        <form method="post" action="/colophons">
          <label for="body">A line for the margin</label>
          <textarea
            id="body"
            name="body"
            maxlength="${MAX_BODY_LENGTH}"
            rows="3"
            required
          ></textarea>
          <button type="submit">Write it in</button>
        </form>
      </section>
    </main>
    <footer>
      <p>Your seal on this page is <strong>${sealGlyph(ownToken)}</strong> — remembered by
        your browser, not by a name. <a href="/readme/">Read more.</a></p>
    </footer>
    <script src="/public/live.js" defer></script>
  `;

  return layout("Colophon", body);
}

export function renderReadme(html: string): string {
  const body = `
    <header class="site-header">
      <h1><a href="/">Colophon</a></h1>
      <p class="kicker">what good means here</p>
    </header>
    <main class="prose">
      ${html}
    </main>
  `;
  return layout("About — Colophon", body);
}
