const SPORE_HEALTH_DISPLAY = {
  Healthy: "Thriving",
  "Needs attention": "A little attention",
  Strained: "Quiet phase",
  Critical: "Needs gentle care",
};

const SUPPORT_LEVEL_DISPLAY = {
  normal: "At ease",
  light_check: "Soft check-in",
  needs_attention: "Extra care",
  high_support: "Close presence",
  reconnection: "Reconnect",
};

export function displaySporeHealthLabel(label) {
  return SPORE_HEALTH_DISPLAY[label] ?? label;
}

export function displaySupportLevelLabel(key) {
  if (key == null || key === "") return "";
  return SUPPORT_LEVEL_DISPLAY[key] ?? String(key).replace(/_/g, " ");
}
