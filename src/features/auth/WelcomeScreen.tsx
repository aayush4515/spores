import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Switch, Text, View } from "react-native"
import { hasSupabaseConfig } from "@/src/lib/env"
import { useAppStore } from "@/src/store/app-store"
import { Card, PrimaryButton, ScreenView, SecondaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function WelcomeScreen() {
  const router = useRouter()
  const demoMode = useAppStore((state) => state.featureFlags.demoMode)
  const setFeatureFlag = useAppStore((state) => state.setFeatureFlag)

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Spores</Text>
        <Text style={styles.title}>Mental wellness support built around trusted circles.</Text>
        <Text style={styles.subtitle}>
          Self check-ins, gentle observations, challenges, passive trends, and AI support designed for consent-based care.
        </Text>
      </View>

      <Card accent>
        <Text style={styles.cardTitle}>Keep the calm. Add the real product.</Text>
        <Text style={styles.cardText}>
          This native app preserves the warm visual language from the v0 design while adding real app architecture, backend contracts, and connected flows.
        </Text>
      </Card>

      {!hasSupabaseConfig ? (
        <Text style={styles.configHint}>
          Sign up and log in require Supabase URL and anon key in your environment. Turn on Demo mode below to explore the app with local sample data instead.
        </Text>
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton label="Create account" onPress={() => router.push("/(auth)/signup")} />
        <SecondaryButton label="Log in" onPress={() => router.push("/(auth)/login")} />
      </View>

      <View style={styles.demoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.demoTitle}>Demo mode</Text>
          <Text style={styles.demoSubtitle}>Use realistic local fallback data when backend keys are not configured yet.</Text>
        </View>
        <Switch
          value={demoMode}
          onValueChange={(value) => setFeatureFlag("demoMode", value)}
          trackColor={{ true: colors.primary, false: colors.muted }}
        />
      </View>

      <Pressable onPress={() => router.push("/modals/safety")} style={styles.safetyLink}>
        <Text style={styles.safetyText}>Safety resources</Text>
      </Pressable>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "space-between",
    flexGrow: 1,
    paddingTop: 48,
  },
  hero: {
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.mutedForeground,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    color: colors.foreground,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.mutedForeground,
    fontSize: 16,
    lineHeight: 24,
  },
  cardTitle: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  cardText: {
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  configHint: {
    color: colors.mutedForeground,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: spacing.md,
  },
  demoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTitle: {
    color: colors.foreground,
    fontWeight: "600",
  },
  demoSubtitle: {
    marginTop: 4,
    color: colors.mutedForeground,
    fontSize: 13,
    lineHeight: 18,
  },
  safetyLink: {
    alignSelf: "center",
    paddingVertical: spacing.sm,
  },
  safetyText: {
    color: colors.mutedForeground,
  },
})
