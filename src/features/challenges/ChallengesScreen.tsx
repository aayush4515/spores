import { Check, Clock3, Users } from "lucide-react-native"
import { useRouter } from "expo-router"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useState } from "react"
import { useAppStore } from "@/src/store/app-store"
import { useChallenges } from "@/src/features/challenges/api"
import { challengeTemplates } from "@/src/features/challenges/templates"
import { useHomeSummary } from "@/src/features/spore/api"
import { Card, Orb, PageHeader, Pill, PrimaryButton, ScreenView, SectionTitle } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function ChallengesScreen() {
  const router = useRouter()
  const activeSporeId = useAppStore((state) => state.activeSporeId)
  const currentUserId = useAppStore((state) => state.auth.profile?.id)
  const { data: summary } = useHomeSummary(activeSporeId)
  const { data: challenges = [] } = useChallenges(activeSporeId ?? "")
  const [filter, setFilter] = useState<"active" | "completed">("active")
  const [selectedTemplateTitle, setSelectedTemplateTitle] = useState(challengeTemplates[0]?.title ?? "")
  const currentSporeHealth = summary?.currentSpore?.health ?? 72

  const filtered = challenges.filter((challenge) =>
    filter === "active"
      ? challenge.completedByIds.length < challenge.participantIds.length
      : challenge.completedByIds.length >= challenge.participantIds.length
  )

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader
        title="Grow together"
        subtitle="Every challenge nourishes your Spore."
        right={<Orb score={currentSporeHealth} size={52} />}
      />

      <Card accent>
        <View style={styles.impactRow}>
          <View>
            <Text style={styles.label}>Spore wellness</Text>
            <Text style={styles.score}>{currentSporeHealth}%</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>This month</Text>
            <Text style={styles.monthValue}>{challenges.length} active</Text>
          </View>
        </View>
      </Card>

      <View style={styles.pills}>
        <Pill label="Active" selected={filter === "active"} onPress={() => setFilter("active")} />
        <Pill label="Completed" selected={filter === "completed"} onPress={() => setFilter("completed")} />
      </View>

      <View style={styles.list}>
        {filtered.map((challenge) => {
          const completed = currentUserId ? challenge.completedByIds.includes(currentUserId) : false
          const progress = Math.round((challenge.completedByIds.length / challenge.participantIds.length) * 100)
          return (
            <Pressable
              key={challenge.id}
              style={styles.challengeCard}
              onPress={() => router.push({ pathname: "/modals/challenge/[id]", params: { id: challenge.id } })}
            >
              <View style={styles.challengeHeader}>
                <View style={styles.challengeIconWrap}>
                  <Text style={styles.challengeIcon}>{challenge.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeSubtitle}>{challenge.description}</Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <View style={styles.footerRow}>
                <View style={styles.footerMeta}>
                  <Users size={13} color={colors.mutedForeground} />
                  <Text style={styles.footerText}>{challenge.participantIds.length}</Text>
                  <Clock3 size={13} color={colors.mutedForeground} />
                  <Text style={styles.footerText}>{challenge.durationLabel}</Text>
                </View>
                {completed ? (
                  <View style={styles.doneTag}>
                    <Check size={12} color={colors.primary} />
                    <Text style={styles.doneText}>Done</Text>
                  </View>
                ) : (
                  <Text style={styles.markComplete}>Mark complete</Text>
                )}
              </View>
            </Pressable>
          )
        })}
      </View>

      <View>
        <SectionTitle title="Quick start" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>
          {challengeTemplates.map((item) => (
            <Pressable
              key={item.title}
              onPress={() => setSelectedTemplateTitle(item.title)}
              style={[styles.templateChip, selectedTemplateTitle === item.title && styles.templateChipSelected]}
            >
              <Text style={styles.templateIcon}>{item.icon}</Text>
              <Text style={styles.templateLabel}>{item.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <PrimaryButton
        label="Create challenge"
        onPress={() =>
          router.push({
            pathname: "/modals/new-challenge",
            params: { template: selectedTemplateTitle },
          })
        }
      />
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.xl },
  impactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: colors.mutedForeground,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  score: {
    color: colors.foreground,
    fontSize: 28,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  monthValue: {
    color: colors.primary,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  pills: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  challengeCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  challengeHeader: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  challengeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeIcon: { fontSize: 20 },
  challengeTitle: {
    color: colors.foreground,
    fontWeight: "600",
    fontSize: 16,
  },
  challengeSubtitle: {
    marginTop: 4,
    color: colors.mutedForeground,
    fontSize: 13,
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
  footerRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    color: colors.mutedForeground,
    fontSize: 12,
  },
  doneTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  doneText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  markComplete: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  templateRow: {
    gap: spacing.sm,
  },
  templateChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  templateChipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },
  templateIcon: {
    fontSize: 18,
  },
  templateLabel: {
    color: colors.foreground,
    fontWeight: "600",
  },
})
