export function feedIconClass(supportLabel) {
  const map = {
    high_support: "feed-item-icon--high_support",
    needs_attention: "feed-item-icon--needs_attention",
    light_check: "feed-item-icon--light_check",
    reconnection: "feed-item-icon--reconnection",
  };
  return map[supportLabel] ?? "feed-item-icon--normal";
}

export function feedIconGlyph(supportLabel) {
  const map = {
    high_support: "\u25C9",
    needs_attention: "\u25C7",
    light_check: "\u25CB",
    reconnection: "\u21BB",
  };
  return map[supportLabel] ?? "\u273F";
}
