/** Shared check-in moods for Check-ins page and Home (Home omits “Skip today”). */
export const CHECK_IN_OPTIONS_FULL = [
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "not_great", label: "Not great", emoji: "😔" },
  { value: "missing", label: "Skip today", emoji: null },
];

export const HOME_CHECK_IN_MOODS = CHECK_IN_OPTIONS_FULL.filter(
  (o) => o.value !== "missing"
);
