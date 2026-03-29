import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useCreateChallenge } from "@/src/features/challenges/api"
import { challengeTemplates, findChallengeTemplate } from "@/src/features/challenges/templates"
import { useSporeDetail } from "@/src/features/spore/api"
import { useAppStore } from "@/src/store/app-store"
import { InputField, Pill, PrimaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function NewChallengeFlow() {
  const router = useRouter()
  const { template: templateParam } = useLocalSearchParams<{ template?: string }>()
  const activeSporeId =
    useAppStore((state) => state.activeSporeId) ??
    useAppStore((state) => state.auth.profile?.activeSporeId) ??
    ""
  const currentUserId = useAppStore((state) => state.auth.profile?.id)
  const { data } = useSporeDetail(activeSporeId)
  const create = useCreateChallenge(activeSporeId)
  const [template, setTemplate] = useState(() => findChallengeTemplate(templateParam))
  const [title, setTitle] = useState(() => findChallengeTemplate(templateParam).title)
  const [description, setDescription] = useState(() => findChallengeTemplate(templateParam).description)
  const [durationLabel, setDurationLabel] = useState("7 days")
  const [participantIds, setParticipantIds] = useState<string[]>([])
  const [localError, setLocalError] = useState("")

  useEffect(() => {
    const next = findChallengeTemplate(templateParam)
    setTemplate(next)
    setTitle((current) => (current.trim() ? current : next.title))
    setDescription((current) => (current.trim() ? current : next.description))
  }, [templateParam])

  const submit = async () => {
    if (!activeSporeId) {
      setLocalError("Choose or create a Spore before starting a challenge.")
      return
    }

    setLocalError("")
    try {
      await create.mutateAsync({
        title,
        description,
        icon: template.icon,
        category: template.category,
        durationLabel,
        participantIds,
      })
      router.back()
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "We could not create this challenge right now.")
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>New challenge</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.templateGrid}>
        {challengeTemplates.map((item) => (
          <Pressable
            key={item.title}
            onPress={() => {
              setTemplate(item)
              setTitle(item.title)
              setDescription(item.description)
            }}
            style={[styles.templateCard, template.title === item.title && styles.templateCardSelected]}
          >
            <Text style={styles.templateIcon}>{item.icon}</Text>
            <Text style={[styles.templateLabel, template.title === item.title && styles.templateLabelSelected]}>{item.title}</Text>
            <Text style={[styles.templateDescription, template.title === item.title && styles.templateDescriptionSelected]}>{item.description}</Text>
          </Pressable>
        ))}
      </View>
      <InputField label="Title" value={title} onChangeText={setTitle} />
      <InputField label="Description" value={description} onChangeText={setDescription} multiline placeholder="Optional details for the group..." />
      <View style={styles.durationRow}>
        {["3 days", "7 days", "14 days", "30 days"].map((value) => (
          <Pill key={value} label={value} selected={durationLabel === value} onPress={() => setDurationLabel(value)} />
        ))}
      </View>
      <Text style={styles.sectionLabel}>Invite members</Text>
      <View style={styles.memberList}>
        {data?.members.filter((member) => member.id !== currentUserId).map((member) => {
          const selected = participantIds.includes(member.id)
          return (
            <Pressable
              key={member.id}
              onPress={() =>
                setParticipantIds((current) =>
                  selected ? current.filter((item) => item !== member.id) : [...current, member.id]
                )
              }
              style={[styles.memberRow, selected && styles.memberRowSelected]}
            >
              <Text style={[styles.memberEmoji, selected && styles.memberEmojiSelected]}>{member.avatar}</Text>
              <Text style={[styles.memberName, selected && styles.memberNameSelected]}>{member.displayName}</Text>
            </Pressable>
          )
        })}
      </View>
      {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
      <PrimaryButton
        label={create.isPending ? "Creating..." : "Create challenge"}
        onPress={submit}
        disabled={!title || create.isPending || !activeSporeId}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: colors.foreground, fontSize: 22, fontWeight: "600" },
  backButton: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: colors.foreground,
    fontWeight: "600",
    fontSize: 13,
  },
  headerSpacer: {
    width: 64,
  },
  templateGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  templateCard: {
    width: "47%",
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  templateCardSelected: { backgroundColor: colors.secondary, borderColor: colors.primary },
  templateIcon: { fontSize: 24 },
  templateLabel: { color: colors.foreground, fontWeight: "600", textAlign: "center" },
  templateLabelSelected: { color: colors.secondaryForeground },
  templateDescription: {
    color: colors.mutedForeground,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
  templateDescriptionSelected: {
    color: colors.secondaryForeground,
  },
  durationRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  sectionLabel: {
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    fontSize: 12,
  },
  errorText: {
    color: colors.destructive,
    lineHeight: 20,
  },
  memberList: { gap: spacing.sm },
  memberRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: "transparent",
  },
  memberRowSelected: { backgroundColor: colors.secondary, borderColor: colors.primary },
  memberEmoji: { fontSize: 22 },
  memberEmojiSelected: {
    transform: [{ scale: 1.04 }],
  },
  memberName: { color: colors.foreground, fontWeight: "600" },
  memberNameSelected: {
    color: colors.secondaryForeground,
  },
})
