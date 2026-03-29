import { ChevronRight, Heart, Plus } from "lucide-react-native"
import { useRouter } from "expo-router"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useAppStore } from "@/src/store/app-store"
import { useHomeSummary, useSetActiveSpore, useSporeDetail, useSporeInvites, useUserSpores } from "@/src/features/spore/api"
import { Card, Orb, PageHeader, PrimaryButton, ScreenView, SectionTitle, SecondaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function SporeScreen() {
  const router = useRouter()
  const activeSporeId = useAppStore((state) => state.activeSporeId)
  const { data: spores = [] } = useUserSpores()
  const { data: detail } = useSporeDetail(activeSporeId ?? spores[0]?.id ?? "")
  const { data: invites = [] } = useSporeInvites(detail?.summary?.id ?? activeSporeId ?? spores[0]?.id ?? "")
  const { mutateAsync: switchSpore } = useSetActiveSpore()
  const resolvedSpore = detail?.summary ?? spores[0] ?? null
  const health = detail?.health ?? null
  const members = detail?.members ?? []
  const challenges = detail?.challenges ?? []
  const activities = detail?.activities ?? []

  if (!detail && !spores.length) {
    return (
      <ScreenView>
        <PageHeader title="Your circle" subtitle="Loading your Spore..." />
      </ScreenView>
    )
  }

  if (!resolvedSpore || !health) {
    return (
      <ScreenView contentContainerStyle={styles.content}>
        <PageHeader
          eyebrow="Your circle"
          title="Your Spore will show up here"
          subtitle="Once you create or join a trusted circle, this page will fill in with members, health, support, and challenges."
        />

        <Card accent style={styles.emptyCard}>
          <Text style={styles.emptyEyebrow}>No active Spore</Text>
          <Text style={styles.emptyTitle}>Create one or join with an invite</Text>
          <Text style={styles.emptyBody}>
            Your account is live, but it is not a member of any Spore yet. Continue onboarding to finish the create or join flow.
          </Text>
          <PrimaryButton label="Continue onboarding" onPress={() => router.replace("/(onboarding)")} />
          <SecondaryButton label="Go to welcome" onPress={() => router.replace("/(auth)/welcome")} />
        </Card>
      </ScreenView>
    )
  }

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader
        eyebrow="Your circle"
        title={resolvedSpore.name}
        subtitle={`${resolvedSpore.memberCount} members growing together`}
        right={<Orb score={health.score} size={82} />}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sporeSwitcher}>
        {spores.map((spore) => {
          const active = spore.id === resolvedSpore.id
          return (
            <Pressable
              key={spore.id}
              onPress={() => switchSpore(spore.id)}
              style={[styles.sporeChip, active && styles.sporeChipActive]}
            >
              <Text style={[styles.sporeChipTitle, active && styles.sporeChipTitleActive]}>{spore.name}</Text>
              <Text style={[styles.sporeChipMeta, active && styles.sporeChipMetaActive]}>{spore.health}% health</Text>
            </Pressable>
          )
        })}
      </ScrollView>

      <View style={styles.inviteRow}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/modals/invite",
              params: { sporeId: resolvedSpore.id },
            })
          }
          style={styles.inviteButton}
        >
          <Text style={styles.inviteButtonText}>Invite</Text>
        </Pressable>
        <Text style={styles.inviteMeta}>
          {invites.length ? `${invites.length} active invite${invites.length === 1 ? "" : "s"}` : "Invite trusted friends into this Spore"}
        </Text>
      </View>

      <Card accent>
        <View style={styles.healthHeader}>
          <Text style={styles.healthLabel}>Spore wellness</Text>
          <Text style={styles.healthValue}>{health.score}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${health.score}%` }]} />
        </View>
        <Text style={styles.healthSummary}>{health.summary}</Text>
      </Card>

      <View>
        <SectionTitle title="Members" actionLabel="Workspace" onAction={() => router.push(`/spore/${resolvedSpore.id}`)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberRow}>
          {members.map((member) => (
            <Pressable
              key={member.id}
              onPress={() => router.push({ pathname: "/modals/member/[id]", params: { id: member.id } })}
              style={styles.memberItem}
            >
              <View style={[styles.memberAvatar, member.status === "needs-support" && styles.memberAvatarWatch]}>
                <Text style={styles.memberAvatarText}>{member.avatar}</Text>
              </View>
              <Text style={styles.memberName}>{member.displayName.split(" ")[0]}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View>
        <SectionTitle title="Challenges" actionLabel="All" onAction={() => router.push("/(tabs)/challenges")} />
        <View style={styles.list}>
          {challenges.slice(0, 2).map((challenge) => {
            const progress = Math.round((challenge.completedByIds.length / challenge.participantIds.length) * 100)
            return (
              <Pressable
                key={challenge.id}
                style={styles.challengeRow}
                onPress={() => router.push({ pathname: "/modals/challenge/[id]", params: { id: challenge.id } })}
              >
                <View style={styles.challengeIcon}>
                  <Text style={styles.challengeIconText}>{challenge.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                </View>
                <ChevronRight size={16} color={colors.mutedForeground} />
              </Pressable>
            )
          })}
        </View>
      </View>

      <View>
        <SectionTitle title="Recent support" />
        <View style={styles.list}>
          {activities.slice(0, 4).map((activity) => (
            <View key={activity.id} style={styles.activityRow}>
              <View style={styles.activityAvatar}>
                <Text>{activity.memberName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>
                  <Text style={styles.activityStrong}>{activity.memberName}</Text> {activity.content}
                </Text>
              </View>
              <Text style={styles.activityTime}>{activity.timestampLabel}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => router.push("/modals/appreciation")} style={styles.secondaryAction}>
          <Heart size={16} color={colors.foreground} />
          <Text style={styles.secondaryActionText}>Send support</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/modals/new-challenge")} style={styles.primaryAction}>
          <Plus size={16} color={colors.primaryForeground} />
          <Text style={styles.primaryActionText}>New challenge</Text>
        </Pressable>
      </View>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  emptyCard: {
    gap: spacing.md,
  },
  sporeSwitcher: {
    gap: spacing.sm,
  },
  emptyEyebrow: {
    fontSize: 12,
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  emptyTitle: {
    color: colors.foreground,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "600",
  },
  emptyBody: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 21,
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  sporeChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 146,
  },
  sporeChipActive: {
    backgroundColor: colors.secondary,
    borderColor: "transparent",
  },
  sporeChipTitle: {
    color: colors.foreground,
    fontWeight: "600",
  },
  sporeChipTitleActive: {
    color: colors.secondaryForeground,
  },
  sporeChipMeta: {
    marginTop: 4,
    color: colors.mutedForeground,
    fontSize: 12,
  },
  sporeChipMetaActive: {
    color: colors.secondaryForeground,
  },
  inviteButton: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteButtonText: {
    color: colors.foreground,
    fontWeight: "600",
    fontSize: 13,
  },
  inviteMeta: {
    color: colors.mutedForeground,
    fontSize: 13,
  },
  healthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  healthLabel: {
    color: colors.mutedForeground,
    fontSize: 14,
  },
  healthValue: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: "600",
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.muted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  healthSummary: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontSize: 13,
  },
  memberRow: {
    gap: spacing.md,
  },
  memberItem: {
    alignItems: "center",
    width: 70,
    gap: spacing.xs,
  },
  memberAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(93, 124, 100, 0.18)",
  },
  memberAvatarWatch: {
    borderColor: colors.warmth,
  },
  memberAvatarText: {
    fontSize: 24,
  },
  memberName: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: "600",
  },
  list: {
    gap: spacing.sm,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  challengeIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeIconText: {
    fontSize: 20,
  },
  challengeTitle: {
    color: colors.foreground,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  activityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
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
    color: colors.mutedForeground,
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 54,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  secondaryActionText: {
    color: colors.foreground,
    fontWeight: "600",
  },
  primaryAction: {
    flex: 1,
    minHeight: 54,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  primaryActionText: {
    color: colors.primaryForeground,
    fontWeight: "600",
  },
})
