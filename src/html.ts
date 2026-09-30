// Every colophon body is a stranger's own words, persisted forever and
// rendered back into HTML — escape it, always, before it goes anywhere near
// a template string.
export function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
