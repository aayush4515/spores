import { Platform } from "react-native"

export const colors = {
  background: "#F8F7F4",
  foreground: "#38342F",
  card: "#FCFBF9",
  primary: "#5D7C64",
  primaryForeground: "#FBFAF8",
  secondary: "#E9F0E8",
  secondaryForeground: "#47614D",
  muted: "#EEECE7",
  mutedForeground: "#8A847D",
  accent: "#EEE5EF",
  accentForeground: "#78607D",
  destructive: "#B76667",
  warmth: "#D5B689",
  border: "#E8E3DC",
  overlay: "rgba(56, 52, 47, 0.16)",
  white: "#FFFFFF",
} as const

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
}

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  xxl: 32,
}

export const typography = {
  sans: Platform.select({ ios: "System", default: "sans-serif" }),
  serif: Platform.select({ ios: "Georgia", default: "serif" }),
}

export const shadows = {
  card: {
    shadowColor: "#1A1714",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  soft: {
    shadowColor: "#1A1714",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
}
