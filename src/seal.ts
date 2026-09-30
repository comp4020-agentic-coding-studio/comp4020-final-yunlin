// A visitor's seal is one character drawn deterministically from their
// anonymous token, from a small pool of words real Chinese collectors' and
// connoisseurs' seals use for looking, keeping, and inscribing (鑑賞 "to
// appraise", 珍藏 "to treasure and keep", 過眼 "passed before the eye",
// 題記 "to inscribe a note" among them). It stands in for a name without
// being one.
const GLYPHS = ["鑑", "賞", "藏", "觀", "閱", "記", "題", "珍", "玩", "守", "傳", "校"];

export function sealGlyph(token: string): string {
  let hash = 0;
  for (const ch of token) hash = (hash * 31 + ch.codePointAt(0)!) >>> 0;
  return GLYPHS[hash % GLYPHS.length]!;
}
