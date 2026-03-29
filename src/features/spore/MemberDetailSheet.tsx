import { useLocalSearchParams, useRouter } from "expo-router"
import { Calendar, Eye, Heart, Sparkles } from "lucide-react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useMemberCareSnapshot } from "@/src/features/spore/api"
import { useAppStore } from "@/src/store/app-store"
import { Card, PrimaryButton, SectionTitle } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function MemberDetailSheet() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const activeSporeId = useAppStore((state) => state.activeSporeId) ?? "spore-1"
  const { data } = useMemberCareSnapshot(activeSporeId, id)

  if (!data) {
    return <Text style={styles.title}>Loading member...</Text>
  }

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{data.member.avatar}</Text>
        </View>
        <Text style={styles.title}>{data.member.displayName}</Text>
        <Text style={styles.subtitle}>{data.member.status.replace("-", " ")} · {data.member.lastSeenLabel}</Text>
      </View>

      <View style={styles.preferenceWrap}>
        {data.member.supportPreferences.map((item) => (
          <View key={item} style={styles.preferenceChip}>
            <Text style={styles.preferenceText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metricRow}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{data.member.mood ?? "—"}/10</Text>
          <Text style={styles.metricLabel}>Recent mood</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{data.activeChallenges}</Text>
          <Text style={styles.metricLabel}>Challenges</Text>
        </Card>
      </View>

      <View style={styles.actionGrid}>
        <ActionCard icon={Heart} label="Send support" onPress={() => router.push({ pathname: "/modals/appreciation", params: { memberId: data.member.id } })} primary />
        <ActionCard icon={Eye} label="Observation" onPress={() => router.push({ pathname: "/modals/observation", params: { memberId: data.member.id } })} />
        <ActionCard icon={Sparkles} label="Invite to challenge" onPress={() => router.push("/modals/new-challenge")} />
        <ActionCard icon={Calendar} label="Suggest hangout" onPress={() => router.push({ pathname: "/modals/hangout", params: { memberId: data.member.id } })} />
      </View>

      <Card accent>
        <SectionTitle title="Feedback history" />
        {data.feedbackHistory.map((item) => (
          <View key={item.id} style={styles.feedbackRow}>
            <Text style={styles.feedbackText}>
              <Text style={styles.feedbackStrong}>{item.memberName}</Text> {item.content}
            </Text>
            <Text style={styles.feedbackTime}>{item.timestampLabel}</Text>
          </View>
        ))}
      </Card>

      <PrimaryButton label="Close" onPress={() => router.back()} />
    </View>
  )
}

function ActionCard({
  icon: Icon,
  label,
  onPress,
  primary,
}: {
  icon: typeof Heart
  label: string
  onPress: () => void
  primary?: boolean
}) {
  return (
    <Pressable onPress={onPress} style={[styles.actionCard, primary && styles.actionCardPrimary]}>
      <Icon size={16} color={primary ? colors.secondaryForeground : colors.foreground} />
      <Text style={[styles.actionLabel, primary && styles.actionLabelPrimary]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  header: { alignItems: "center", gap: spacing.xs },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 32 },
  title: { color: colors.foreground, fontSize: 22, fontWeight: "600" },
  subtitle: { color: colors.mutedForeground },
  preferenceWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  preferenceChip: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  preferenceText: { color: colors.mutedForeground, fontSize: 12 },
  metricRow: { flexDirection: "row", gap: spacing.md },
  metricCard: { flex: 1 },
  metricValue: { color: colors.foreground, fontSize: 22, fontWeight: "600" },
  metricLabel: { color: colors.mutedForeground, marginTop: 4, fontSize: 12 },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  actionCard: {
    width: "47%",
    minHeight: 56,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  actionCardPrimary: { backgroundColor: colors.secondary },
  actionLabel: { color: colors.foreground, fontSize: 13, fontWeight: "600" },
  actionLabelPrimary: { color: colors.secondaryForeground },
  feedbackRow: { paddingVertical: spacing.sm },
  feedbackText: { color: colors.mutedForeground, lineHeight: 18 },
  feedbackStrong: { color: colors.foreground, fontWeight: "600" },
  feedbackTime: { color: colors.mutedForeground, fontSize: 12, marginTop: 2 },
})
