export function sporeTypeIcon(type) {
  const t = String(type ?? "").toLowerCase();
  if (t === "family") return "home";
  if (t === "friends") return "groups";
  if (t === "work") return "work";
  if (t === "fitness") return "directions_bike";
  return "potted_plant";
}

export function sporeVibeLabel(score) {
  if (score >= 72) return { key: "growing", label: "Growing" };
  if (score >= 52) return { key: "calm", label: "Calm" };
  return { key: "vibrating", label: "Vibrating" };
}

export function initials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] ?? "";
  return (a + b).toUpperCase().slice(0, 2) || "?";
}
