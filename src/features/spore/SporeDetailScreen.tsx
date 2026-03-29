import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { SporeChatOverlay } from "@/src/features/spore/SporeChatOverlay"
import { useSporeDetail } from "@/src/features/spore/api"
import { Card, KeyValueRow, Orb, PageHeader, PrimaryButton, ScreenView, SectionTitle } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function SporeDetailScreen({ sporeId }: { sporeId: string }) {
  const router = useRouter()
  const { data } = useSporeDetail(sporeId)

  if (!data) {
    return (
      <ScreenView>
        <PageHeader title="Spore workspace" subtitle="Loading workspace..." />
      </ScreenView>
    )
  }

  if (!data.summary || !data.health) {
    return (
      <ScreenView contentContainerStyle={styles.content}>
        <PageHeader
          eyebrow="Workspace"
          title="This Spore is not available yet"
          subtitle="Finish joining a Spore before opening the shared workspace."
        />
        <Card accent style={styles.emptyCard}>
          <Text style={styles.emptyBody}>
            We could not load this workspace for your current account. Continue onboarding to create or join a trusted circle first.
          </Text>
          <PrimaryButton label="Continue onboarding" onPress={() => router.replace("/(onboarding)")} />
        </Card>
      </ScreenView>
    )
  }

  return (
    <View style={styles.container}>
      <ScreenView contentContainerStyle={styles.content}>
        <PageHeader
          eyebrow="Workspace"
          title={data.summary.name}
          subtitle={data.summary.description}
          right={<Orb score={data.health.score} size={74} />}
        />

        <Card accent>
          <SectionTitle title="Health summary" />
          <KeyValueRow label="Current score" value={`${data.health.score}%`} />
          <KeyValueRow label="Member baseline" value={`${data.health.baseline}%`} />
          <KeyValueRow label="Activity bonus" value={`+${data.health.activityBonus}%`} />
          <KeyValueRow label="Feedback penalty" value={`-${data.health.feedbackPenalty}%`} />
          <Text style={styles.summaryText}>{data.health.summary}</Text>
        </Card>

        <View>
          <SectionTitle title="Members" />
          <View style={styles.memberGrid}>
            {data.members.map((member) => (
              <Pressable
                key={member.id}
                style={styles.memberCard}
                onPress={() => router.push({ pathname: "/modals/member/[id]", params: { id: member.id } })}
              >
                <Text style={styles.memberAvatar}>{member.avatar}</Text>
                <Text style={styles.memberDisplayName}>{member.displayName}</Text>
                <Text style={styles.memberStatus}>{member.status.replace("-", " ")}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <SectionTitle title="Challenges" actionLabel="Create" onAction={() => router.push("/modals/new-challenge")} />
          {data.challenges.map((challenge) => (
            <Pressable
              key={challenge.id}
              style={styles.challengeCard}
              onPress={() => router.push({ pathname: "/modals/challenge/[id]", params: { id: challenge.id } })}
            >
              <Text style={styles.challengeIcon}>{challenge.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.challengeName}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View>
          <SectionTitle title="Activity feed" />
          {data.activities.map((item) => (
            <View key={item.id} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityBody}>
                  <Text style={styles.activityStrong}>{item.memberName}</Text> {item.content}
                </Text>
                <Text style={styles.activityTime}>{item.timestampLabel}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScreenView>

      <SporeChatOverlay sporeId={sporeId} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.xl,
  },
  emptyCard: {
    gap: spacing.md,
  },
  emptyBody: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 21,
  },
  summaryText: {
    marginTop: spacing.sm,
    color: colors.primary,
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  memberCard: {
    width: "47%",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberAvatar: {
    fontSize: 28,
  },
  memberDisplayName: {
    marginTop: spacing.sm,
    color: colors.foreground,
    fontWeight: "600",
  },
  memberStatus: {
    marginTop: 4,
    color: colors.mutedForeground,
    fontSize: 13,
    textTransform: "capitalize",
  },
  challengeCard: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  challengeIcon: {
    fontSize: 24,
  },
  challengeName: {
    color: colors.foreground,
    fontWeight: "600",
  },
  challengeDescription: {
    marginTop: 4,
    color: colors.mutedForeground,
  },
  activityRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  activityBody: {
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
    marginTop: 4,
  },
})
