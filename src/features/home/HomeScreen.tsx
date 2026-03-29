import { ChevronRight, Shield } from "lucide-react-native"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useAppStore } from "@/src/store/app-store"
import { useHomeSummary } from "@/src/features/spore/api"
import { Card, Orb, PageHeader, PrimaryButton, ScreenView, SectionTitle, SecondaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function HomeScreen() {
  const router = useRouter()
  const activeSporeId = useAppStore((state) => state.activeSporeId)
  const profile = useAppStore((state) => state.auth.profile)
  const { data } = useHomeSummary(activeSporeId)

  if (!data) {
    return (
      <ScreenView>
        <PageHeader title="How are you today?" subtitle="Loading your care pulse..." />
      </ScreenView>
    )
  }

  const firstName = profile?.displayName?.trim().split(/\s+/)[0]
  const greeting = firstName ? `${getTimeGreeting()}, ${firstName}` : getTimeGreeting()
  const currentSpore = data.currentSpore

  if (!currentSpore) {
    return (
      <ScreenView contentContainerStyle={styles.content}>
        <PageHeader
          eyebrow={greeting}
          title="How are you today?"
          subtitle="Finish creating or joining a Spore to unlock your care summary, support feed, and shared challenges."
        />

        <Card accent style={styles.emptyCard}>
          <Text style={styles.cardEyebrow}>No active Spore yet</Text>
          <Text style={styles.emptyTitle}>Build your trusted circle first</Text>
          <Text style={styles.emptyBody}>
            Your account is set up, but you have not joined a Spore yet. Continue onboarding to create one or use an invite code from someone you trust.
          </Text>
          <PrimaryButton label="Continue onboarding" onPress={() => router.replace("/(onboarding)")} />
          <SecondaryButton label="Open welcome screen" onPress={() => router.replace("/(auth)/welcome")} />
        </Card>

        <Card accent style={styles.passiveCard}>
          <SectionTitle title="Passive trends" />
          {data.passiveTrends.slice(0, 3).map((trend) => (
            <View key={trend.key} style={styles.trendRow}>
              <View style={[styles.trendDot, trend.status === "healthy" ? styles.trendHealthy : trend.status === "watch" ? styles.trendWatch : styles.trendDisabled]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.trendLabel}>{trend.label}</Text>
                <Text style={styles.trendSummary}>{trend.summary}</Text>
              </View>
              <Text style={styles.trendDelta}>{trend.delta}</Text>
            </View>
          ))}
        </Card>
      </ScreenView>
    )
  }

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader
        eyebrow={greeting}
        title="How are you today?"
        subtitle="Take a quiet moment to notice what needs your care."
      />

      <Pressable onPress={() => router.push("/modals/check-in")}>
        <Card style={styles.heroCard}>
          <Text style={styles.cardEyebrow}>Daily reflection</Text>
          <Text style={styles.heroText}>Take a quiet moment to notice how you’re feeling</Text>
          <View style={styles.inlineAction}>
            <Text style={styles.inlineActionLabel}>Begin check-in</Text>
            <ChevronRight size={16} color={colors.primary} />
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push(`/spore/${currentSpore.id}`)}>
        <Card accent style={styles.healthCard}>
          <Orb score={currentSpore.health} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardEyebrow}>{currentSpore.name}</Text>
            <Text style={styles.healthScore}>{currentSpore.health}%</Text>
            <Text style={styles.healthMeta}>
              {currentSpore.memberCount} members · {data.activeChallenges.length} challenges
            </Text>
          </View>
          <ChevronRight size={18} color={colors.mutedForeground} />
        </Card>
      </Pressable>

      <Card accent style={styles.passiveCard}>
        <SectionTitle title="Passive trends" />
        {data.passiveTrends.slice(0, 3).map((trend) => (
          <View key={trend.key} style={styles.trendRow}>
            <View style={[styles.trendDot, trend.status === "healthy" ? styles.trendHealthy : trend.status === "watch" ? styles.trendWatch : styles.trendDisabled]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.trendLabel}>{trend.label}</Text>
              <Text style={styles.trendSummary}>{trend.summary}</Text>
            </View>
            <Text style={styles.trendDelta}>{trend.delta}</Text>
          </View>
        ))}
      </Card>

      <View>
        <SectionTitle title="Recent" actionLabel="See all" onAction={() => router.push(`/spore/${currentSpore.id}`)} />
        <View style={styles.activityList}>
          {data.recentActivity.map((item) => (
            <View key={item.id} style={styles.activityRow}>
              <View style={styles.avatarBubble}>
                <Text style={styles.avatarText}>{item.memberName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>
                  <Text style={styles.activityStrong}>{item.memberName}</Text> {item.content}
                </Text>
                <Text style={styles.activityTime}>{item.timestampLabel}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.quickActions}>
        <PrimaryButton label="Send support" onPress={() => router.push("/modals/appreciation")} style={{ flex: 1 }} />
        <Pressable onPress={() => router.push("/(tabs)/challenges")} style={styles.secondaryQuickAction}>
          <Text style={styles.secondaryQuickActionText}>Join challenge</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.push("/modals/safety")} style={styles.safetyButton}>
        <Shield size={16} color={colors.mutedForeground} />
        <Text style={styles.safetyText}>Safety resources</Text>
      </Pressable>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  heroCard: {
    gap: spacing.md,
  },
  emptyCard: {
    gap: spacing.md,
  },
  healthCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  passiveCard: {
    gap: spacing.md,
  },
  cardEyebrow: {
    fontSize: 12,
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  heroText: {
    fontSize: 20,
    lineHeight: 28,
    color: colors.foreground,
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: colors.foreground,
    fontWeight: "600",
  },
  emptyBody: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 21,
  },
  inlineAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  inlineActionLabel: {
    color: colors.primary,
    fontWeight: "600",
  },
  healthScore: {
    fontSize: 28,
    color: colors.foreground,
    fontWeight: "600",
  },
  healthMeta: {
    color: colors.mutedForeground,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  trendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  trendHealthy: {
    backgroundColor: colors.primary,
  },
  trendWatch: {
    backgroundColor: colors.warmth,
  },
  trendDisabled: {
    backgroundColor: colors.mutedForeground,
    opacity: 0.45,
  },
  trendLabel: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: "600",
  },
  trendSummary: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  trendDelta: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  activityList: {
    gap: spacing.sm,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  avatarBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.secondaryForeground,
    fontWeight: "600",
  },
  activityText: {
    color: colors.mutedForeground,
    fontSize: 14,
  },
  activityStrong: {
    color: colors.foreground,
    fontWeight: "600",
  },
  activityTime: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  secondaryQuickAction: {
    flex: 1,
    minHeight: 54,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryQuickActionText: {
    color: colors.accentForeground,
    fontWeight: "600",
  },
  safetyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  safetyText: {
    color: colors.mutedForeground,
    fontSize: 14,
  },
})
