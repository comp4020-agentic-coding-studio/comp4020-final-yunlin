// Progressive enhancement: the page already works without this. It keeps the
// colophon list current as others write, and fills the "looking now" row.
// Colophon HTML arrives already escaped by the server (render.ts); seals are
// set as text, never as markup.
const list = document.querySelector(".colophon-list");
const presence = document.querySelector(".presence");
const seals = document.querySelector(".presence-seals");
const arrivals = document.querySelector(".arrivals");

let lastId = Number(list?.dataset.lastId ?? 0);
let stream;

// New colophons are announced to screen readers; presence never is
// (decisions/0002). Arrivals within a second, such as a reconnect's replay,
// collapse to a count.
const ANNOUNCE_AFTER_MS = 1000;
let pending = [];
let announceTimer;

function announce(entry) {
  pending.push(entry.querySelector(".colophon-body")?.textContent ?? "");
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    arrivals.textContent =
      pending.length === 1
        ? `A new colophon: ${pending[0]}`
        : `${pending.length} new colophons at the end of the list`;
    pending = [];
  }, ANNOUNCE_AFTER_MS);
}

function connect() {
  stream = new EventSource(`/events?after=${lastId}`);

  stream.addEventListener("colophon", (event) => {
    const { id, html } = JSON.parse(event.data);
    lastId = Math.max(lastId, id);
    if (list.querySelector(`[data-id="${id}"]`)) return;
    list.insertAdjacentHTML("beforeend", html);
    announce(list.lastElementChild);
    document.querySelector(".empty-note")?.remove();
  });

  stream.addEventListener("presence", (event) => {
    const here = JSON.parse(event.data).sort((a, b) => b.you - a.you);
    seals.replaceChildren(
      ...here.flatMap(({ seal, you }) => {
        const span = document.createElement("span");
        span.className = "presence-seal";
        span.textContent = seal;
        return you ? [span, "(you) "] : [span];
      }),
    );
    presence.hidden = here.length === 0;
  });
}

if (list && "EventSource" in window) {
  connect();
  // Chrome keeps a page it navigated away from in the back-forward cache with
  // its stream still open, so without this a reader who has left stays
  // "looking" until the cache evicts the page.
  addEventListener("pagehide", () => stream.close());
  addEventListener("pageshow", (event) => {
    if (event.persisted) connect();
  });
}
