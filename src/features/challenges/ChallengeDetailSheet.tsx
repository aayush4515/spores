import { useLocalSearchParams, useRouter } from "expo-router"
import { Check, Share2, Users } from "lucide-react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useCompleteChallenge, useJoinChallenge, useChallenges } from "@/src/features/challenges/api"
import { useAppStore } from "@/src/store/app-store"
import { Card, KeyValueRow, PrimaryButton, SecondaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function ChallengeDetailSheet() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const activeSporeId = useAppStore((state) => state.activeSporeId) ?? "spore-1"
  const currentUserId = useAppStore((state) => state.auth.profile?.id)
  const { data: challenges = [] } = useChallenges(activeSporeId)
  const complete = useCompleteChallenge(activeSporeId)
  const join = useJoinChallenge(activeSporeId)
  const challenge = challenges.find((item) => item.id === id)

  if (!challenge) {
    return <Text style={styles.title}>Loading challenge...</Text>
  }

  const joined = currentUserId ? challenge.participantIds.includes(currentUserId) : false
  const completed = currentUserId ? challenge.completedByIds.includes(currentUserId) : false
  const progress = Math.round((challenge.completedByIds.length / challenge.participantIds.length) * 100)

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.icon}>{challenge.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.subtitle}>{challenge.description}</Text>
        </View>
      </View>
      <Card accent>
        <KeyValueRow label="Progress" value={`${challenge.completedByIds.length}/${challenge.participantIds.length}`} />
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <KeyValueRow label="Duration" value={challenge.durationLabel} />
        <KeyValueRow label="Participants" value={`${challenge.participantIds.length} members`} />
      </Card>
      <View style={styles.participantRow}>
        <Users size={16} color={colors.mutedForeground} />
        <Text style={styles.subtleText}>{challenge.participantIds.length} people are growing together here.</Text>
      </View>
      <View style={styles.actions}>
        {!joined ? <SecondaryButton label="Join" onPress={() => join.mutate(challenge.id)} /> : null}
        {!completed ? (
          <PrimaryButton label={complete.isPending ? "Completing..." : "Mark complete"} onPress={async () => {
            await complete.mutateAsync(challenge.id)
            router.back()
          }} disabled={complete.isPending} />
        ) : (
          <PrimaryButton label="Done" onPress={() => router.back()} />
        )}
      </View>
      <Pressable
        style={styles.shareRow}
        onPress={() => router.push({ pathname: "/modals/new-challenge", params: { template: challenge.title } })}
      >
        <Share2 size={16} color={colors.foreground} />
        <Text style={styles.shareText}>Invite more members</Text>
      </Pressable>
      {completed ? (
        <View style={styles.doneRow}>
          <Check size={16} color={colors.primary} />
          <Text style={styles.doneText}>Your Spore health will refresh after completion.</Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  header: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  icon: { fontSize: 30 },
  title: { color: colors.foreground, fontSize: 22, fontWeight: "600" },
  subtitle: { color: colors.mutedForeground, marginTop: 4, lineHeight: 20 },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.muted,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  progressFill: { height: "100%", backgroundColor: colors.primary },
  participantRow: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  subtleText: { color: colors.mutedForeground, lineHeight: 18 },
  actions: { gap: spacing.md },
  shareRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.muted,
  },
  shareText: { color: colors.foreground, fontWeight: "600" },
  doneRow: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  doneText: { color: colors.primary, fontWeight: "600" },
})
