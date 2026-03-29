import { Bell, HeartHandshake, Phone, RefreshCw, Shield } from "lucide-react-native"
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Switch, Text, View } from "react-native"
import { useNotifications, useRegisterPushToken } from "@/src/features/notifications/api"
import { useCareAgentContext } from "@/src/features/spore/api"
import { useCollectPassiveSignals, useSetProviderEnabled, useTrackingStatus } from "@/src/features/tracking/api"
import { useProfile, useUpdateConsent, useUpdateNotifications, useUpdateProfile } from "@/src/features/settings/api"
import { Card, InputField, PageHeader, PrimaryButton, ScreenView, SectionTitle } from "@/src/components/ui/primitives"
import { useAppStore } from "@/src/store/app-store"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function SettingsScreen() {
  const activeSporeId = useAppStore((state) => state.activeSporeId)
  const { data: profile } = useProfile()
  const { data: notifications = [] } = useNotifications()
  const { data: providers = [] } = useTrackingStatus()
  const { data: careContext } = useCareAgentContext(activeSporeId, profile?.id)
  const [supportPhone, setSupportPhone] = useState(profile?.supportPhone ?? "")
  const updateProfile = useUpdateProfile()
  const updateNotifications = useUpdateNotifications()
  const updateConsent = useUpdateConsent()
  const collectSignals = useCollectPassiveSignals()
  const enableProvider = useSetProviderEnabled()
  const registerPush = useRegisterPushToken()

  useEffect(() => {
    if (profile?.supportPhone) {
      setSupportPhone(profile.supportPhone)
    }
  }, [profile?.supportPhone])

  if (!profile) {
    return (
      <ScreenView>
        <PageHeader title="Settings" subtitle="Loading your preferences..." />
      </ScreenView>
    )
  }

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader title="Settings" subtitle="Privacy, consent, notifications, passive tracking, and developer controls." />

      <Card>
        <SectionTitle title="Support phone" />
        <InputField
          label="Trusted support phone"
          value={supportPhone}
          onChangeText={setSupportPhone}
          keyboardType="phone-pad"
          placeholder="+1 (555) 555-5555"
        />
        <PrimaryButton
          label={updateProfile.isPending ? "Saving..." : "Save phone"}
          onPress={() => updateProfile.mutate({ supportPhone })}
          disabled={updateProfile.isPending}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      <Card>
        <SectionTitle title="Notification controls" />
        <ToggleRow
          icon={Bell}
          title="Daily check-ins"
          value={profile.notifications.dailyCheckIn}
          onValueChange={(value) =>
            updateNotifications.mutate({
              ...profile.notifications,
              dailyCheckIn: value,
            })
          }
        />
        <ToggleRow
          icon={HeartHandshake}
          title="Care alerts"
          value={profile.notifications.careAlerts}
          onValueChange={(value) =>
            updateNotifications.mutate({
              ...profile.notifications,
              careAlerts: value,
            })
          }
        />
        <ToggleRow
          icon={Shield}
          title="AI follow-ups"
          value={profile.notifications.aiFollowUps}
          onValueChange={(value) =>
            updateNotifications.mutate({
              ...profile.notifications,
              aiFollowUps: value,
            })
          }
        />
        <PrimaryButton label={registerPush.isPending ? "Registering..." : "Enable push"} onPress={() => registerPush.mutate()} disabled={registerPush.isPending} style={{ marginTop: spacing.md }} />
      </Card>

      <Card>
        <SectionTitle title="Consent and privacy" />
        <ToggleRow
          icon={Shield}
          title="Location signals"
          value={profile.consent.locationSignals}
          onValueChange={(value) => updateConsent.mutate({ ...profile.consent, locationSignals: value })}
        />
        <ToggleRow
          icon={Shield}
          title="AI memory"
          value={profile.consent.aiMemory}
          onValueChange={(value) => updateConsent.mutate({ ...profile.consent, aiMemory: value })}
        />
        <ToggleRow
          icon={Shield}
          title="Support sharing"
          value={profile.consent.supportSharing}
          onValueChange={(value) => updateConsent.mutate({ ...profile.consent, supportSharing: value })}
        />
      </Card>

      <Card>
        <SectionTitle title="Passive tracking" />
        {providers.map((provider) => (
          <View key={provider.key} style={styles.providerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{provider.label}</Text>
              <Text style={styles.rowSubtitle}>{provider.reason ?? (provider.available ? "Connected and available." : "Currently unavailable.")}</Text>
            </View>
            <Switch
              value={provider.enabled}
              onValueChange={(value) => enableProvider.mutate({ key: provider.key, enabled: value })}
              trackColor={{ true: colors.primary, false: colors.muted }}
            />
          </View>
        ))}
        <Pressable onPress={() => collectSignals.mutate()} style={styles.devAction}>
          <RefreshCw size={16} color={colors.foreground} />
          <Text style={styles.devActionText}>Refresh passive signals</Text>
        </Pressable>
      </Card>

      <Card accent>
        <SectionTitle title="Notification log" />
        {notifications.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.logRow}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSubtitle}>{item.body}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle title="Care agent preview" />
        <Text style={styles.rowTitle}>
          {careContext?.memberName ?? profile.displayName}
          {careContext ? ` · ${careContext.currentConcernBand}` : ""}
        </Text>
        <Text style={styles.rowSubtitle}>
          {careContext?.summary ?? "This preview will summarize recent check-ins, signals, observations, and memory context once Supabase is connected."}
        </Text>
        {careContext ? (
          <Text style={styles.previewMeta}>
            {careContext.latestCheckIns.length} check-ins · {careContext.recentSignals.length} signals · {careContext.relevantMemories.length} memories
          </Text>
        ) : null}
      </Card>
    </ScreenView>
  )
}

function ToggleRow({
  icon: Icon,
  title,
  value,
  onValueChange,
}: {
  icon: typeof Bell
  title: string
  value: boolean
  onValueChange: (value: boolean) => void
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.iconWrap}>
        <Icon size={16} color={colors.foreground} />
      </View>
      <Text style={styles.rowTitle}>{title}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary, false: colors.muted }} />
    </View>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.xl },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowTitle: {
    color: colors.foreground,
    fontWeight: "600",
  },
  rowSubtitle: {
    color: colors.mutedForeground,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  devAction: {
    marginTop: spacing.md,
    minHeight: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  devActionText: {
    color: colors.secondaryForeground,
    fontWeight: "600",
  },
  logRow: {
    paddingVertical: spacing.sm,
  },
  previewMeta: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
})
