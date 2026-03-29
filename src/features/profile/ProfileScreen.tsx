import { Bell, ChevronRight, Eye, Phone, Settings2, Shield, Sparkles } from "lucide-react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, StyleSheet, Switch, Text, View } from "react-native"
import { signOut } from "@/src/features/auth/api"
import { useAppStore } from "@/src/store/app-store"
import { useNotifications, useRegisterPushToken } from "@/src/features/notifications/api"
import { useTrackingStatus } from "@/src/features/tracking/api"
import { useHomeSummary } from "@/src/features/spore/api"
import { useProfile, useUpdateFeatureFlag } from "@/src/features/settings/api"
import { Card, PageHeader, ScreenView, SectionTitle } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function ProfileScreen() {
  const router = useRouter()
  const featureFlags = useAppStore((state) => state.featureFlags)
  const activeSporeId = useAppStore((state) => state.activeSporeId)
  const { data: profile } = useProfile()
  const { data: home } = useHomeSummary(activeSporeId)
  const { data: notifications = [] } = useNotifications()
  const { data: providers = [] } = useTrackingStatus()
  const registerPush = useRegisterPushToken()
  const updateFeatureFlag = useUpdateFeatureFlag()
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader title="Your space" subtitle="Privacy, preferences, and support controls." />

      <Pressable onPress={() => router.push("/modals/avatar")}>
        <Card accent style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{profile?.avatar ?? "🌱"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.avatarLabel}>Your avatar</Text>
            <Text style={styles.avatarTitle}>{profile?.displayName ?? "You"}</Text>
            <Text style={styles.avatarSubtitle}>Growing with every check-in and act of care</Text>
          </View>
          <ChevronRight size={18} color={colors.mutedForeground} />
        </Card>
      </Pressable>

      <View>
        <SectionTitle title="Your wellness" />
        <View style={styles.metricRow}>
          <MetricCard label="Care score" value={`${home?.careScore ?? 72}`} />
          <MetricCard label="Mood" value={`${home?.latestCheckIn?.mood ?? 7}`} />
          <MetricCard label="Sleep" value={`${home?.latestCheckIn?.sleep ?? 7}`} />
        </View>
      </View>

      <View>
        <SectionTitle title="Privacy and controls" />
        <Card style={styles.stackCard}>
          <SettingsRow icon={Eye} title="What others see" subtitle="Support preferences, consent, and shared care signals." onPress={() => router.push("/settings")} />
          <SettingsRow icon={Bell} title="Notifications" subtitle={`${notifications.length} recent notification logs`} onPress={() => router.push("/settings")} />
          <SettingsRow icon={Shield} title="Tracked signals" subtitle={`${providers.filter((item) => item.enabled).length} providers enabled`} onPress={() => router.push("/settings")} />
          <SettingsRow icon={Phone} title="Safety resources" subtitle="Immediate support, crisis lines, and trusted contacts." onPress={() => router.push("/modals/safety")} />
        </Card>
      </View>

      <Card style={styles.stackCard}>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Demo mode</Text>
            <Text style={styles.toggleSubtitle}>Show realistic fallback data when backend access is unavailable.</Text>
          </View>
          <Switch
            value={featureFlags.demoMode}
            onValueChange={(value) => updateFeatureFlag.mutate({ key: "demoMode", value })}
            trackColor={{ true: colors.primary, false: colors.muted }}
          />
        </View>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Push notifications</Text>
            <Text style={styles.toggleSubtitle}>Register this device for care alerts and reminders.</Text>
          </View>
          <Pressable onPress={() => registerPush.mutate()} style={styles.devButton}>
            <Text style={styles.devButtonText}>Enable</Text>
          </Pressable>
        </View>
      </Card>

      <Card accent>
        <View style={styles.devRow}>
          <Sparkles size={16} color={colors.secondaryForeground} />
          <Text style={styles.devText}>Developer tools: signal refresh, push enable, and feature flag control live in Settings.</Text>
        </View>
        <Pressable onPress={() => router.push("/settings")} style={styles.settingsButton}>
          <Settings2 size={16} color={colors.primaryForeground} />
          <Text style={styles.settingsButtonText}>Open settings</Text>
        </Pressable>
      </Card>

      <Card style={styles.signOutCard}>
        <Text style={styles.signOutTitle}>Account</Text>
        <Text style={styles.signOutSubtitle}>Sign out on this device and return to the welcome screen.</Text>
        <Pressable
          onPress={async () => {
            setIsSigningOut(true)
            try {
              await signOut()
              router.replace("/(auth)/welcome")
            } finally {
              setIsSigningOut(false)
            }
          }}
          style={styles.signOutButton}
        >
          <Text style={styles.signOutButtonText}>{isSigningOut ? "Signing out..." : "Sign out"}</Text>
        </Pressable>
      </Card>
    </ScreenView>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  )
}

function SettingsRow({
  icon: Icon,
  title,
  subtitle,
  onPress,
}: {
  icon: typeof Eye
  title: string
  subtitle: string
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress} style={styles.settingsRow}>
      <View style={styles.settingsIcon}>
        <Icon size={16} color={colors.foreground} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={16} color={colors.mutedForeground} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  avatarCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarLabel: {
    color: colors.mutedForeground,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  avatarTitle: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  avatarSubtitle: {
    color: colors.mutedForeground,
    marginTop: 4,
    fontSize: 13,
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  metricValue: {
    color: colors.foreground,
    fontSize: 22,
    fontWeight: "600",
  },
  metricLabel: {
    color: colors.mutedForeground,
    fontSize: 12,
    marginTop: 4,
  },
  stackCard: {
    paddingVertical: 0,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsTitle: {
    color: colors.foreground,
    fontWeight: "600",
  },
  settingsSubtitle: {
    color: colors.mutedForeground,
    fontSize: 13,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  toggleTitle: {
    color: colors.foreground,
    fontWeight: "600",
  },
  toggleSubtitle: {
    color: colors.mutedForeground,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  devButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  devButtonText: {
    color: colors.primaryForeground,
    fontWeight: "600",
  },
  devRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  devText: {
    color: colors.secondaryForeground,
    flex: 1,
    lineHeight: 18,
  },
  signOutCard: {
    gap: spacing.md,
  },
  signOutTitle: {
    color: colors.foreground,
    fontWeight: "600",
    fontSize: 16,
  },
  signOutSubtitle: {
    color: colors.mutedForeground,
    fontSize: 13,
    lineHeight: 18,
  },
  signOutButton: {
    minHeight: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutButtonText: {
    color: colors.foreground,
    fontWeight: "600",
  },
  settingsButton: {
    minHeight: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  settingsButtonText: {
    color: colors.primaryForeground,
    fontWeight: "600",
  },
})
